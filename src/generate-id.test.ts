import test from "ava";
import { generateId } from "./generate-id";

test("Generates a id from arguments", (t) => {
  const testId = generateId(["test", 2]);
  t.is(testId, "ea38d13ec9f5ca1c52553938076eb7c7a0a29a37");

  const testId2 = generateId(["test", 2, Symbol("test")]);
  t.is(testId2, "944aaf0dfbb58f0339813ae6427d280fd852f683");
});

test("Generates a stable id", (t) => {
  const testId = generateId(["test", 2]);
  const testId2 = generateId(["test", 2]);
  t.is(testId, testId2);
});
