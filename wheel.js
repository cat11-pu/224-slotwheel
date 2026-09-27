// wheel.js：一个时刻落在哪个槽位（时刻对槽位数取余）
export function slotOf(tick, size) {
  if (!Number.isInteger(size) || size <= 0) {
    const error = new Error("槽位数必须是正整数，收到 " + String(size));
    error.code = "E_BAD_SIZE";
    throw error;
  }
  if (!Number.isInteger(tick) || tick < 0) {
    const error = new Error("时刻必须是非负整数，收到 " + String(tick));
    error.code = "E_BAD_TICK";
    throw error;
  }
  return tick % size;
}
