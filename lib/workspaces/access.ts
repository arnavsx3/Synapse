import { getWorkspaceByOwner } from "@/lib/db/queries/workspaces";
import { workspaceParamsSchema } from "@/lib/validators/workspaces";

export async function getAuthorizedWorkspace(
  paramsPromise: Promise<{ workspaceId: string }>,
  userId: string,
) {
  const params = await paramsPromise;
  const parsed = workspaceParamsSchema.safeParse(params);

  if (!parsed.success) {
    return {
      workspace: null,
      error: "invalid" as const,
    };
  }

  const workspace = await getWorkspaceByOwner(parsed.data.workspaceId, userId);

  if (!workspace) {
    return {
      workspace: null,
      error: "not_found" as const,
    };
  }

  return {
    workspace,
  };
}
