import { cloneDeep } from "./clone-deep";
import { generateId } from "./generate-id";
import { toConsole } from "./to-console";

type Config = {
  debug: boolean;
};

/**
 * @description
 * This function creates a cachedAsyncFnc instance which you can use to execute the resolverFunction with different arguments.
 * @example
 * const cacheFnc = createCachedAsyncFnc(async (userId: string) => {
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
>(resolveFunction: T, options?: Config) {
  // Map to store Promise.resolve functions that will be resolved when the first if concurrent requests fulfills
  const waitingRequests = new Map<
    string,
    ((data: Awaited<ReturnType<T>>) => void)[]
  >();

  // The main cache were all resolved requests will be stored
  const cache = new Map<string, Awaited<ReturnType<T>>>();

  /**
   * @description
   * Query the cache.
   * @example
   * cacheFnc.get("001").then(({data}) => console.log(data))
   *
   * // or
   * const {data} = await cacheFnc.get("001");
   */
  const get = async (...args: Parameters<T>) => {
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
      response.data = cloneDeep(cache.get(id));
    }

    // When a active request exists for this request wait until the first request completes.
    else if (waitingRequests.has(id) === true) {
      // attach a defered resolve function to the active request
      const completed = new Promise<Awaited<ReturnType<T>>>((resolve) => {
        const defers = waitingRequests.get(id);

        if (!defers) {
          throw Error("Current request isn't registered in waitingRequests");
        }

        defers.push(resolve);
      });

      response.status = "HIT";
      response.data = cloneDeep(await completed);
    }

    // If no active request or cached request exists for this request. Execute it and save the response to cache
    else {
      // Register that there is a active request for this execution so new request will add a complete notifier
      waitingRequests.set(id, []);

      // Resolve the promise
      const resolvedData = await resolveFunction(...args);

      // Save the data to the cache
      cache.set(id, resolvedData);
      response.data = cloneDeep(resolvedData);

      // Notify all waiting requests
      const defereds = waitingRequests.get(id);
      if (defereds) {
        // Complete all waiting requests
        for (const defered of defereds) {
          defered(resolvedData);
        }
      }

      // Now clear all data for this request from the waitingRequests map
      waitingRequests.delete(id);
    }

    // Calculate past time
    response.ms = Date.now() - now;

    if (options?.debug === true) {
      toConsole(response.status, args, id, response.ms);
    }

    return response;
  };

  return { get };
}
