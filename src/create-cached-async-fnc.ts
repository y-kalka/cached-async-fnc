import { generateId } from "./generate-id";
import { toConsole } from "./to-console";

type Options = {
  debugName?: string;
  debug: boolean;
};

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
    const response: {
      status: "HIT" | "MISS";
      ms: number;
      data: Awaited<ReturnType<T> | undefined>;
    } = {
      status: "MISS",
      ms: 0,
      data: undefined,
    };

    if (cache.has(id)) {
      response.status = "HIT";
      response.data = cache.get(id);
    } else {
      // Resolve the promise
      const resolvedData = await resolveFunction(...args);

      // Save the data to the cache
      cache.set(id, resolvedData);

      response.data = resolvedData;
    }

    // Update the time
    response.ms = Date.now() - now;

    if (options?.debug === true) {
      toConsole(response.status, args, id, response.ms);
    }

    return response;
  };

  return { get };
}
