import { css, cache } from "@emotion/css";
import { format } from "prettier";
import styledSystem from "@styled-system/css";

function getCssStyles() {
  const rawCssString = Object.values(cache.inserted).join("\n");
  const formattedCssString = format(rawCssString, { parser: "css" });

  return formattedCssString;
}

export { css, getCssStyles, styledSystem };
