import type { ILogger } from "../src";

export function createMockLogger(logs: unknown[]): ILogger {
    return {
        info: (...args: unknown[]) => {
            logs.push([...args]);
        },
        debug: (...data: unknown[]): void => {
            logs.push([...data]);
        },
        error: (...data: unknown[]): void => {
            logs.push([...data]);
        },
        warn: (...data: unknown[]): void => {
            logs.push([...data]);
        },
    }
}