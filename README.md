# web-utils

Repo for site: https://coldspirit0.github.io/web-utils/

## Utils
* [GLTF compare](https://coldspirit0.github.io/web-utils/gltf-compare/index.html)
* [Text escape tool for regex](https://coldspirit0.github.io/web-utils/text-escape-tool.html)
* [Add ya.ru search engine](https://coldspirit0.github.io/web-utils/ya-search-engine/ya_search.html)

## Userscripts

### Xpath helper

**Install**: https://coldspirit0.github.io/web-utils/userscripts/xpath-helper.user.js

Replacement for the integrated $x() function in the browser. You can use CSS selectors and extended xpath selectors with class() function.

**Usage:**

> Note: you  have to use backticks `` ` `` in the function and double quotes ` " ` as string delimiters.

```xpath
$x(`//*[class("some-class")]`)
// same as:
$x(`//*[contains(concat(" ", @class, " "), " some-class ")]`)
// or:
$x(`.some-class`)
```
