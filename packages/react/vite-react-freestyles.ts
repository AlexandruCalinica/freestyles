import { PluginOption } from "vite";

import parseJSX from "@freestyles/core/src/parser/jsx";
import { getCssStyles } from "@freestyles/core/src/styler";

const theme = {};

function viteReactFreestyles(): PluginOption {
  return {
    name: "vite-plugin-react-freestyles",
    transform(src: string, id: string) {
      if (!/\.tsx?|\.jsx?$/.test(id)) return;

      return parseJSX(src, theme);
    },
    transformIndexHtml(html: string) {
      return [
        {
          tag: "style",
          attrs: { type: "text/css" },
          children: getCssStyles(),
        },
      ];
    },
  };
}

export default viteReactFreestyles;
