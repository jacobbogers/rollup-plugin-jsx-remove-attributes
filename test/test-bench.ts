import type { ProgramNode, TransformPluginContext, Plugin } from 'rollup';
import { createHash } from 'node:crypto';

export interface MyPlugin {
    name: string;
    version: string;
    transform(this: { parse: TransformPluginContext['parse'] }, code: string, id: string): { code: string, map: null };
}

export class TestBench {

    private parseAstFixtureStorage: Map<string, ProgramNode>;

    private readonly pluginContext: Partial<TransformPluginContext> = {
        parse: (input, options): ProgramNode => {
            const md5Hash = createHash('md5').update(input).digest('hex');
            const found = this.parseAstFixtureStorage.get(md5Hash);
            if (!found) {
                throw new TypeError(`no ast found for ${input.slice(0, 150)}`)
            }
            return found;
        }
    }

    constructor(private readonly plugin: MyPlugin,) {
        this.parseAstFixtureStorage = new Map();
    }

    public register(code: string, ast: ProgramNode) {
        // calculate hash
        const md5Hash = createHash('md5').update(code).digest('hex');
        this.parseAstFixtureStorage.set(md5Hash, ast);
        return md5Hash;
    }


    public transform(code, id) {
        if (this.plugin.transform) {
            return this.plugin.transform.call(this.pluginContext, code, id);
        }
    }
}