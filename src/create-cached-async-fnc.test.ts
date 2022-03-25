import test from "ava";
import { createCachedAsyncFnc } from "./create-cached-async-fnc";

const resolveFunction = async (name: string, age: number) => {
  if (age === 0) {
    return undefined;
  }

  return `${name} is ${age} years old`;
};

test("New calls are added to the cache", async (t) => {
  const cachedFnc = createCachedAsyncFnc(resolveFunction, { debug: true });

  const req1 = await cachedFnc.get("Max", 23);
  const req2 = await cachedFnc.get("Max", 23);

  t.is(req1.status, "MISS");
  t.is(req2.status, "HIT");
});

test("Returns the data of the resolveFunction", async (t) => {
  const cachedFnc = createCachedAsyncFnc(resolveFunction, { debug: true });

  const { data } = await cachedFnc.get("Max", 23);

  t.is(data, "Max is 23 years old");
});

test("Cache results for functions that return undefined", async (t) => {
  const cachedFnc = createCachedAsyncFnc(resolveFunction, { debug: true });

  const req1 = await cachedFnc.get("Max", 0);
  const req2 = await cachedFnc.get("Max", 0);

  t.is(req1.status, "MISS");
  t.is(req2.status, "HIT");
});

test("Cache uses cached data", async (t) => {
  const cachedFnc = createCachedAsyncFnc(
    () => {
      return new Promise<string>((resolve) => {
        setTimeout(() => resolve("ok"), 2000);
      });
    },
    { debug: true }
  );

  const req1 = await cachedFnc.get();
  const req2 = await cachedFnc.get();

  t.true(req1.ms > 1000);
  t.true(req2.ms < 10);
});
