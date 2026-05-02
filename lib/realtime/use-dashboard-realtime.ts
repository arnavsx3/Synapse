"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRealtime } from "@/providers/realtime-provider";
import type { Scope } from "@/lib/store/workspace-store";

import {
  REALTIME_EVENTS,
  type NoteChangedPayload,
  type ProjectChangedPayload,
} from "./events";

type UseDashboardRealtimeOptions = {
  scope: Scope;
  selectedNoteId: string | null;
  setScope: (scope: Scope) => void;
  setSelectedNoteId: (id: string | null) => void;
};

export function useDashboardRealtime({
  scope,
  selectedNoteId,
  setScope,
  setSelectedNoteId,
}: UseDashboardRealtimeOptions) {
  const queryClient = useQueryClient();
  const { socket } = useRealtime();

  useEffect(() => {
    if (!socket) {
      return;
    }

    const handleProjectChanged = (payload: ProjectChangedPayload) => {
      void queryClient.invalidateQueries({ queryKey: ["projects"] });
      void queryClient.invalidateQueries({ queryKey: ["notes"] });

      if (
        payload.action === "deleted" &&
        scope === `project:${payload.projectId}`
      ) {
        setScope("inbox");
      }
    };

    const handleNoteChanged = (payload: NoteChangedPayload) => {
      void queryClient.invalidateQueries({ queryKey: ["notes"] });

      if (payload.action === "deleted" && selectedNoteId === payload.noteId) {
        setSelectedNoteId(null);
      }
    };

    socket.on(REALTIME_EVENTS.PROJECT_CHANGED, handleProjectChanged);
    socket.on(REALTIME_EVENTS.NOTE_CHANGED, handleNoteChanged);

    return () => {
      socket.off(REALTIME_EVENTS.PROJECT_CHANGED, handleProjectChanged);
      socket.off(REALTIME_EVENTS.NOTE_CHANGED, handleNoteChanged);
    };
  }, [queryClient, scope, selectedNoteId, setScope, setSelectedNoteId, socket]);
}
