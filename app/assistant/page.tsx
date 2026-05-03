import { auth } from "@/auth";
import Link from "next/link";
import { RealtimeStatus } from "@/components/realtime-status";
import { RealtimeProvider } from "@/providers/realtime-provider";
import { AssistantWorkspace } from "./assistant-workspace";

export default async function AssistantPage() {
  const session = await auth();

  return (
    <RealtimeProvider>
      <div className="min-h-screen bg-linear-to-br from-(--bg-start) via-(--bg-mid) to-(--bg-end) text-(--text-main)">
        <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
            <div>
              <h1 className="text-lg font-semibold tracking-tight">
                Assistant
              </h1>
              <p className="text-xs text-[#94A3B8]">
                Stateful AI chat with persistent history
              </p>
            </div>

            <div className="flex items-center gap-4">
              <RealtimeStatus />
              <p className="hidden text-sm text-[#94A3B8] sm:block">
                {session?.user?.email ?? ""}
              </p>

              <Link
                href="/dashboard"
                className="rounded-lg border border-white/10 px-4 py-2 text-sm text-[#94A3B8] transition hover:bg-white/10 hover:text-white">
                Dashboard
              </Link>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-8">
          <AssistantWorkspace />
        </main>
      </div>
    </RealtimeProvider>
  );
}
