const merger = (state, newState) => {
    Object.keys(newState).forEach((key) => {
        if (typeof newState[key] != 'object') {
            state[key] = newState[key];
        } else {
            if (!state.hasOwnProperty(key) || typeof state[key] != typeof newState[key]) {
                state[key] = newState[key];
            }
            merger(state[key], newState[key]);
        }
    });
};

const objMerge = (state, newState) => {
    const stateRef = {...state}; //shallow copy of the state, to throw off the silly react

    merger(stateRef, newState);
    return stateRef;
};

//////// TEST
// const state = {
//     state: {
//         a: {a1: 0},
//         b: {
//             b1: 0,
//         },
//         d: 2, //wont change
//     },
// };
// const newState = {
//     newState: {
//         a: 2, // switch obj with number
//         b: {
//             b1: {b1a: 2, b1b: {b1b1: 2}}, //switch number with obj
//         },
//         //add item
//         c: {
//             a: 2,
//         },
//     },
// };

// objMerge(state,newState);

// console.log(state);
// console.log(newState);

/*

**hey does someone have experience with merging react functional component state?**

I can't figure out how to do this.
react prevents me from setting the state because I mutate it. but there is no way around it.
I have this `objectMerge` function which merges two objects and then returns a merged one.
```js
  setState(objectMerge(state, newState));
```
    
the thing is... the state has some **references**, and I can't just make a copy of them in the merged object then return it as the newState to `setState`.
I really need those to be references.

here is the merging function:
```js
  const objMerge = (state, newState) => {
    const stateRef = {...state};// a shallow copy so react let me set my state

    merger(stateRef, newState);//merges the two objects into the first one, therefore changing the first one (stateRef)
    return stateRef;//returns the one that has all the properties (the merging output)
  };
```

I figured out that a shallow copy of the state is enough to throw off silly react, but again I have references at the first level of the object.
Is there a solution or should I just push my references to the second level in the object, and then **change all the code that uses it**.

the object:
```js
state = {
  weekRef: someObjectsRef,//this is what I have
  badassRef: {ref: someObjectsRef},//should I just do this???
}
```



*/

export default objMerge;
