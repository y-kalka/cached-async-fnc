# cached-async-fnc

A typesafe function execution cache that prevents execution if the function gets the same arguments twice.

![Demo](demo/demo.gif)
You can find the code for the demo [here](demo/demo.ts)

## Features

- ✅&nbsp; Full type safety when using typescript
- ☀️&nbsp; Lightweight. No other dependencies will come with this package
- ♻️&nbsp; Supports concurrent requests. If the same query is executed twice all following queries will wait until the first one resolves and reuse the data

## Install

```shell
# For npm
npm install --save cached-async-fnc

# For yarn
yarn add --save cached-async-fnc

# For pnpm
pnpm install --save cached-async-fnc
```

## Getting started

```typescript
import { createCachedAsyncFnc } from "cached-async-fnc";

/*
Create a resolver function. This function will be executed in case
the cache has no response for this request
*/
async function doSomeHeavyWork(userId: string) {

  // Do the heavy work here ...

  return {
    userId: userId;
  }
}

const heavyWorkCache = createCachedAsyncFnc(doSomeHeavyWork)

// Now request the cache to give you the data
const { status, data, ms } = await heavyWorkCache.get("0001")

console.log(data.userId)  // "0001"

/*
This line gives us a typescript error because the .test property
does not exists in the ReturnType of the "doSomeHeavyWork()" function
*/
console.log(data.test)
```

## API

TBD
