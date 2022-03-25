# cached-async-fnc

A typesafe function execution cache.

```typescript
// Create a resolver function. This function will be executed in case the cache has no response for this request
const resolveFunction = async (userId: string) => {

  // Do your async task
  const user = await fetchUserFromDb(userId)

  return {
    name: user.name,
    age: user.age,
    description: `${user.name} is ${user.age} years old`,
  };
};

// Now create the cachedAsyncFnc instance.
const cachedFnc = createCachedAsyncFnc(resolveFunction);

// Now request the cache to give you the data
const data = await cachedFnc.get("0001");

console.log(data)       // { name: "Max", age: 23, description: "Max is 23 years old" }
console.log(data.test)  // this throws a typescript error because the resolve function return type has no "test" field
```