import { describe, it, expect } from 'vitest';
import createPlugin, { type ILogger } from '../src';

import { createMockLogger } from './utils';

describe('errors', () => {
    it('NODE_ENV cleared', () => {
        // biome-ignore lint/performance/noDelete: <explanation>
        delete process.env.NODE_ENV;
        const logs = [];
        const mockLogger = createMockLogger(logs);
        const plugin = createPlugin({ logger: mockLogger });
        expect(plugin).toBe(false);
        expect(logs).toEqual([
            [
                "[vite-plugin-jsx-remove-attributes] NODE_ENV was not set on in this process, this plugin will not run",
            ],
        ])
    });
    it('"environments" in options is empty array', () => {
        process.env.NODE_ENV = 'just-a-namespace';
        const logs = [];
        const mockLogger = createMockLogger(logs);
        const plugin = createPlugin({ logger: mockLogger, environments: [] });
        expect(plugin).toBe(false);
        expect(logs).toEqual([
            [
                '[vite-plugin-jsx-remove-attributes] "environments" plugin option is an array of zero length'
            ]
        ])
    });
    it('"environments" in options is NOT an array', () => {
        process.env.NODE_ENV = 'just-a-namespace';
        const logs = [];
        const mockLogger = createMockLogger(logs);
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        const environments = null as any;
        const plugin = createPlugin({ logger: mockLogger, environments });
        expect(plugin).toBe(false);
        expect(logs).toEqual([
            [
                "[vite-plugin-jsx-remove-attributes] \"environments\" plugin option is not an array",
            ]
        ])
    });
    it('"environments" in options is NOT an array of strings', () => {
        process.env.NODE_ENV = 'just-a-namespace';
        const logs = [];
        const mockLogger = createMockLogger(logs);
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        const environments = [1, 2, 3] as any;
        const plugin = createPlugin({ logger: mockLogger, environments });
        expect(plugin).toBe(false);
        expect(logs).toEqual([
            [
                '[vite-plugin-jsx-remove-attributes] "environments" plugin options must contain strings'
            ]
        ])
    });
    it('"environments" in options is cannot contain a value with just spaces', () => {
        process.env.NODE_ENV = 'just-a-namespace';
        const logs = [];
        const mockLogger = createMockLogger(logs);
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        const environments = ['  ', 'x', 'y'] as any;
        const plugin = createPlugin({ logger: mockLogger, environments });
        expect(plugin).toBe(false);
        expect(logs).toEqual([
            [
                '[vite-plugin-jsx-remove-attributes] "environments" plugin options must contain non zero length strings'
            ]
        ])
    });
    it('create plugin with no arguments, non prod', () => {
        process.env.NODE_ENV = 'just-a-namespace';
        const logs = [];
        const mockLogger = createMockLogger(logs);
        const plugin = createPlugin({ logger: mockLogger, debug: true });
        expect(plugin).toBe(false);
        expect(logs).toEqual([
            [
                '[vite-plugin-jsx-remove-attributes] The current environment: "just-a-namespace", the plugin is configured to run in: "production"'
            ]
        ]);
    });
})