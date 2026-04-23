import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  addChatMessage,
  getChatByUser,
  getChatMessagesByUser,
  touchChat,
  updateChatTitle,
} from "@/lib/db/queries/chats";
import {
  chatParamsSchema,
  sendChatMessageSchema,
} from "@/lib/validators/chats";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ chatId: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const params = await context.params;
    const paramsResult = chatParamsSchema.safeParse(params);

    if (!paramsResult.success) {
      return NextResponse.json({ message: "Invalid chat id" }, { status: 400 });
    }

    const messages = await getChatMessagesByUser(
      paramsResult.data.chatId,
      session.user.id,
    );
    if (!messages) {
      return NextResponse.json({ message: "Chat not found" }, { status: 404 });
    }
    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Get chat messages error:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
