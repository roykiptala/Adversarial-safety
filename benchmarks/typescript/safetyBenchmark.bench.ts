import { readFileSync } from "node:fs";
import { performance } from "node:perf_hooks";
import { fileURLToPath } from "node:url";
import path from "node:path";

import {
  evaluateCases,
  SafetyCase,
} from "../../src/safety_evaluator";


const currentFile = fileURLToPath(import.meta.url);
const projectRoot = path.resolve(path.dirname(currentFile), "../..");

const casesPath = path.join(
  projectRoot,
  "reference",
  "safety_cases.json",
);

const cases = JSON.parse(
  readFileSync(casesPath, "utf-8"),
) as SafetyCase[];


const iterations = 1000;

const start = performance.now();

let totalPassed = 0;

for (let i = 0; i < iterations; i++) {
  const results = evaluateCases(cases);
  totalPassed += results.filter((result) => result.passed).length;
}

const elapsed = (performance.now() - start) / 1000;

const totalCases = iterations * cases.length;

const output = {
  benchmark: "typescript_safety_evaluator",
  iterations,
  cases_per_iteration: cases.length,
  total_cases: totalCases,
  passed: totalPassed,
  failed: totalCases - totalPassed,
  elapsed_seconds: Number(elapsed.toFixed(6)),
};

console.log(JSON.stringify(output, null, 2));