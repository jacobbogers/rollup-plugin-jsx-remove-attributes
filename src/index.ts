import { createFilter } from '@rollup/pluginutils';
import type { Plugin } from 'vite';
import type { FilterPattern } from '@rollup/pluginutils';
import { generate } from 'escodegen';
import { walk } from 'estree-walker';

export interface Options {
    attributes: string[];
    include?: FilterPattern;
    exclude?: FilterPattern;
    usage: 'vite'|'rollup'
}

type PropertyLiteralValue = {
    type: 'Property';
    key: {
        type: 'Literal';
        value: string;
    };
    value: {
        type: 'Literal';
        value: string;
    };
};

type ObjectExpression = {
    type: 'ObjectExpression';
    properties: PropertyLiteralValue[];
};

type CallExpression = {
    type: 'CallExpression';
    callee: {
        type: string;
        name: string;
    };
    arguments: ObjectExpression[];
};

function isJSXCallExpression(jsx: unknown): jsx is CallExpression {
    const ce = jsx as CallExpression;
    return ce?.type === 'CallExpression' && ce?.callee?.type === 'Identifier' && ce?.callee?.name === 'jsx';
}

function isObjectExpression(obj: unknown): obj is ObjectExpression {
    const oe = obj as ObjectExpression;
    return oe?.type === 'ObjectExpression' && Array.isArray(oe?.properties);
}

function isPropertyLiteralValue(prop: unknown): prop is PropertyLiteralValue {
    const piv = prop as PropertyLiteralValue;
    return piv?.type === 'Property' && piv?.key?.type === 'Literal' && piv?.value?.type === 'Literal';
}

export default function VitePluginJSXRemoveAttributes({
    include = [/\.[tj]sx$/],
    exclude = ['**/node_modules/**'],
    attributes,
    usage = 'rollup'
}: Options): Plugin {
    const filterValidFile = createFilter(include, exclude);
    const obj: Plugin =  {
        name: 'vite-plugin-jsx-remove-attributes',
        transform(code: string, id: string) {
            if (!(filterValidFile(id) && process.env.NODE_ENV === 'production')) {
                return null;
            }
            const ast = this.parse(code, {
                ecmaVersion: 'latest',
                sourceType: 'module',
                ranges: true,
                locations: false
            });
            walk(ast, {
                enter(node) {
                    if (isJSXCallExpression(node)) {
                        node.arguments.filter(isObjectExpression).forEach((obj) => {
                           obj.properties =  obj.properties.filter((prop) => {
                                if (isPropertyLiteralValue(prop)) {
                                    if (attributes.includes(prop.key.value)) {
                                        return false;
                                    }
                                }
                                return true;
                            });
                        });
                    }
                }
            });
            const formattedCode = generate(ast);
            return { code: formattedCode, map: null };
        }
    };
    if (usage === 'vite'){
      obj.apply = 'build';
    }
    return obj;
}
