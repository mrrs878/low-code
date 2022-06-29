/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2022-06-26 11:01:46
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2022-06-29 14:35:23
 */

module.exports = {
  extends: ["airbnb", "airbnb/hooks", "airbnb-typescript"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["./tsconfig.json"],
    tsconfigRootDir: __dirname,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    "react/function-component-definition": [
      0,
      {
        unnamedComponents: "arrow-function",
        namedComponents: "function-declaration",
      },
    ],
    'import/prefer-default-export': 'off',
  },
  plugins: ["@typescript-eslint", "import"],
  ignorePatterns: [".eslintrc.js"],
};
