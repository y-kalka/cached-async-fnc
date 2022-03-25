import { generateId } from "./generate-id";

type Options = {
  debugName?: string;
  debug: boolean;
};

const hit = `\x1b[1m\x1b[32mHIT\x1b[0m`;
const miss = `\x1b[1m\x1b[31mMISS\x1b[0m`;

function toLogLine(type: "HIT" | "MISS", args: any, id: string) {
  return `cached-async-fnv: ${
    type === "HIT" ? hit : miss
  } cache for ${JSON.stringify(args)} (ID: ${id})`;
}

/**
 * @description
 * Creates a new function cache.
 * @example
 * createCachedAsyncFnc(async (userId: string) => {
 *   const user = await fetchUser(userId);
 *
 *   return {
 *     id: user.id,
 *     name: "Foo",
 *   };
 * })
 */
export function createCachedAsyncFnc<
  T extends (...args: any[]) => Promise<any>
>(resolveFunction: T, options?: Options) {
  const cache = new Map<string, Awaited<ReturnType<T>>>();

  const get = async (
    ...args: Parameters<T>
  ): Promise<{
    status: "HIT" | "MISS";
    ms: number;
    data: Awaited<ReturnType<T> | undefined>;
  }> => {
    const now = Date.now();
    const id = generateId(args);

    if (cache.has(id)) {
      if (options?.debug === true) {
        console.log(toLogLine("HIT", args, id));
      }

      return {
        status: "HIT",
        ms: Date.now() - now,
        data: cache.get(id),
      };
    }

    // Resolve the promise
    const resolvedData = await resolveFunction(...args);

    // Save the data to the cache
    cache.set(id, resolvedData);

    if (options?.debug === true) {
      console.log(toLogLine("MISS", args, id));
    }

    return {
      status: "MISS",
      ms: Date.now() - now,
      data: resolvedData,
    };
  };

  return { get };
}
