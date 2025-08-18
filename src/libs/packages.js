
export const packages = [
   {
    name : "@yash580o/full-pad",
    install:"npm install @yash580o/full-pad",
    description :{
      text: "@yash580o/full-pad is a lightweight npm package for padding strings with a given character.It replaces spaces with padded characters and also adds padding to both ends of the string.",
      usage:`const fullPad = require('@yash580o/full-pad');
// Example 1: Pad with '*', 3 times
console.log(fullPad("hello world", "*", 3));
// Output: ***hello***world***

// Example 2: Pad with '-', 2 times
console.log(fullPad("foo bar", "-", 2));
// Output: --foo--bar--

// Example 3: No padding
console.log(fullPad("test", "", 0));
// Output: test
      `
    },
    npmlink: "https://www.npmjs.com/package/@yash580o/full-pad"
  }
]