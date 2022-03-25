import test from "ava";
import { createCachedAsyncFnc } from "./create-cached-async-fnc";

const resolveFunction = async (name: string, age: number) => {
  return `${name} is ${age} years old`;
};

const cachedFnc = createCachedAsyncFnc(resolveFunction);

test("New calls are added to the cache", async (t) => {
  t.false(cachedFnc.has("Max", 23));
  await cachedFnc.get("Max", 23);
  t.true(cachedFnc.has("Max", 23));
});

test("Returns the data of the resolveFunction", async (t) => {
  const cached = await cachedFnc.get("Max", 23);
  t.is(cached, "Max is 23 years old");
});
