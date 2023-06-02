export type Conditional = {
  [test: string]: {
    consequent: string | Conditional;
    alternate: string | Conditional;
  };
};
