// ui.js：操作面板与视图（原生 DOM，无弹窗）
import { render } from "./app.js";

export function mount(spec, parts) {
  parts.log.textContent = "槽位 " + (spec.size || 0) + " 个，时刻 " + (spec.ticks || []).length + " 个。";

  function draw() {
    let view = null;
    try {
      view = render(spec);
    } catch (error) {
      parts.out.textContent = String(error && error.code ? error.code : error);
      parts.log.textContent = "跑不动：" + String(error && error.message ? error.message : error);
      return;
    }
    parts.out.textContent = JSON.stringify(view, null, 1);
    parts.stage.textContent = "";
    (view.loads || []).forEach(function (count, spot) {
      const row = document.createElement("div");
      row.className = "row";
      const head = document.createElement("span");
      head.textContent = "槽位 " + spot;
      row.appendChild(head);
      const bar = document.createElement("span");
      bar.className = "bar";
      const fill = document.createElement("i");
      fill.style.width = Math.min(100, count * 20) + "%";
      bar.appendChild(fill);
      row.appendChild(bar);
      const mark = document.createElement("span");
      mark.className = "chip" + (spot === view.busiest_at ? " ok" : "");
      mark.textContent = count + " 个时刻";
      row.appendChild(mark);
      parts.stage.appendChild(row);
    });
    parts.legend.textContent = "最忙槽位 " + view.busiest_at + " 排了 " + view.busiest + " 个，圈数合计 " + view.total_rounds;
    parts.log.textContent = view.count + " 个时刻，" + (view.loads_ok ? "负载守恒" : "负载对不上");
  }

  const valueInput = document.createElement("input");
  valueInput.type = "number";
  valueInput.value = "11";
  parts.controls.appendChild(valueInput);

  const runButton = document.createElement("button");
  runButton.className = "primary";
  runButton.textContent = "重排槽位";
  runButton.addEventListener("click", draw);
  parts.controls.appendChild(runButton);

  const addButton = document.createElement("button");
  addButton.textContent = "追加一个时刻";
  addButton.addEventListener("click", function () {
    const next = Number(valueInput.value);
    spec.ticks = (spec.ticks || []).concat([Number.isFinite(next) ? next : 0]);
    draw();
  });
  parts.controls.appendChild(addButton);

  const dropButton = document.createElement("button");
  dropButton.textContent = "删最后一个时刻";
  dropButton.addEventListener("click", function () {
    spec.ticks = (spec.ticks || []).slice(0, Math.max(0, (spec.ticks || []).length - 1));
    draw();
  });
  parts.controls.appendChild(dropButton);

  const wideButton = document.createElement("button");
  wideButton.textContent = "槽位加一";
  wideButton.addEventListener("click", function () {
    spec.size = (spec.size || 1) + 1;
    draw();
  });
  parts.controls.appendChild(wideButton);

  const narrowButton = document.createElement("button");
  narrowButton.textContent = "槽位减一";
  narrowButton.addEventListener("click", function () {
    spec.size = Math.max(1, (spec.size || 1) - 1);
    draw();
  });
  parts.controls.appendChild(narrowButton);

  draw();
}
