import { describe, it, expect } from "vitest";
import createPlugin, { type Options, type ILogger } from "../src";
import { TestBench } from "./test-bench";
import { createMockLogger } from "./utils";
import type { MyPlugin } from "./test-bench";
import type { ProgramNode } from "rollup";

// fixtures
import CalculatorBtnProgramNode from "./fixtures/CalculatorBtnProgramNode";
import CalculatorBtnSource from "./fixtures/CalculatorBtnSource";
import CalculatorBtnStrippedSource from "./fixtures/CalculatorBtnStripped";
import fileNotInSelectionList from "./fixtures/file-not-in-selection-list";

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

describe("success", () => {
	it("file that will be rejected", () => {
		const { plugin, logs } = createScaffold();
		const testBench = new TestBench(plugin as MyPlugin);
		testBench.register(
			CalculatorBtnSource,
			CalculatorBtnProgramNode as ProgramNode,
		);
		const transformed = testBench.transform(
			CalculatorBtnSource,
			"CalculatorBtn.tsx",
		);
		const { code } = transformed;
		expect(code).toEqual(CalculatorBtnStrippedSource);
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
		const testBench = new TestBench(plugin as MyPlugin);
		testBench.register(
			CalculatorBtnSource,
			CalculatorBtnProgramNode as ProgramNode,
		);
		const transformed = testBench.transform(
			CalculatorBtnSource,
			"CalculatorBtn.tsx",
		);
		const { code } = transformed;
		expect(code).toEqual(CalculatorBtnStrippedSource);
	});
});
