"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Socket } from "socket.io-client";
import { getRealtimeSocket } from "@/lib/realtime/client";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@/lib/realtime/events";

type RealtimeStatus = "connecting" | "connected" | "disconnected";

type RealtimeContextValue = {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
  status: RealtimeStatus;
};

const RealtimeContext = createContext<RealtimeContextValue>({
  socket: null,
  status: "disconnected",
});

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const [socket] = useState(() => getRealtimeSocket());
  const [status, setStatus] = useState<RealtimeStatus>(() =>
    socket.connected ? "connected" : "connecting",
  );

  useEffect(() => {
    const handleConnect = () => {
      setStatus("connected");
    };

    const handleDisconnect = () => {
      setStatus("disconnected");
    };

    const handleConnectError = () => {
      setStatus("disconnected");
    };

    const handleReconnectAttempt = () => {
      setStatus("connecting");
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.io.on("reconnect_attempt", handleReconnectAttempt);

    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.io.off("reconnect_attempt", handleReconnectAttempt);
      socket.disconnect();
    };
  }, [socket]);

  const value = useMemo(
    () => ({
      socket,
      status,
    }),
    [socket, status],
  );

  return (
    <RealtimeContext.Provider value={value}>
      {children}
    </RealtimeContext.Provider>
  );
}

export function useRealtime() {
  return useContext(RealtimeContext);
}
