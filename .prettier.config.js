/** @type {import('prettier').Config} */
module.exports = {
    plugins: ['prettier-plugin-tailwindcss'],
    tailwindConfig: './tailwind.config.js',
    tailwindFunctions: ['clsx', 'cn'],
    semi: true,
    singleQuote: true,
    arrowParens: 'always',
    trailingComma: 'none',
    printWidth: 100,
    tabWidth: 2
  };
  