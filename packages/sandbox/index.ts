import * as fs from "fs";
import { parseJSX } from "@freestyles/core";
import { css, cx, cache } from "@emotion/css";

const theme = {};

// const c1 = css({
//   color: "red",
// });
// const c2 = css({
//   background: "salmon",
// });
// const c3 = css({
//   border: "1px solid blue",
// });
// const c4 = css({
//   border: "2px solid red",
// });
//
// const res = cx({
//   [c1]: true,
//   [c2]: true,
//   [c3]: false,
//   [c4]: true,
// });

const code = fs.readFileSync("./index.jsx", "utf-8");

const { code: parsedCode } = parseJSX(code, theme);

console.log(parsedCode);
