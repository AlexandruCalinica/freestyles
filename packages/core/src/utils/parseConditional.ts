import { Conditional } from "./types";

const getRootKey = (input: Conditional) => Object.keys(input)[0];
const parseBoolString = (str: string, not = false) =>
  not ? !(str === "true") : str === "true";
const parseTestString = (str: string, not = false) =>
  ["true", "false"].includes(str)
    ? `${parseBoolString(str, not)}`
    : `${not ? "!" : ""}${str}`;

function parseConditional(
  input: Conditional,
  prevTest: string[] = []
): Record<string, string[]> {
  const test = getRootKey(input);
  const { consequent, alternate } = input[test];
  const getCurrentTest = (not = false) => [
    ...prevTest,
    ...(test.includes("&&")
      ? test.split(" && ").map((s) => parseTestString(s, not))
      : [parseTestString(test, not)]),
  ];

  let res = {};

  if (typeof consequent === "string") {
    Object.assign(res, {
      [consequent]: getCurrentTest(),
    });
  } else {
    Object.assign(res, parseConditional(consequent, getCurrentTest()));
  }

  if (typeof alternate === "string") {
    Object.assign(res, {
      [alternate]: getCurrentTest(true),
    });
  } else {
    Object.assign(res, parseConditional(alternate, getCurrentTest(true)));
  }

  return res;
}

export default parseConditional;
