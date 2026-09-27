// schedule.js：整批排布（基线：一律给空表）
import { slotOf } from "./wheel.js";

export function planTicks(spec) {
  return { slots: [], loads: [], busiest: 0, busiest_at: 0, spans: [], total_rounds: 0 };
}
