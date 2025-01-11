// ==UserScript==
// @name         Xpath helper
// @version      1.0
// @updateURL    https://coldspirit0.github.io/web-utils/userscripts/xpath-helper.user.js
// @description  Use xpath in the browser console with class() function
// @author       https://github.com/ColdSpirit0
// @match        *://*/*
// @grant        unsafeWindow
// ==/UserScript==

(function() {
    'use strict';

    unsafeWindow.startXpathHelper = () => {
        console.log("✔️ Xpath helper was loaded on page:", document.location.href, ".")
        unsafeWindow.$x = (selector) => {

            // if xpath selector
            if (selector.startsWith("/") || selector.startsWith("(")) {
                // replace old class() to new class()
                let s = selector.replaceAll(/class\("(.+?)"\)/g, `contains(concat(" ", @class, " "), " $1 ")`)

                // if replaced, show real xpath in console
                if (selector !== s) console.log("%c" + s + "\n", "color: gray; font-size: 6pt;")

                // get elements and return
                let r = document.evaluate(s, document, null, XPathResult.ANY_TYPE, null)

                let node
                let elements = []
                while (node = r.iterateNext()) {
                    elements.push(node)
                }

                return elements
            }
            // if css selector
            else {
                return document.querySelectorAll(selector)
            }
        }
    }

    if (unsafeWindow.$x) {
        console.log("❌ Xpath helper was not loaded on page:", document.location.href,
            "because function $x already exists on this page. If you want to load it manually - type 'startXpathHelper()' in the console.")
    }
    else {
        unsafeWindow.startXpathHelper()
    }
})();