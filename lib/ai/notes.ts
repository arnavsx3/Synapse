type NoteForEmbedding = {
  title: string;
  content: string | null;
  projectName?: string | null;
};

export function buildNoteEmbeddingText(note: NoteForEmbedding) {
  return [
    note.projectName ? `Project: ${note.projectName}` : "Project: Inbox",
    `Title: ${note.title}`,
    `Content: ${note.content?.trim() || "Empty note"}`,
  ].join("\n");
}