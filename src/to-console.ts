const hit = `\x1b[1m\x1b[32mHIT\x1b[0m`;
const miss = `\x1b[1m\x1b[31mMISS\x1b[0m`;
const dim = (text: string) => `\x1b[2m${text}\x1b[0m`;

export function toConsole(
  type: "HIT" | "MISS",
  args: any,
  id: string,
  ms: number
) {
  const time = dim(`+${ms}ms`);
  const status = type === "HIT" ? hit : miss;
  const argsAsString = JSON.stringify(args);
  const logline = `cached-async-fnc: ${status} cache for ${argsAsString} (ID: ${id}) ${time}`;
  console.log(logline);
}
