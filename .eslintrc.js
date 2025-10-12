module.exports = {
  extends: ["next/core-web-vitals"],
  ignorePatterns: ["src/lib/contracts/**/*.d.ts", "src/lib/contracts/**/*.js"],
  rules: {
    "no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],
  },
};
