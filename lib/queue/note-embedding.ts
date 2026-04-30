import { noteEmbeddingQueue } from "./queues";

type EnqueueNoteEmbeddingJobInput = {
  noteId: string;
  userId: string;
};

export async function enqueueNoteEmbeddingJob(
  data: EnqueueNoteEmbeddingJobInput,
) {
  await noteEmbeddingQueue.add("embed-note", data, {
    attempts: 3,
    removeOnComplete: true,
    removeOnFail: false,
  });
}
