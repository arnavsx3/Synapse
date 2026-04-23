import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createChat, getChatsByUser } from "@/lib/db/queries/chats";
import { createChatSchema } from "@/lib/validators/chats";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const chats = await getChatsByUser(session.user.id);
    return NextResponse.json({ chats });
  } catch (error) {
    console.error("Get chats error:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = createChatSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    const chat = await createChat({
      userId: session.user.id,
      title: result.data.title?.trim() || "New Chat",
    });

    return NextResponse.json({ chat }, { status: 201 });
  } catch (error) {
    console.error("Create chat error:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
