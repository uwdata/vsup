import resolve from "rollup-plugin-node-resolve";

export default {
  input: "src/index.js",
  output: {
    file: "dist/bvu.js", 
    format: "iife"
  },
  name: "bvu",
  plugins: [
    resolve()
  ]
};