import {
  identifier,
  stringLiteral,
  callExpression,
  objectProperty,
  objectExpression,
  jsxExpressionContainer,
} from "@babel/types";
import template from "@babel/template";
import type { ExpressionStatement } from "@babel/types";

function makeCXExpression(classNames: Record<string, string[]>) {
  const properties = Object.entries(classNames).map(([k, v]) => {
    const key = stringLiteral(k);
    const val = (template.ast(v.join(" && ") + ";") as ExpressionStatement)
      .expression;

    return objectProperty(key, val);
  });

  return jsxExpressionContainer(
    callExpression(identifier("cx"), [objectExpression(properties)])
  );
}

export default makeCXExpression;
