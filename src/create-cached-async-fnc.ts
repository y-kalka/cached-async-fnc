import { generateId } from "./generate-id";

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
>(resolveFunction: T) {
  const cache = new Map<string, Awaited<ReturnType<T>>>();

  return {
    has(...args: Parameters<T>): boolean {
      return cache.has(generateId(args));
    },

    async get(...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> {
      const id = generateId(args);

      // Return cached data if available
      const cached = cache.get(id);
      if (cached !== undefined) return cached;

      // Resolve the promise
      const resolvedData = await resolveFunction(...args);

      // Save the data to the cache
      cache.set(id, resolvedData);

      return resolvedData;
    },
  };
}
