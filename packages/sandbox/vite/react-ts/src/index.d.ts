import type { CSSProperties as StyledProperties } from "@styled-system/css";

declare module "react" {
  interface HTMLAttributes<T>
    extends AriaAttributes,
      DOMAttributes<T>,
      StyledProperties {}
}
