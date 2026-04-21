import { api } from "./client";

export type Note = {
  id: string;
  title: string;
  content: string | null;
  userId: string;
  projectId: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

type CreateNoteInput = {
  title: string;
  content: string;
  projectId?: string | null;
};

type UpdateNoteInput = {
  id: string;
  title?: string;
  content?: string;
  projectId?: string | null;
};

export const getNotes = async (projectId?: string | null) => {
  const response = await api.get<{ notes: Note[] }>("/notes", {
    params: projectId ? { projectId } : undefined,
  });

  return response.data.notes;
};

export const createNote = async (data: CreateNoteInput) => {
  const response = await api.post<{ note: Note }>("/notes", data);
  return response.data.note;
};

export const updateNote = async (data: UpdateNoteInput) => {
  const response = await api.patch<{ note: Note }>("/notes", data);
  return response.data.note;
};

export const deleteNote = async (id: string) => {
  const response = await api.delete<{ note: Note }>("/notes", {
    data: { id },
  });

  return response.data.note;
};