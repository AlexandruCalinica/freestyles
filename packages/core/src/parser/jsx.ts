import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import generate from "@babel/generator";
import {
  JSXAttribute,
  jSXAttribute,
  JSXIdentifier,
  StringLiteral,
  jSXIdentifier,
  stringLiteral,
  isJSXOpeningElement,
} from "@babel/types";

import { css, styledSystem } from "../styler";
import domElements from "../utils/domElements";
import stripStyleAttributes from "../utils/stripStyleAttributes";

function parseJSX(code: string, theme: object = {}) {
  const ast = parse(code, { plugins: ["jsx"] });

  traverse(ast, {
    enter(path) {
      if (
        isJSXOpeningElement(path.node) &&
        domElements.has((path.node.name as JSXIdentifier).name)
      ) {
        if (path.node.attributes.length === 0) return;

        // handle different Value nodes. e.g. StringLiteral, NumericLiteral, etc.

        const rawProps = path.node.attributes.reduce(
          (acc, curr) => ({
            ...acc,
            [(curr as JSXAttribute).name.name as string]: (
              (curr as JSXAttribute).value as StringLiteral
            ).value,
          }),
          {}
        );

        const styledProps = styledSystem(rawProps)(theme);
        const className = css(styledProps as any);

        path.node.attributes = stripStyleAttributes(
          path.node.attributes,
          Object.keys(styledProps)
        );

        const classNameAttr = jSXAttribute(
          jSXIdentifier("className"),
          stringLiteral(className)
        );

        path.node.attributes.push(classNameAttr);
      }
    },
  });

  return generate(ast);
}

export default parseJSX;
