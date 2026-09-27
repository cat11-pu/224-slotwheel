// app.js：渲染结果
import { slotOf } from "./wheel.js";
import { planTicks } from "./schedule.js";

export function render(spec) {
  const size = spec.size || 0;
  const view = planTicks(spec);
  const slots = view.slots || [];
  const loads = view.loads || [];
  const tally = loads.map(function (count, spot) {
    return slots.filter(function (value) { return value === spot; }).length;
  });
  return { slots: slots, loads: loads, busiest: view.busiest || 0, busiest_at: view.busiest_at || 0,
           spans: view.spans || [], total_rounds: view.total_rounds || 0, count: slots.length,
           loads_ok: tally.length === loads.length && tally.every(function (n, spot) { return n === loads[spot]; }),
           tail: slotOf(7, 4) };
}
