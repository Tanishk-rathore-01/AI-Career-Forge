import OpenAI from "openai";

type AiProviderName = "gemini" | "openai";

type JsonCompletionInput = {
  system: string;
  user: string;
  temperature: number;
};

type JsonCompletionResult = {
  content: string;
  model: string;
  provider: AiProviderName;
};

const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";
const DEFAULT_OPENAI_MODEL = "gpt-4.1-mini";

export function parseJsonObject<T>(content: string): T {
  const trimmed = content.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  const json = fenced?.[1] ?? trimmed;
  return JSON.parse(json) as T;
}

export async function generateJsonCompletion(
  input: JsonCompletionInput
): Promise<JsonCompletionResult | null> {
  for (const provider of getProviderOrder()) {
    try {
      const result =
        provider === "gemini"
          ? await generateGeminiJson(input)
          : await generateOpenAIJson(input);

      if (result) {
        return result;
      }
    } catch (error) {
      console.warn(
        `PrepPilot AI provider ${provider} failed; falling back.`,
        error instanceof Error ? error.message : "Unknown provider error."
      );
    }
  }

  return null;
}

function getProviderOrder(): AiProviderName[] {
  const configured = process.env.AI_PROVIDER?.toLowerCase();

  if (configured === "openai") {
    return ["openai", "gemini"];
  }

  return ["gemini", "openai"];
}

async function generateGeminiJson({
  system,
  user,
  temperature
}: JsonCompletionInput): Promise<JsonCompletionResult | null> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return null;
  }

  const model = process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL;
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
      model
    )}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: system }]
        },
        contents: [
          {
            role: "user",
            parts: [{ text: user }]
          }
        ],
        generationConfig: {
          temperature,
          responseMimeType: "application/json"
        }
      })
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini request failed with status ${response.status}.`);
  }

  const payload = (await response.json()) as {
    candidates?: Array<{
      content?: {
        parts?: Array<{ text?: string }>;
      };
    }>;
  };
  const content = payload.candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? "")
    .join("")
    .trim();

  if (!content) {
    throw new Error("Gemini returned an empty response.");
  }

  return {
    content,
    model: `gemini:${model}`,
    provider: "gemini"
  };
}

async function generateOpenAIJson({
  system,
  user,
  temperature
}: JsonCompletionInput): Promise<JsonCompletionResult | null> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return null;
  }

  const model = process.env.OPENAI_MODEL || DEFAULT_OPENAI_MODEL;
  const client = new OpenAI({ apiKey });
  const response = await client.chat.completions.create({
    model,
    temperature,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: system },
      { role: "user", content: user }
    ]
  });

  const content = response.choices[0]?.message.content?.trim();

  if (!content) {
    throw new Error("OpenAI returned an empty response.");
  }

  return {
    content,
    model: response.model,
    provider: "openai"
  };
}
