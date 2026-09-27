import assert from "node:assert";
import { slotOf } from "../wheel.js";
import { planTicks } from "../schedule.js";
import { render } from "../app.js";

let failed = 0;
function check(name, fn) {
  try { fn(); console.log("ok " + name); } catch (e) { failed += 1; console.log("FAIL " + name + " :: " + e.message); }
}

check("slotOf returns a number", () => {
  assert.strictEqual(typeof slotOf(3, 4), "number");
});

check("planTicks returns slots", () => {
  assert.ok(Array.isArray(planTicks({ size: 2, ticks: [1] }).slots));
});

check("planTicks returns loads", () => {
  assert.ok(Array.isArray(planTicks({ size: 2, ticks: [1] }).loads));
});

check("render counts slots", () => {
  assert.strictEqual(typeof render({ size: 2, ticks: [1] }).count, "number");
});

check("render exposes loads flag", () => {
  assert.strictEqual(typeof render({ size: 2, ticks: [1] }).loads_ok, "boolean");
});

console.log("5 cases, " + failed + " failed");
process.exit(failed === 0 ? 0 : 1);
