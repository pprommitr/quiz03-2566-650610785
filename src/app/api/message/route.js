import { DB, readDB, writeDB } from "@/app/libs/DB";
import { checkToken } from "@/app/libs/checkToken";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  readDB();

  const roomId = request.nextUrl.searchParams.get("roomId");
  const room = DB.rooms.find((room) => room.roomId === roomId);
  if (!room) {
    return NextResponse.json(
      {
        ok: false,
        message: `Room is not found`,
      },
      { status: 404 }
    );
  }

  const messages = DB.messages.filter((message) => message.roomId === roomId);
  return NextResponse.json({
    ok: true,
    messages,
  });
};

export const POST = async (request) => {
  readDB();

  const body = await request.json();
  const { roomId, messageText } = body;
  const room = DB.rooms.find((room) => room.roomId === roomId);
  if (!room) {
    return NextResponse.json(
      {
        ok: false,
        message: `Room is not found`,
      },
      { status: 404 }
    );
  }

  const messageId = nanoid();
  DB.messages.push({
    roomId,
    messageId,
    messageText,
  });

  writeDB();

  return NextResponse.json({
    ok: true,
    messageId,
    message: "Message has been sent",
  });
};

export const DELETE = async (request) => {
  const payload = checkToken();

  if (!payload || payload.role !== "SUPER_ADMIN") {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  }

  readDB();

  const body = await request.json();
  const { messageId } = body;
  const messageIndex = DB.messages.findIndex(
    (message) => message.messageId === messageId
  );
  if (messageIndex === -1) {
    return NextResponse.json(
      {
        ok: false,
        message: "Message is not found",
      },
      { status: 404 }
    );
  }
  DB.messages.splice(messageIndex, 1);

  writeDB();

  return NextResponse.json({
    ok: true,
    message: "Message has been deleted",
  });
};
