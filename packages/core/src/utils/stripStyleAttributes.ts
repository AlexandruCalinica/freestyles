import {
  JSXAttribute,
  JSXSpreadAttribute,
  isJSXAttribute,
  isJSXIdentifier,
} from "@babel/types";

function stripStyleAttributes(
  attributes: (JSXAttribute | JSXSpreadAttribute)[],
  props: string[]
) {
  return attributes.filter((attr) => {
    if (isJSXAttribute(attr) && isJSXIdentifier(attr.name)) {
      const name = attr.name.name;
      if (props.includes(name)) {
        return false;
      }
    }
    return true;
  });
}

export default stripStyleAttributes;
