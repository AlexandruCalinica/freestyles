import { parse } from "@babel/parser";
import _traverse from "@babel/traverse";
import _generate from "@babel/generator";
import type {
  JSXAttribute,
  JSXIdentifier,
  StringLiteral,
  ConditionalExpression,
  JSXExpressionContainer,
} from "@babel/types";
import {
  jSXAttribute,
  jSXIdentifier,
  stringLiteral,
  isJSXOpeningElement,
} from "@babel/types";

import { extractLiteralProps, extractConditionalProp } from "../styler";
import domElements from "../utils/domElements";
import stripStyleAttributes from "../utils/stripStyleAttributes";
import parseConditional from "../utils/parseConditional";
import makeCXExpression from "../utils/makeCXExpression";

// @ts-ignore
const traverse = _traverse.default as typeof _traverse;
// @ts-ignore
const generate = _generate.default as typeof _generate;

function parseJSX(code: string, theme: object = {}) {
  const ast = parse(code, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });

  traverse(ast, {
    enter(path) {
      if (
        isJSXOpeningElement(path.node) &&
        domElements.has((path.node.name as JSXIdentifier).name)
      ) {
        if (path.node.attributes.length === 0) return;

        let expressionPropKeys: string[] = [];
        let cxProperties: Record<string, string[]> = {};

        const rawProps = path.node.attributes.reduce((acc, curr) => {
          if (!(curr as JSXAttribute).value) return acc;

          switch ((curr as JSXAttribute).value?.type) {
            case "StringLiteral":
              return {
                ...acc,
                [(curr as JSXAttribute).name.name as string]: (
                  (curr as JSXAttribute).value as StringLiteral
                ).value,
              };
            case "JSXExpressionContainer":
              if (
                ((curr as JSXAttribute).value as JSXExpressionContainer)
                  .expression.type === "ConditionalExpression"
              ) {
                const node = curr as JSXAttribute;
                const name = node.name.name as string;
                const value = node.value as JSXExpressionContainer;
                const expression = value.expression as ConditionalExpression;
                const props = extractConditionalProp(name, expression);
                Object.assign(cxProperties, parseConditional(props));
                expressionPropKeys.push(name);
              }

              if (
                ((curr as JSXAttribute).value as JSXExpressionContainer)
                  .expression.type === "CallExpression"
              ) {
              }
              return acc;
            default:
              return acc;
          }
        }, {});

        const css = extractLiteralProps(rawProps, theme);

        if (!css) return;
        const [className, propKeys] = css;

        path.node.attributes = stripStyleAttributes(path.node.attributes, [
          ...propKeys,
          ...expressionPropKeys,
        ]);

        const classNameNode = (() => {
          if (expressionPropKeys.length > 0) {
            // expression className
            return jSXAttribute(
              jSXIdentifier("className"),
              makeCXExpression({
                [className]: ["true"],
                ...cxProperties,
              })
            );
          }
          // literal className
          return jSXAttribute(
            jSXIdentifier("className"),
            stringLiteral(className)
          );
        })();

        path.node.attributes.push(classNameNode);
      }
    },
  });

  return generate(ast);
}

export default parseJSX;
