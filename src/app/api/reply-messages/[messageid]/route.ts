import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { User } from "next-auth";
import { MessageModel, MessageReplyModel } from "@/model/User";
import { Message } from "@/model/User";
import mongoose from "mongoose";
import UserModel from "@/model/User";

export async function POST(
  request: Request,
  { params }: { params: { messageid: string } }
) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const _user: User = session?.user;
  if (!session || !_user) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }
  try {
    const { reply, userId } = await request.json();
    const messageId = params.messageid;
    const targetedMessage = await UserModel.findOne(
      { "messages._id": messageId },
      { "messages.$": 1 }
    );
    const repliedMessage = targetedMessage?.messages[0];

    const newReply = await new MessageReplyModel({
      userId,
      messageId,
      content: repliedMessage?.content,
      reply,
    });
    await newReply.save();

    return Response.json(
      { message: "Replied successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error repling message:", error);
    return Response.json(
      { message: "Error repling message", success: false },
      { status: 500 }
    );
  }
}
