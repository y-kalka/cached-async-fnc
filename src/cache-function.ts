/**
 * Wraps a function so that subsequent calls are returned from the cache. This works with sync and async functions aswell.
 */
export class CachedFunction<T extends (...args: any[]) => any> {
  #fnc: T;
  #cache = new Map<string, ReturnType<T>>();

  constructor(fnc: T) {
    this.#fnc = fnc;
  }

  #serializeArgsToId(...args: unknown[]): string {
    let id = "";

    if (!args || args.length === 0) {
      throw Error("Can not generate a cached ID without any arguments");
    }

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];

      if (
        typeof arg === "string" ||
        typeof arg === "number" ||
        typeof arg === "boolean" ||
        typeof arg === "bigint"
      ) {
        id += arg.toString();
      } else {
        throw Error(`Argument ${i + 1} is not serializeable`);
      }
    }

    if (!id) {
      throw Error("Empty cache id generated");
    }

    return id;
  }

  get(...args: Parameters<T>): ReturnType<T> {
    const cacheId = this.#serializeArgsToId(args);
    let execution = this.#cache.get(cacheId);

    if (execution === undefined) {
      execution = this.#fnc(...args);
      this.#cache.set(cacheId, execution as any);
    }

    return execution as any;
  }
}
