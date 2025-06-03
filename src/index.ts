import { createFilter } from "@rollup/pluginutils";
import type { FilterPattern } from "@rollup/pluginutils";
import { generate } from "astring";
import type {
	Identifier,
	Node,
	ObjectExpression,
	Property,
	SimpleCallExpression,
} from "estree";
import { walk } from "estree-walker";
import type { Plugin } from "vite";

export type ILogger = {
	error: typeof console.error;
	warn: typeof console.warn;
	debug: typeof console.debug;
	info: typeof console.info;
};
export interface Options {
	attributes?: string[];
	include?: FilterPattern;
	exclude?: FilterPattern;
	usage?: "vite" | "rollup";
	environments?: string[];
	debug?: boolean;
	logger?: ILogger;
}

interface PropertyLiteralValue extends Property {
	type: "Property";
	key: {
		type: "Literal";
		value: string;
	};
	value: {
		type: "Literal";
		value: string;
	};
}

interface JSXCallExpression extends SimpleCallExpression {
	type: "CallExpression";
	callee: Identifier;
	arguments: ObjectExpression[];
}

function isJSXCallExpression(jsx: unknown): jsx is JSXCallExpression {
	const ce = jsx as JSXCallExpression;
	return (
		ce?.type === "CallExpression" &&
		ce?.callee?.type === "Identifier" &&
		ce?.callee?.name === "jsx"
	);
}

function isObjectExpression(obj: unknown): obj is ObjectExpression {
	const oe = obj as ObjectExpression;
	return oe?.type === "ObjectExpression" && Array.isArray(oe?.properties);
}

function isPropertyLiteralValue(prop: unknown): prop is PropertyLiteralValue {
	const piv = prop as PropertyLiteralValue;
	return piv?.type === "Property" && piv?.key?.type === "Literal";
}

function normalizeAttributes(attributes?: string[]): string[] {
	if (Array.isArray(attributes) && attributes.length > 0) {
		return attributes;
	}
	return ["data-testid"];
}

export type RemoveAttrbutePlugin = typeof VitePluginJSXRemoveAttributes;

export default function VitePluginJSXRemoveAttributes({
	include = [/\.[tj]sx$/],
	exclude = ["**/node_modules/**"],
	attributes,
	usage = "rollup",
	environments = ["production"],
	debug = false,
	logger = console,
}: Options = {}): Plugin | false {
	const finalAttributes = normalizeAttributes(attributes);
	const filterValidFile = createFilter(include, exclude);
	const plName = "vite-plugin-jsx-remove-attributes";
	const node_env_lowercase = (process.env.NODE_ENV ?? "").toLowerCase();
	if (!node_env_lowercase) {
		logger.warn(
			`[${plName}] NODE_ENV was not set on in this process, this plugin will not run`,
		);
		return false;
	}
	if (!Array.isArray(environments)) {
		logger.error(
			`[${plName}] "environments" plugin option is not an array`,
		);
		return false;
	}
	if (environments.length === 0) {
		logger.error(
			`[${plName}] "environments" plugin option is an array of zero length`,
		);
		return false;
	}
	if (
		environments.filter((e) => typeof e === "string").length !==
		environments.length
	) {
		logger.error(
			`[${plName}] "environments" plugin options must contain strings`,
		);
		return false;
	}
	if (
		environments.filter((e) => e.trim() !== "").length !==
		environments.length
	) {
		logger.error(
			`[${plName}] "environments" plugin options must contain non zero length strings`,
		);
		return false;
	}
	if (!environments.includes(node_env_lowercase)) {
		if (debug) {
			const envs = environments.map((e) => `"${e}"`).join(",");
			logger.info(
				`[${plName}] The current environment: "${node_env_lowercase}", the plugin is configured to run in: ${envs}`,
			);
		}
		return false;
	}
	const obj: Plugin = {
		name: "vite-plugin-jsx-remove-attributes",
		version: "3.0.0",
		transform(code, id) {
			if (!filterValidFile(id)) {
				return null;
			}
			// let dirty = false;
			const ast: Node = this.parse(code, {
				allowReturnOutsideFunction: false,
			}) as Node;
			walk(ast, {
				enter(node) {
					if (!isJSXCallExpression(node)) {
						return;
					}
					for (const obj of node.arguments.filter(
						isObjectExpression,
					)) {
						obj.properties = obj.properties.filter((prop) => {
							if (isPropertyLiteralValue(prop)) {
								if (finalAttributes.includes(prop.key.value)) {
									return false;
								}
							}
							return true;
						});
					}
				},
			});
			const formattedCode = generate(ast);
			return { code: formattedCode, map: null };
		},
	};
	if (usage === "vite") {
		obj.apply = "build";
	}
	return obj;
}
