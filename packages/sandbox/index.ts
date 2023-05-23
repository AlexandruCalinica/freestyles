import * as fs from "fs";
import parseJSX from "@freestyles/core/src/parser/jsx";
import { getCssStyles } from "@freestyles/core/src/styler";

const theme = {};

const code = fs.readFileSync("./src/sandbox/index.jsx", "utf-8");

const { code: parsedCode } = parseJSX(code, theme);

console.log("parsedCode ----------------------------> \n\n", parsedCode + "\n");
console.log(
  "getCssStyles ----------------------------> \n\n",
  getCssStyles() + "\n"
);
