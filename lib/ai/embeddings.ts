import { api } from "../api/client";

const EMBEDDING_DIMENSIONS = Number(process.env.EMBEDDING_DIMENSIONS ?? 768);

function normalizeEmbeddingInput(text: string) {
  return text.replace(/\s+/g, " ").trim().slice(0, 8000);
}

export async function embedText(text: string) {
  const input = normalizeEmbeddingInput(text);
  if (!input) {
    throw new Error("Cannot embed empty text.");
  }

  try {
    const response = await api.post(
      process.env.EMBEDDING_API_URL!,
      {
        model: process.env.EMBEDDING_MODEL!,
        input,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.EMBEDDING_API_KEY!}`,
        },
      },
    );

    const data = response.data;
    const embedding = data?.data?.[0]?.embedding;

    if (!Array.isArray(embedding)) {
      throw new Error("Embedding response did not contain a valid vector.");
    }

    if (embedding.length !== EMBEDDING_DIMENSIONS) {
      throw new Error(
        `Embedding dimensions mismatch. Expected ${EMBEDDING_DIMENSIONS}, got ${embedding.length}.`,
      );
    }

    return embedding as number[];
  } catch (error: any) {
    const errorText = error.response?.data || error.message;
    throw new Error(`Embedding request failed: ${errorText}`);
  }
}
