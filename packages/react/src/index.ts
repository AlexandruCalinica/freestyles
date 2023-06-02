import type { PluginOption } from "vite";
import { parseJSX, getCssStyles } from "@freestyles/core";

const theme = {};

function viteReactFreestyles(): PluginOption {
  return {
    name: "vite-plugin-react-freestyles",
    enforce: "pre",
    transform(src: string, id: string) {
      if (!/\.tsx?|\.jsx?$/.test(id)) return;

      return parseJSX(src, theme);
    },
    transformIndexHtml() {
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
