import { describe, it, expect } from 'vitest';
import createPlugin, { type ILogger } from '../src';
import { TestBench } from './test-bench';
import { createMockLogger } from './utils';
import type { MyPlugin } from './test-bench';

function createScaffold() {
    const logs = [];
    process.env.NODE_ENV = 'production';
    const mockLogger = createMockLogger(logs);
    const plugin = createPlugin({ logger: mockLogger });
    if (plugin === false) {
        throw new Error('plugin should not return false')
    }
    expect(plugin.name).toBe('vite-plugin-jsx-remove-attributes');
    expect(plugin.version).toBe('3.0.0');
    expect(logs).toEqual([]);
    return { plugin, logs };
}

describe('success', () => {
    it('file that will be rejected', () => {
        const { plugin, logs } = createScaffold();
        const testBench = new TestBench(plugin as MyPlugin);
        testBench.register()
    })
});