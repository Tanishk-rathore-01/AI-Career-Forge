import {
  answerEvaluationRequestSchema,
  answerEvaluationSchema,
  generatedQuestionSchema,
  questionRequestSchema,
  resumeMatchRequestSchema,
  resumeMatchSchema,
  salaryEvaluationRequestSchema,
  salaryEvaluationSchema
} from "@/lib/ai/schemas";
import {
  fallbackEvaluation,
  fallbackQuestion,
  fallbackResumeMatch,
  fallbackSalaryEvaluation
} from "@/lib/ai/fallbacks";
import { getOpenAIClient, parseJsonObject } from "@/lib/ai/openai";

const QUESTION_PROMPT_VERSION = "interview-question-v1";
const EVALUATION_PROMPT_VERSION = "interview-evaluation-v1";
const SALARY_PROMPT_VERSION = "salary-evaluation-v1";
const RESUME_PROMPT_VERSION = "resume-match-v1";

export async function generateInterviewQuestion(rawInput: unknown) {
  const input = questionRequestSchema.parse(rawInput);
  const client = getOpenAIClient();

  if (!client) {
    return {
      ...fallbackQuestion(input),
      promptVersion: QUESTION_PROMPT_VERSION,
      model: "fallback"
    };
  }

  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    temperature: 0.35,
    messages: [
      {
        role: "system",
        content:
          "You are PrepPilot, a professional, elegant, friendly AI interview coach. Generate exactly one realistic interview question. Return strict JSON only."
      },
      {
        role: "user",
        content: JSON.stringify({
          task: "Generate one interview question.",
          candidate: input,
          schema: {
            question: "string",
            intent: "string",
            difficulty: "beginner | intermediate | advanced",
            evaluationFocus: ["string"]
          }
        })
      }
    ]
  });

  const parsed = generatedQuestionSchema.parse(
    parseJsonObject(response.choices[0]?.message.content ?? "{}")
  );

  return {
    ...parsed,
    promptVersion: QUESTION_PROMPT_VERSION,
    model: response.model
  };
}

export async function evaluateInterviewAnswer(rawInput: unknown) {
  const input = answerEvaluationRequestSchema.parse(rawInput);
  const client = getOpenAIClient();

  if (!client) {
    return {
      ...fallbackEvaluation(input.answer),
      rubricVersion: "readiness-rubric-v1",
      promptVersion: EVALUATION_PROMPT_VERSION,
      model: "fallback"
    };
  }

  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    temperature: 0.15,
    messages: [
      {
        role: "system",
        content:
          "You are PrepPilot, a strict but kind AI interview evaluator. Score only the submitted answer. Never guarantee hiring outcomes. Return strict JSON only."
      },
      {
        role: "user",
        content: JSON.stringify({
          task: "Evaluate this interview answer.",
          input,
          rubric: [
            "clarity",
            "relevance",
            "confidence",
            "structure",
            "technicalDepth"
          ],
          schema: "answerEvaluationSchema"
        })
      }
    ]
  });

  const parsed = answerEvaluationSchema.parse(
    parseJsonObject(response.choices[0]?.message.content ?? "{}")
  );

  return {
    ...parsed,
    rubricVersion: "readiness-rubric-v1",
    promptVersion: EVALUATION_PROMPT_VERSION,
    model: response.model
  };
}

export async function evaluateSalaryResponse(rawInput: unknown) {
  const input = salaryEvaluationRequestSchema.parse(rawInput);
  const client = getOpenAIClient();

  if (!client) {
    return {
      ...fallbackSalaryEvaluation(input.response),
      promptVersion: SALARY_PROMPT_VERSION,
      model: "fallback"
    };
  }

  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    temperature: 0.2,
    messages: [
      {
        role: "system",
        content:
          "You are PrepPilot acting as a professional salary negotiation coach. Be firm, fair, and friendly. Return strict JSON only."
      },
      {
        role: "user",
        content: JSON.stringify({
          task: "Evaluate salary negotiation response.",
          input,
          schema: "salaryEvaluationSchema"
        })
      }
    ]
  });

  const parsed = salaryEvaluationSchema.parse(
    parseJsonObject(response.choices[0]?.message.content ?? "{}")
  );

  return {
    ...parsed,
    promptVersion: SALARY_PROMPT_VERSION,
    model: response.model
  };
}

export async function evaluateResumeMatch(rawInput: unknown) {
  const input = resumeMatchRequestSchema.parse(rawInput);
  const client = getOpenAIClient();

  if (!client) {
    return {
      ...fallbackResumeMatch(input),
      promptVersion: RESUME_PROMPT_VERSION,
      model: "fallback"
    };
  }

  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    temperature: 0.15,
    messages: [
      {
        role: "system",
        content:
          "You are PrepPilot, a professional resume and job description matching coach. Return strict JSON only."
      },
      {
        role: "user",
        content: JSON.stringify({
          task: "Match resume against job description.",
          input,
          schema: "resumeMatchSchema"
        })
      }
    ]
  });

  const parsed = resumeMatchSchema.parse(
    parseJsonObject(response.choices[0]?.message.content ?? "{}")
  );

  return {
    ...parsed,
    promptVersion: RESUME_PROMPT_VERSION,
    model: response.model
  };
}

