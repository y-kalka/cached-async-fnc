import { createHash } from "crypto";

export function generateId(args: any[]): string {
  const stringified = JSON.stringify(args);
  const hash = createHash("sha1").update(stringified).digest("hex");
  return hash;
}
