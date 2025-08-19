module.exports = {
  semi: true,
  trailingComma: "es5",
  singleQuote: false,
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  quoteProps: "as-needed",
  bracketSpacing: true,
  arrowParens: "avoid",
  endOfLine: "lf",
  overrides: [
    {
      files: "*.json",
      options: {
        printWidth: 200
      }
    },
    {
      files: ["tsconfig.json", "tsconfig.*.json", "nest-cli.json"],
      options: {
        parser: "json-stringify"
      }
    }
  ]
};
