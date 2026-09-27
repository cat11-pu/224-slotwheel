// wheel.js：一个时刻落在哪个槽位
export function slotOf(tick, size) {
  if (!Number.isInteger(size) || size <= 0) {
    const error = new Error("size must be a positive integer");
    error.code = "E_BAD_SIZE";
    throw error;
  }
  if (!Number.isInteger(tick) || tick < 0) {
    const error = new Error("tick must be a non-negative integer");
    error.code = "E_BAD_TICK";
    throw error;
  }
  return tick % size;
}
