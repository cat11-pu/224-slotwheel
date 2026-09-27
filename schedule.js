// schedule.js：整批排布（一次扫描，每个时刻只取一次余）
import { slotOf } from "./wheel.js";

export function planTicks(spec) {
  const size = spec.size;
  if (!Number.isInteger(size) || size <= 0) {
    const error = new Error("槽位数必须是正整数，收到 " + String(size));
    error.code = "E_BAD_SIZE";
    throw error;
  }
  const ticks = Array.isArray(spec.ticks) ? spec.ticks : [];
  const slots = [];
  const spans = [];
  const loads = new Array(size).fill(0);
  let total_rounds = 0;

  for (const tick of ticks) {
    const slot = slotOf(tick, size);
    slots.push(slot);
    loads[slot] += 1;
    const rounds = Math.floor(tick / size);
    spans.push(rounds);
    total_rounds += rounds;
  }

  let busiest = 0;
  let busiest_at = 0;
  for (let spot = 0; spot < size; spot += 1) {
    if (loads[spot] > busiest) {
      busiest = loads[spot];
      busiest_at = spot;
    }
  }

  return { slots, loads, busiest, busiest_at, spans, total_rounds };
}
