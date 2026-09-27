// schedule.js：整批排布（一次扫描，每个时刻只取一次余）
import { slotOf } from "./wheel.js";

export function planTicks(spec) {
  const size = spec ? spec.size : undefined;
  if (!Number.isInteger(size) || size <= 0) {
    const error = new Error("size must be a positive integer");
    error.code = "E_BAD_SIZE";
    throw error;
  }
  const ticks = (spec && spec.ticks) || [];
  const slots = new Array(ticks.length);
  const spans = new Array(ticks.length);
  const loads = new Array(size).fill(0);
  let total_rounds = 0;
  for (let k = 0; k < ticks.length; k += 1) {
    const tick = ticks[k];
    const slot = slotOf(tick, size);
    slots[k] = slot;
    loads[slot] += 1;
    const span = Math.floor(tick / size);
    spans[k] = span;
    total_rounds += span;
  }
  let busiest = 0;
  let busiest_at = 0;
  for (let spot = 0; spot < size; spot += 1) {
    if (loads[spot] > busiest) {
      busiest = loads[spot];
      busiest_at = spot;
    }
  }
  return { slots: slots, loads: loads, busiest: busiest, busiest_at: busiest_at, spans: spans, total_rounds: total_rounds };
}
