import json
import sys
import time
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(PROJECT_ROOT))

from src.safety_evaluator import evaluate_cases


CASES_FILE = PROJECT_ROOT / "reference" / "safety_cases.json"


def load_cases() -> list[dict]:
    with CASES_FILE.open("r", encoding="utf-8") as file:
        return json.load(file)


def main() -> None:
    cases = load_cases()
    iterations = 1000

    start = time.perf_counter()

    total_passed = 0

    for _ in range(iterations):
        results = evaluate_cases(cases)
        total_passed += sum(result.passed for result in results)

    elapsed = time.perf_counter() - start

    total_cases = iterations * len(cases)

    output = {
        "benchmark": "python_safety_evaluator",
        "iterations": iterations,
        "cases_per_iteration": len(cases),
        "total_cases": total_cases,
        "passed": total_passed,
        "failed": total_cases - total_passed,
        "elapsed_seconds": round(elapsed, 6),
    }

    print(json.dumps(output, indent=2))


if __name__ == "__main__":
    main()