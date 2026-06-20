/**
 * Unit tests for fallbacks.ts
 * 
 * These tests validate the deterministic scoring and question generation
 * fallback functions that work when AI providers are unavailable.
 * 
 * Run with: npm test -- fallbacks.test.ts
 */

import { fallbackQuestion, fallbackEvaluation } from "./fallbacks";

// Simple assertion helpers
function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

function assertEqual<T>(actual: T, expected: T, message: string) {
  if (actual !== expected) {
    throw new Error(`Assertion failed: ${message}\nExpected: ${expected}\nActual: ${actual}`);
  }
}

function assertIncludes(text: string, substring: string, message: string) {
  if (!text.includes(substring)) {
    throw new Error(`Assertion failed: ${message}\nText does not include: ${substring}\nText: ${text}`);
  }
}

function assertMatch(text: string, pattern: RegExp, message: string) {
  if (!pattern.test(text)) {
    throw new Error(`Assertion failed: ${message}\nPattern does not match: ${pattern}\nText: ${text}`);
  }
}

function assertGreaterThan(actual: number, expected: number, message: string) {
  if (actual <= expected) {
    throw new Error(`Assertion failed: ${message}\nExpected > ${expected}\nActual: ${actual}`);
  }
}

function assertLessThan(actual: number, expected: number, message: string) {
  if (actual >= expected) {
    throw new Error(`Assertion failed: ${message}\nExpected < ${expected}\nActual: ${actual}`);
  }
}

// Test suite
export const tests = {
  // ===== fallbackQuestion Tests =====
  "fallbackQuestion: should generate a salary question when mode is salary": () => {
    const result = fallbackQuestion({
      targetRole: "Software Engineer",
      mode: "salary",
      difficulty: "intermediate"
    });

    assert(result.question !== undefined, "question should exist");
    assert(result.intent !== undefined, "intent should exist");
    assertEqual(result.difficulty, "intermediate", "difficulty should be intermediate");
    assert(Array.isArray(result.evaluationFocus), "evaluationFocus should be an array");
    assertIncludes(result.question, "salary", "salary question should mention salary");
  },

  "fallbackQuestion: should generate a technical question when mode is technical": () => {
    const result = fallbackQuestion({
      targetRole: "Frontend Developer",
      mode: "technical",
      difficulty: "advanced"
    });

    assertIncludes(result.question, "problem", "technical question should mention problem");
    assertEqual(result.difficulty, "advanced", "difficulty should be advanced");
    assert(
      result.evaluationFocus.some(f => f.includes("Technical")),
      "should evaluate technical correctness"
    );
  },

  "fallbackQuestion: should generate a company prep question when mode is company_prep": () => {
    const result = fallbackQuestion({
      targetRole: "Product Manager",
      mode: "company_prep",
      difficulty: "beginner",
      company: "Google"
    });

    assertIncludes(result.question, "Google", "should mention company");
    assertIncludes(result.question, "interested", "should ask about interest");
    assert(
      result.evaluationFocus.some(f => f.includes("Company")),
      "should evaluate company motivation"
    );
  },

  "fallbackQuestion: should include company context in the question": () => {
    const resultWithCompany = fallbackQuestion({
      targetRole: "Engineer",
      mode: "salary",
      difficulty: "intermediate",
      company: "Microsoft"
    });

    assertIncludes(resultWithCompany.question, "Microsoft", "question should include company name");
  },

  "fallbackQuestion: should include market focus context in the question": () => {
    const resultIndia = fallbackQuestion({
      targetRole: "Backend Engineer",
      mode: "technical",
      difficulty: "intermediate",
      marketFocus: "india"
    });

    assertIncludes(resultIndia.question, "Indian", "question should mention Indian context");
  },

  "fallbackQuestion: should return default question for unknown mode": () => {
    const result = fallbackQuestion({
      targetRole: "QA Engineer",
      mode: "unknown_mode" as any,
      difficulty: "beginner"
    });

    assertIncludes(result.question, "Tell me about yourself", "should use default question");
    assert(
      result.evaluationFocus.some(f => f.includes("self-introduction")),
      "should have self-introduction focus"
    );
  },

  // ===== fallbackEvaluation Tests =====
  "fallbackEvaluation: should evaluate a well-structured answer with high score": () => {
    const result = fallbackEvaluation({
      targetRole: "Software Engineer",
      targetField: "Backend",
      experienceLevel: "2 years",
      mode: "technical",
      question: "Walk me through a problem you solved",
      answer:
        "I led the redesign of our API layer. We had issues with latency in peak hours. " +
        "First, I analyzed the bottlenecks using APM tools. Then, I implemented caching with Redis. " +
        "This reduced p99 latency from 500ms to 100ms. I made the tradeoff between consistency and availability, " +
        "choosing eventual consistency for read operations. We improved throughput by 3x."
    });

    assertGreaterThan(result.overallScore, 70, "score should be greater than 70");
    assertMatch(
      result.readinessLevel,
      /Strong|Interview Ready|Moderate/,
      "readiness level should match expected values"
    );
    assertEqual(result.strengths.length, 2, "should have 2 strengths");
    assertEqual(result.weaknesses.length, 2, "should have 2 weaknesses");
  },

  "fallbackEvaluation: should evaluate a short answer with lower score": () => {
    const result = fallbackEvaluation({
      targetRole: "Software Engineer",
      targetField: "Frontend",
      experienceLevel: "1 year",
      mode: "technical",
      question: "Tell us about your project",
      answer: "I made a website."
    });

    assertLessThan(result.overallScore, 50, "score should be less than 50");
    assertMatch(
      result.readinessLevel,
      /Needs Foundation|Developing/,
      "readiness level should be low"
    );
  },

  "fallbackEvaluation: should reward evidence and metrics": () => {
    const basicAnswer = fallbackEvaluation({
      targetRole: "Product Manager",
      experienceLevel: "3 years",
      mode: "behavioral",
      question: "Describe a problem you solved",
      answer: "I solved a problem by thinking about it carefully and making changes to improve things."
    });

    const metricsAnswer = fallbackEvaluation({
      targetRole: "Product Manager",
      experienceLevel: "3 years",
      mode: "behavioral",
      question: "Describe a problem you solved",
      answer:
        "I identified that user onboarding was taking too long. I conducted user research and found " +
        "users were abandoning due to complexity. I simplified the flow from 5 steps to 2 steps. " +
        "This improved conversion rate by 42% and reduced time-to-value from 30 min to 5 min."
    });

    assertGreaterThan(
      metricsAnswer.overallScore,
      basicAnswer.overallScore,
      "answer with metrics should score higher"
    );
  },

  "fallbackEvaluation: should penalize filler words": () => {
    const fillerAnswer = fallbackEvaluation({
      targetRole: "Engineer",
      experienceLevel: "2 years",
      mode: "behavioral",
      question: "Tell me about a challenge",
      answer:
        "Like, I basically had this challenge, maybe it was difficult. " +
        "And I kind of worked on it, sort of figuring things out. " +
        "I guess it turned out okay in the end."
    });

    assertLessThan(fillerAnswer.overallScore, 45, "filler-heavy answer should score low");
  },

  "fallbackEvaluation: should recognize role-specific language": () => {
    const roleSpecificAnswer = fallbackEvaluation({
      targetRole: "Data Engineer",
      experienceLevel: "2 years",
      mode: "technical",
      question: "Walk through a data problem",
      answer:
        "Our ETL pipeline was inefficient. I implemented incremental loading using delta detection. " +
        "Used PySpark for distributed processing. Reduced job duration by 10x."
    });

    assertGreaterThan(roleSpecificAnswer.overallScore, 65, "role-specific answer should score well");
  },

  "fallbackEvaluation: should return readiness levels correctly": () => {
    const excellent = fallbackEvaluation({
      targetRole: "Engineer",
      experienceLevel: "5 years",
      mode: "technical",
      question: "A question",
      answer:
        "In my role as a senior engineer, I designed the entire microservices architecture. " +
        "I identified critical scalability issues through load testing at 100k concurrent users. " +
        "I implemented auto-scaling with Kubernetes, reducing latency by 60% and cutting infrastructure costs by 40%. " +
        "The tradeoff was increased complexity, but I mitigated it with strong documentation and monitoring."
    });

    assertEqual(excellent.readinessLevel, "Interview Ready", "excellent answer should be interview ready");
    assertGreaterThan(
      excellent.overallScore,
      88,
      "excellent answer should score >= 89 for interview ready"
    );
  },

  "fallbackEvaluation: should have improvedAnswer field with actionable feedback": () => {
    const result = fallbackEvaluation({
      targetRole: "Frontend Developer",
      experienceLevel: "1 year",
      mode: "technical",
      question: "Describe a project",
      answer: "I made a React component that works."
    });

    assert(result.improvedAnswer !== undefined, "improvedAnswer should exist");
    assert(result.improvedAnswer.length > 0, "improvedAnswer should have content");
    assertIncludes(result.improvedAnswer, "strengthen", "should provide constructive feedback");
  },

  "fallbackEvaluation: should provide consistent scoring for same input": () => {
    const input = {
      targetRole: "Backend Engineer",
      experienceLevel: "2 years",
      mode: "technical",
      question: "Problem solving",
      answer: "I solved a critical performance issue. We had slow queries. I added indexes and caching."
    };

    const result1 = fallbackEvaluation(input);
    const result2 = fallbackEvaluation(input);

    assertEqual(result1.overallScore, result2.overallScore, "scores should be consistent");
    assertEqual(result1.readinessLevel, result2.readinessLevel, "readiness levels should be consistent");
  }
};

// Run all tests if this file is executed directly
if (require.main === module) {
  let passed = 0;
  let failed = 0;

  console.log("Running fallbacks.ts tests...\n");

  for (const [testName, testFn] of Object.entries(tests)) {
    try {
      testFn();
      console.log(`✓ ${testName}`);
      passed++;
    } catch (error) {
      console.log(`✗ ${testName}`);
      console.log(`  ${error}\n`);
      failed++;
    }
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

