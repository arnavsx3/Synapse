import { api } from "./client";

export type Project = {
  id: string;
  name: string;
  description: string | null;
  userId: string;
  createdAt: string | null;
  updatedAt: string | null;
};

type CreateProjectInput = {
  name: string;
  description?: string;
};

type UpdateProjectInput = {
  id: string;
  name?: string;
  description?: string;
};

export const getProjects = async () => {
  const response = await api.get<{ projects: Project[] }>("/projects");
  return response.data.projects;
};

export const createProject = async (data: CreateProjectInput) => {
  const response = await api.post<{ project: Project }>("/projects", data);
  return response.data.project;
};

export const updateProject = async (data: UpdateProjectInput) => {
  const response = await api.patch<{ project: Project }>("/projects", data);
  return response.data.project;
};

export const deleteProject = async (id: string) => {
  const response = await api.delete<{ project: Project }>("/projects", {
    data: { id },
  });

  return response.data.project;
};
