import resolve from "rollup-plugin-node-resolve";

export default {
  input: "src/index.js",
  output: {
    file: "build/vsup.js", 
    format: "iife",
    name: "vsup"
  },
  plugins: [
    resolve()
  ]
};
