import { expect, test } from "vitest";
import { CachedFunction } from "./cache-function";
import { sleep } from "./sleep";

test("should reuse the cached response", async () => {
  const fnc = new CachedFunction(async (name: string) => {
    await sleep(200);

    return name;
  });

  const startTime = Date.now();

  await fnc.get("Mark");
  await fnc.get("Mark");
  await fnc.get("Mark");
  await fnc.get("Mark");
  await fnc.get("Mark");
  await fnc.get("Mark");
  await fnc.get("Mark");

  const timeTaken = Math.round((Date.now() - startTime) / 10) * 10; // Remove any ms in the last digit so we do not get 200ms instead of 201ms
  expect(timeTaken).toBe(200);
});

test("should reuse the cached response for multiple parallel request", async () => {
  const fnc = new CachedFunction(async (name: string) => {
    await sleep(200);

    return name;
  });

  const startTime = Date.now();

  await Promise.all([
    fnc.get("Mark"),
    fnc.get("Mark"),
    fnc.get("Mark"),
    fnc.get("John"),
    fnc.get("Mark"),
    fnc.get("Mark"),
    fnc.get("Mark"),
  ]);

  const timeTaken = Math.round((Date.now() - startTime) / 10) * 10; // Remove any ms in the last digit so we do not get 200ms instead of 201ms
  expect(timeTaken).toBe(200);
});
