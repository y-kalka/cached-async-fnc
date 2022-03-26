const { createCachedAsyncFnc } = require("cached-async-fnc");

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}

const resolveFnc = async (name) => {
  await wait(1000);
  return "Hi " + name;
};

const cache = createCachedAsyncFnc(resolveFnc);

async function main() {
  console.log(await cache.get("Mark"));
  console.log(await cache.get("Mark"));
}

main();
