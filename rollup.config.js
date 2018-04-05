import resolve from "rollup-plugin-node-resolve";

export default {
  input: "src/index.js",
  output: {
    file: "dist/vsup.js", 
    format: "umd",
    name: "vsup"
  },
  plugins: [
    resolve()
  ]
};
