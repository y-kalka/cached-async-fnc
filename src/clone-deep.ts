export function cloneDeep<T>(obj: T): T {
  if (
    typeof obj === "string" ||
    typeof obj === "number" ||
    typeof obj === "boolean" ||
    typeof obj === "undefined" ||
    obj === null
  ) {
    return obj;
  }

  // Use global structuredClone if available
  // @ts-ignore
  if (typeof globalThis.structuredClone === "function") {
    // @ts-ignore
    return structuredClone(obj);
  }

  return JSON.parse(JSON.stringify(obj));
}
