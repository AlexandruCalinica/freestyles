import { css, cache } from "@emotion/css";
import { format } from "prettier";
import _styledSystem from "@styled-system/css";
import { pick } from "@styled-system/props";
import {
  ConditionalExpression,
  StringLiteral,
  LogicalExpression,
  UnaryExpression,
} from "@babel/types";

import { Conditional } from "../utils/types";

// @ts-ignore
const styledSystem = _styledSystem.default;

function getCssStyles() {
  const rawCssString = Object.values(cache.inserted).join("\n");
  return format(rawCssString, { parser: "css" });
}

function extractLiteralProps(
  props: any,
  theme = {}
): [className: string, propKeys: string[]] | null {
  const cssProps = pick(props);
  const propKeys = Object.keys(cssProps);

  if (propKeys.length === 0) return null;

  const styledProps = styledSystem(cssProps)(theme);
  const className = css(styledProps);

  return [className, propKeys];
}

function extractUnaryExpression(node: UnaryExpression): string {
  let arg;
  switch (node.argument.type) {
    case "NumericLiteral":
    case "StringLiteral":
      if (node.operator === "!") {
        return String(!node.argument.value);
      }
      return `${!!node.argument.value}`;
    case "BooleanLiteral":
      arg = node.argument.value;
      return `${node.operator}${arg}`;
    default:
      return "";
  }
}

function extractLogicalExpression(node: LogicalExpression): string {
  let left, right;

  switch (node.left.type) {
    case "LogicalExpression":
      left = extractLogicalExpression(node.left);
      break;
    case "UnaryExpression":
      left = extractUnaryExpression(node.left);
      break;
    case "Identifier":
      left = node.left.name;
      break;
    case "BooleanLiteral":
      left = String(node.left.value);
      break;
    default:
      left = "";
      break;
  }
  switch (node.right.type) {
    case "LogicalExpression":
      right = extractLogicalExpression(node.right);
      break;
    case "UnaryExpression":
      right = extractUnaryExpression(node.right);
      break;
    case "Identifier":
      right = node.right.name;
      break;
    case "BooleanLiteral":
      right = String(node.right.value);
      break;
    default:
      right = "";
      break;
  }

  return `${left} ${node.operator} ${right}`;
}

function extractConditionalProp(
  name: string,
  node: ConditionalExpression
): Conditional {
  const test = node.test;
  const consequent = node.consequent;
  const alternate = node.alternate;

  const testIdentifier = (() => {
    if (test.type === "Identifier") return test.name;
    if (test.type === "BooleanLiteral") {
      return String(test.value);
    }
    if (test.type === "LogicalExpression") {
      return extractLogicalExpression(test);
    }
    return "";
  })();

  let consequentValue: any = css({
    [name]: (consequent as StringLiteral)?.value,
  });
  if (consequent.type === "ConditionalExpression")
    consequentValue = extractConditionalProp(name, consequent);

  let alternateValue: any = css({
    [name]: (alternate as StringLiteral)?.value,
  });
  if (alternate.type === "ConditionalExpression")
    alternateValue = extractConditionalProp(name, alternate);

  return {
    [testIdentifier]: {
      consequent: consequentValue,
      alternate: alternateValue,
    },
  };
}

export { getCssStyles, extractLiteralProps, extractConditionalProp };
