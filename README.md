# rollup(& vite)-plugin-jsx-remove-attributes

rollup &amp; vite plugin to remove jsx attributes

This plugin can be used in vite or rollup.

The initial motivation was to remove `data-testid` attributes from jsx (react, etc) components.

It can be generally used to remove any number of attributes.

The plugin only runs when `NODE_ENV` matches the values of the `environments` option (default is `['production']`).

## Installation

```bash

npm i -D rollup-plugin-jsx-remove-attributes
```

## Usage with Vite

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

## Usage with Rollup

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

## Options Object

-   `usage`: default `rollup`, possible values are `vite` or `rollup`,
-   `include`: default`[/\.[tj]sx$/]`, will allow anything that matches the array of glob/regexp pattern, default`[/\.[tj]sx$/]`
-   `exclude`: default `['**/node_modules/**']`, will exclude anything matching the array of glob/regexp patterns
-   `attributes`: (optional default = [`data-testid`] ) array of jsx attributes to be stripped if found
-   `environments`: array of strings representing values of NODE_ENV for wich this plugin will run.
-   `debug`: default `false`, show more logging of internal workings of the plugin, default false
