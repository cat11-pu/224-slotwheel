import fs from "node:fs";
import { slotOf } from "./wheel.js";
import { planTicks } from "./schedule.js";
import { render } from "./app.js";

// 验收断言：上面每条值收进 emit，最后与期望值逐项比对，不符就非零退出。
const __lines = [];
function emit(label, value) { __lines.push([String(label).replace(/ =$/, ""), value]); }


const spec = JSON.parse(fs.readFileSync(process.argv[2] || "sample/ticks.json", "utf8"));
const view = render(spec);

emit("每个时刻的槽位 =", JSON.stringify(view.slots));
emit("每个槽位的负载 =", JSON.stringify(view.loads));
emit("最忙槽位个数 =", view.busiest);
emit("最忙槽位位置 =", view.busiest_at);
emit("圈数合计 =", view.total_rounds);
emit("时刻数 =", view.count);
emit("负载守恒 =", view.loads_ok);
emit("末尾槽位 =", view.tail);


// ---- 异常路径探针：真调用实现，看它报出什么码（不是从样例里抄）----
try {
  planTicks({ size: 4, ticks: [-1] });
  emit("时刻写错的错误码", "没有报错");
} catch (error) {
  emit("时刻写错的错误码", error && error.code ? error.code : String(error.message));
}
try {
  planTicks({ size: 0, ticks: [1] });
  emit("槽位写错的错误码", "没有报错");
} catch (error) {
  emit("槽位写错的错误码", error && error.code ? error.code : String(error.message));
}


// ---- 期望值（参考模型算出，与题面给的验收数值一致）----
const EXPECTED = {
  "每个时刻的槽位": [
    3,
    3,
    0,
    3,
    1,
    0
  ],
  "每个槽位的负载": [
    2,
    1,
    0,
    3
  ],
  "最忙槽位个数": 3,
  "最忙槽位位置": 3,
  "圈数合计": 4,
  "时刻数": 6,
  "负载守恒": true,
  "末尾槽位": 3,
  "时刻写错的错误码": "E_BAD_TICK",
  "槽位写错的错误码": "E_BAD_SIZE"
};
// 有的值在收进来之前已经 stringify 过，比较前先试着解析回来，避免类型错配把正确实现判成不过。
function __same(got, want) {
  if (typeof got === "string") {
    try { const parsed = JSON.parse(got); if (JSON.stringify(parsed) === JSON.stringify(want)) return true; } catch (error) { /* 不是 JSON 就按原文比 */ }
  }
  return JSON.stringify(got) === JSON.stringify(want);
}
let __bad = 0;
for (const [label, want] of Object.entries(EXPECTED)) {
  const found = __lines.find((pair) => pair[0] === label);
  if (!found) { __bad += 1; console.log("缺失验收项 " + label); continue; }
  const got = found[1];
  if (__same(got, want)) { console.log("一致 " + label + " = " + JSON.stringify(got)); }
  else { __bad += 1; console.log("不一致 " + label + " 期望 " + JSON.stringify(want) + " 实际 " + JSON.stringify(got)); }
}
console.log("验收项 " + (Object.keys(EXPECTED).length - __bad) + "/" + Object.keys(EXPECTED).length + " 通过");
process.exit(__bad === 0 ? 0 : 1);
