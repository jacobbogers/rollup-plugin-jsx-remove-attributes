import { describe, it, expect } from "vitest";
import createPlugin, { type Options, type ILogger } from "../src";
import { TestBench } from "./test-bench";
import { createMockLogger } from "./utils";
import type { MyPlugin } from "./test-bench";
import type { ProgramNode } from "rollup";

// fixtures
import CalculatorBtnProgramNode from "./fixtures/react/CalculatorBtnAST";
import PreactSourceAsAST from "./fixtures/preact/PreactFormAST";

function createScaffold(props: Partial<Options> = {}) {
	const logs = [];
	process.env.NODE_ENV = "production";
	const mockLogger = createMockLogger(logs);
	const plugin = createPlugin({ logger: mockLogger, ...props });
	if (plugin === false) {
		throw new Error("plugin should not return false");
	}
	expect(plugin.name).toBe("vite-plugin-jsx-remove-attributes");
	expect(plugin.version).toBe("3.0.0");
	expect(logs).toEqual([]);
	return { plugin, logs };
}

describe.concurrent("success", () => {
	it("file that will be rejected", () => {
		const { plugin, logs } = createScaffold();
		const testBench = new TestBench(plugin as MyPlugin);
		const fakeSourceCode = "/* fake source code */";
		testBench.register(
			fakeSourceCode,
			CalculatorBtnProgramNode as ProgramNode,
		);
		const transformed = testBench.transform(
			fakeSourceCode,
			"CalculatorBtn.tsx",
		);
		const { code } = transformed;
		const matches = RegExp(/data-testid/g).exec(code);
		expect(matches).toBeNull();
	});
	it("file not in include property", () => {
		const { plugin, logs } = createScaffold();
		const testBench = new TestBench(plugin as MyPlugin);
		const transformed = testBench.transform(
			"/*some random data*/",
			"btnSource.css",
		);
		expect(transformed).toBeNull();
	});
	it('define explicit "attributes" property', () => {
		const { plugin, logs } = createScaffold({
			attributes: ["data-testid"],
		});

		const fakeSourceCode = "/* fake source code */";
		const testBench = new TestBench(plugin as MyPlugin);
		testBench.register(
			fakeSourceCode,
			CalculatorBtnProgramNode as ProgramNode,
		);
		const transformed = testBench.transform(
			fakeSourceCode,
			"CalculatorBtn.tsx",
		);
		const { code } = transformed;
		const matches = RegExp(/data-testid/g).exec(code);
		expect(matches).toBeNull();
	});
	it("remove attributes from preact code", () => {
		const { plugin, logs } = createScaffold({
			attributes: ["data-testid"],
		});

		const srcCode =
			"/** dummy source code no need for source code, the plugin works on ast **/";
		const testBench = new TestBench(plugin as MyPlugin);
		testBench.register(srcCode, PreactSourceAsAST as ProgramNode);
		const transformed = testBench.transform(srcCode, "preact-main.tsx");
		const { code } = transformed;
		const matches = RegExp(/data-testid/g).exec(code);
		expect(matches).toBeNull();
	});
});
