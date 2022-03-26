import test from "ava";
import { createCachedAsyncFnc } from "./create-cached-async-fnc";
import { sleep } from "./sleep";

const resolveFunction = async (name: string, age: number) => {
  if (age === 0) {
    return undefined;
  }

  return `${name} is ${age} years old`;
};

test("New calls are added to the cache", async (t) => {
  const cachedFnc = createCachedAsyncFnc(resolveFunction);

  const req1 = await cachedFnc.get("Max", 23);
  const req2 = await cachedFnc.get("Max", 23);

  t.is(req1.status, "MISS");
  t.is(req2.status, "HIT");
});

test("Returns the data of the resolveFunction", async (t) => {
  const cachedFnc = createCachedAsyncFnc(resolveFunction);

  const { data } = await cachedFnc.get("Max", 23);

  t.is(data, "Max is 23 years old");
});

test("Cache results for functions that return undefined", async (t) => {
  const cachedFnc = createCachedAsyncFnc(resolveFunction);

  const req1 = await cachedFnc.get("Max", 0);
  const req2 = await cachedFnc.get("Max", 0);

  t.is(req1.status, "MISS");
  t.is(req2.status, "HIT");
});

test("Cache uses cached data", async (t) => {
  const cachedFnc = createCachedAsyncFnc(async () => {
    await sleep(2000);
    return "ok";
  });

  const req1 = await cachedFnc.get();
  const req2 = await cachedFnc.get();

  t.true(req1.ms > 1000);
  t.true(req2.ms < 10);
});

test("Use cache for concurrent requests", async (t) => {
  const cachedFnc = createCachedAsyncFnc(async (name: string) => {
    await sleep(2000);
    return "Hi " + name;
  });

  const [req1, req2] = await Promise.all([
    cachedFnc.get("Mark"),
    cachedFnc.get("Mark"),
  ]);

  t.is(req1.status, "MISS");
  t.is(req1.data, "Hi Mark");
  t.is(req2.status, "HIT");
  t.is(req2.data, "Hi Mark");
});
