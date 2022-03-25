import { createCachedAsyncFnc } from "./src/index";

/*
  In our example we wan't to generate a welcome message for each user.
  To mock some async operations we use a setTimeout to make the function execution longer
*/
function welcomeUser(name: string) {
  return new Promise<string>(resolve => {
    setTimeout(() => resolve(`Hi ${name}`), 400);
  });
}


async function main() {
  const cachedFunction = createCachedAsyncFnc(welcomeUser);

  // This is our list of users which we wanna welcome. Some users have the same nam
  const names = [
    "Bo",
    "Ryley",
    "Ryley",
    "Ryley",
    "Sasha",
    "Kaitlyn",
    "Kaitlyn",
    "Kaitlyn",
    "Kaitlyn",
    "Kaitlyn",
    "Marcos"
  ];

  console.log("-> Welcome each user WITHOUT our cachedAsyncFnc instance");
  const startWithout = Date.now();

  for (const name of names) {
    const welcome = await welcomeUser(name);
    console.log(welcome);
  }

  console.log(`<- completed after ${Date.now() - startWithout}ms`);

  // ===================================================================

  console.log("-> Welcome each user WITH our cachedAsyncFnc instance");
  const startWith = Date.now();

  for (const name of names) {
    const { data: welcome, status } = await cachedFunction.get(name);

    if (status === "HIT") {
      console.log(welcome + " [CACHED]");
    } else {
      console.log(welcome);
    }
  }

  console.log(`<- completed after ${Date.now() - startWith}ms`);
}

main();
