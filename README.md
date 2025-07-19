
# rollup(& vite)-plugin-jsx-remove-attributes

rollup &amp; vite plugin to remove jsx attributes

This plugin can be used in vite or rollup.

The initial motivation was to remove `data-testid` attributes from jsx (react, etc) components.

It can be generally used to remove any number of attributes.

The plugin only runs when `NODE_ENV` matches the values of the `environments` option (default is `['production']`).

## Table of contents
<!-- vscode-markdown-toc -->
1. [Installation](#Installation)
2. [Usage with Vite](#UsagewithVite)
3. [Usage with Rollup](#UsagewithRollup)
4. [Options Object](#OptionsObject)
5. [Usage with Preact](#UsagewithPreact)

<!-- vscode-markdown-toc-config
	numbering=true
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->

##  1. <a name='Installation'></a>Installation

```bash

npm i -D rollup-plugin-jsx-remove-attributes
```

##  2. <a name='UsagewithVite'></a>Usage with Vite

Example:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import removeTestIdAttribute from 'rollup-plugin-jsx-remove-attributes';

export default defineConfig({
    build: { sourcemap: true },
    plugins: [
        react(),
        removeTestIdAttribute({
            include: [/\.[tj]sx$/], //default
            exclude: ['**/node_modules/**'], // default
            attributes: ['data-testid'], // default, array of attribute names to strip from jsx
            environments: ['production', 'pre-prod', 'prod', 'q&a'], // default = ["production"]
            debug: false, // is the default, if "true" show more logging of the internal workings of this plugin, for troubleshooting configs
            usage: 'vite' // Must specify for vite use, default usage is rollup
        })
        // other plugins
    ]
});
```

##  3. <a name='UsagewithRollup'></a>Usage with Rollup

Example:

```typescript
import { rollup } from 'rollup';
import removeTestIdAttribute from 'rollup-plugin-jsx-remove-attributes';

// see below for details on these options
const inputOptions = {
    ...
    plugins:[
      removeTestIdAttribute({
            include: [/\.[tj]sx$/], //default
            exclude: ['**/node_modules/**'], // default
            attributes: ['data-testid'],  // default, array of attribute names to strip from jsx
            environments: ['production', 'pre-prod', 'prod', 'q&a'], // default = ["production"]
            debug: false, // is the default, if "true" show more logging of the internal workings of this plugin, for troubleshooting configs
            usage: 'rollup'  // default,  when configuring for rollup "usage" can be omitted, shown for clarity only
        }),
    ]
};

const outputOptions = {...};

const bundle = await rollup.build(inputOptions);

await rollup.write(outputOptions);
```

##  4. <a name='OptionsObject'></a>Options Object

-   `usage`: default `rollup`, possible values are `vite` or `rollup`,
-   `include`: default`[/\.[tj]sx$/]`, will allow anything that matches the array of glob/regexp pattern, default`[/\.[tj]sx$/]`
-   `exclude`: default `['**/node_modules/**']`, will exclude anything matching the array of glob/regexp patterns
-   `attributes`: (optional default = [`data-testid`] ) array of jsx attributes to be stripped if found
-   `environments`: array of strings representing values of NODE_ENV for wich this plugin will run.
-   `debug`: default `false`, show more logging of internal workings of the plugin, default false


##  5. <a name='UsagewithPreact'></a>Usage with Preact

Preact is now supported since version 3.1.0

Please take care the insert this plugin before any minification/uglify plugin.

For example:

```javascript
// imports removed for brevity
//
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        esbuild(),
        jsxRemoveAttributes(), // <-- this plugin
        minify()
    ],
    //
    // other config info removed for brevity
});
```

For more information see [issue][7]

[7]: https://github.com/jacobbogers/rollup-plugin-jsx-remove-attributes/issues/7




