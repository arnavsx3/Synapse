import { and, asc, desc, eq, InferInsertModel } from "drizzle-orm";
import { db } from "../client";
import { chats, chatMessages } from "../schema";

type CreateChat = InferInsertModel<typeof chats>;
type CreateChatMessage = InferInsertModel<typeof chatMessages>;

export const createChat = async (data: CreateChat) => {
  const [chat] = await db.insert(chats).values(data).returning();
  return chat;
};

export const getChatsByUser = async (userId: string) => {
  return await db
    .select()
    .from(chats)
    .where(eq(chats.userId, userId))
    .orderBy(desc(chats.updatedAt), desc(chats.createdAt));
};

export const getChatsByWorkspace = async (
  userId: string,
  workspaceId: string,
) => {
  return await db
    .select()
    .from(chats)
    .where(and(eq(chats.userId, userId), eq(chats.workspaceId, workspaceId)))
    .orderBy(desc(chats.updatedAt), desc(chats.createdAt));
};

export const getChatByUser = async (id: string, userId: string) => {
  const [chat] = await db
    .select()
    .from(chats)
    .where(and(eq(chats.id, id), eq(chats.userId, userId)));

  return chat;
};

export const getChatByWorkspace = async (
  id: string,
  userId: string,
  workspaceId: string,
) => {
  const [chat] = await db
    .select()
    .from(chats)
    .where(
      and(
        eq(chats.id, id),
        eq(chats.userId, userId),
        eq(chats.workspaceId, workspaceId),
      ),
    );

  return chat;
};

export const getChatMessagesByUser = async (chatId: string, userId: string) => {
  const chat = await getChatByUser(chatId, userId);

  if (!chat) {
    return null;
  }

  return await db
    .select()
    .from(chatMessages)
    .where(eq(chatMessages.chatId, chatId))
    .orderBy(asc(chatMessages.createdAt));
};

export const getChatMessagesByWorkspace = async (
  chatId: string,
  userId: string,
  workspaceId: string,
) => {
  const chat = await getChatByWorkspace(chatId, userId, workspaceId);

  if (!chat) {
    return null;
  }

  return await db
    .select()
    .from(chatMessages)
    .where(eq(chatMessages.chatId, chatId))
    .orderBy(asc(chatMessages.createdAt));
};

export const addChatMessage = async (data: CreateChatMessage) => {
  const [message] = await db.insert(chatMessages).values(data).returning();
  return message;
};

export const updateChatTitle = async (
  id: string,
  title: string,
  userId: string,
) => {
  const [chat] = await db
    .update(chats)
    .set({
      title,
      updatedAt: new Date(),
    })
    .where(and(eq(chats.id, id), eq(chats.userId, userId)))
    .returning();

  return chat;
};

export const updateChatTitleInWorkspace = async (
  id: string,
  title: string,
  userId: string,
  workspaceId: string,
) => {
  const [chat] = await db
    .update(chats)
    .set({
      title,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(chats.id, id),
        eq(chats.userId, userId),
        eq(chats.workspaceId, workspaceId),
      ),
    )
    .returning();

  return chat;
};

export const touchChat = async (id: string, userId: string) => {
  const [chat] = await db
    .update(chats)
    .set({
      updatedAt: new Date(),
    })
    .where(and(eq(chats.id, id), eq(chats.userId, userId)))
    .returning();

  return chat;
};

export const touchChatInWorkspace = async (
  id: string,
  userId: string,
  workspaceId: string,
) => {
  const [chat] = await db
    .update(chats)
    .set({
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(chats.id, id),
        eq(chats.userId, userId),
        eq(chats.workspaceId, workspaceId),
      ),
    )
    .returning();

  return chat;
};

export const deleteChat = async (id: string, userId: string) => {
  const [chat] = await db
    .delete(chats)
    .where(and(eq(chats.id, id), eq(chats.userId, userId)))
    .returning();

  return chat;
};

export const deleteChatInWorkspace = async (
  id: string,
  userId: string,
  workspaceId: string,
) => {
  const [chat] = await db
    .delete(chats)
    .where(
      and(
        eq(chats.id, id),
        eq(chats.userId, userId),
        eq(chats.workspaceId, workspaceId),
      ),
    )
    .returning();

  return chat;
};
