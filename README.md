# rollup-plugin-jsx-remove-attributes
rollup &amp; vite plugin to remove jsx attributes

This plugin can be used in vite or rollup.

The initial motivation  was to remove `data-testid` attributes from jsx (react, etc) components.

It can be generally used to remove any attribute.

The plugin only runs when `NODE_ENV` is equal to `production`.

## Installation

```bash

npm i -D rollup-plugin-jsx-remove-attributes
```

## Usage with Vite


Example:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import removeTestIdAttribute from 'rollup-jsx-remove-attributes';

export default defineConfig({
    build: { sourcemap: true },
    plugins: [
        react(),
        removeTestIdAttribute({ 
             include: [/\.[tj]sx$/], //default
             exclude: ['**/node_modules/**'], // default
             attributes: ['data-testid']  // remove test attributes from jsx
             usage: 'vite'  // Must specify 'vite'
        }),
        // other plugins
     ]
});
```


### Usage with Rollup

Example:

```typescript
import { rollup } from 'rollup';
import removeTestIdAttribute from 'rollup-jsx-remove-attributes';

// see below for details on these options
const inputOptions = {
    ...
    plugins:[
      removeTestIdAttribute({ 
             include: [/\.[tj]sx$/], //default
             exclude: ['**/node_modules/**'], // default
             attributes: ['data-testid']  // remove test attributes from jsx
             usage: 'rollup'  // must specify rollup
        }),
    ]
};

const outputOptions = {...};

const await bundle = rollup.build(inputOptions);

await rollup.write(outputOptions);
```

## Options Object
 
  - `usage`: possible values are `vite` or `rollup`
  - `include`: will allow anything that matches the array of glob/regexp pattern, default`[/\.[tj]sx$/]`
  - `exclude`: will exclude anything matching the array of glob/regexp patterns, default `['**/node_modules/**']`
  - `attributes`: array of jsx attributes to be stripped if found, example `data-testid`





