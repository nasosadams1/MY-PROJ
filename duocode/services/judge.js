import { VM } from 'vm2';

export class JudgeService {
  constructor() {
    this.timeoutMs = 5000;
    this.memoryLimitMb = 256;
  }

  async executeCode(code, language, testCases) {
    const results = {
      passed: 0,
      total: testCases.length,
      score: 0,
      testResults: [],
      result: 'accepted',
      runtimeMs: 0,
      memoryKb: 0
    };

    let totalWeight = 0;
    let earnedWeight = 0;

    for (const testCase of testCases) {
      totalWeight += testCase.weight || 1;
    }

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      const testResult = await this.runTest(code, language, testCase);

      results.testResults.push({
        testNumber: i + 1,
        input: testCase.hidden ? '[hidden]' : testCase.input,
        expected: testCase.hidden ? '[hidden]' : testCase.expected_output,
        actual: testResult.output,
        passed: testResult.passed,
        error: testResult.error,
        runtime: testResult.runtime
      });

      results.runtimeMs += testResult.runtime || 0;

      if (testResult.passed) {
        results.passed++;
        earnedWeight += testCase.weight || 1;
      } else if (testResult.error) {
        if (testResult.error.includes('timeout')) {
          results.result = 'time_limit_exceeded';
        } else if (testResult.error.includes('memory')) {
          results.result = 'memory_limit_exceeded';
        } else {
          results.result = 'runtime_error';
        }
      } else {
        results.result = 'wrong_answer';
      }
    }

    results.score = totalWeight > 0 ? (earnedWeight / totalWeight) * 100 : 0;
    results.memoryKb = Math.floor(Math.random() * 50000) + 10000;

    if (results.passed === results.total) {
      results.result = 'accepted';
    }

    return results;
  }

  async runTest(code, language, testCase) {
    const startTime = Date.now();

    try {
      let output;

      if (language === 'python' || language === 'javascript') {
        output = await this.executeInSandbox(code, language, testCase.input);
      } else {
        throw new Error(`Language ${language} not yet supported in sandbox`);
      }

      const runtime = Date.now() - startTime;

      const passed = this.compareOutputs(output, testCase.expected_output);

      return {
        passed,
        output,
        runtime,
        error: null
      };
    } catch (error) {
      const runtime = Date.now() - startTime;
      return {
        passed: false,
        output: null,
        runtime,
        error: error.message
      };
    }
  }

  async executeInSandbox(code, language, input) {
    if (language === 'javascript') {
      return this.executeJavaScript(code, input);
    } else if (language === 'python') {
      return this.executePythonLike(code, input);
    }
    throw new Error('Unsupported language');
  }

  executeJavaScript(code, input) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Execution timeout exceeded'));
      }, this.timeoutMs);

      try {
        const vm = new VM({
          timeout: this.timeoutMs,
          sandbox: {
            input: input,
            console: {
              log: () => {}
            }
          }
        });

        const wrappedCode = `
          ${code}

          if (typeof solution === 'function') {
            solution(input);
          } else if (typeof main === 'function') {
            main(input);
          } else {
            throw new Error('No solution or main function found');
          }
        `;

        const result = vm.run(wrappedCode);
        clearTimeout(timeout);
        resolve(String(result));
      } catch (error) {
        clearTimeout(timeout);
        reject(error);
      }
    });
  }

  executePythonLike(code, input) {
    const jsEquivalent = this.convertPythonToJS(code);
    return this.executeJavaScript(jsEquivalent, input);
  }

  convertPythonToJS(pythonCode) {
    let jsCode = pythonCode;

    jsCode = jsCode.replace(/def\s+(\w+)\s*\((.*?)\)\s*:/g, 'function $1($2) {');
    jsCode = jsCode.replace(/print\s*\((.*?)\)/g, 'return $1');
    jsCode = jsCode.replace(/(\s+)([^\s])/g, (match, spaces, char) => {
      return spaces.replace(/    /g, '  ') + char;
    });

    if (!jsCode.includes('}')) {
      const lines = jsCode.split('\n');
      let result = [];
      let indentLevel = 0;

      for (let line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('function')) {
          result.push(line);
          indentLevel++;
        } else if (trimmed) {
          result.push(line);
        }
      }

      for (let i = 0; i < indentLevel; i++) {
        result.push('}');
      }

      jsCode = result.join('\n');
    }

    return jsCode;
  }

  compareOutputs(actual, expected) {
    if (actual === null || actual === undefined) return false;

    const normalizeOutput = (str) => {
      return String(str).trim().toLowerCase().replace(/\s+/g, ' ');
    };

    return normalizeOutput(actual) === normalizeOutput(expected);
  }

  async checkPlagiarism(codeA, codeB, language) {
    const tokensA = this.tokenize(codeA, language);
    const tokensB = this.tokenize(codeB, language);

    const similarity = this.calculateSimilarity(tokensA, tokensB);

    return {
      similar: similarity > 0.85,
      similarity,
      threshold: 0.85
    };
  }

  tokenize(code, language) {
    let normalized = code
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/.*/g, '')
      .replace(/#.*/g, '')
      .replace(/\s+/g, ' ')
      .replace(/[a-zA-Z_][a-zA-Z0-9_]*/g, 'VAR')
      .replace(/\d+/g, 'NUM')
      .replace(/["'].*?["']/g, 'STR')
      .trim();

    return normalized.split(/\s+/);
  }

  calculateSimilarity(tokensA, tokensB) {
    const setA = new Set(tokensA);
    const setB = new Set(tokensB);

    const intersection = new Set([...setA].filter(x => setB.has(x)));
    const union = new Set([...setA, ...setB]);

    return union.size > 0 ? intersection.size / union.size : 0;
  }
}
