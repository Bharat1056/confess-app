import dbConnect from "@/lib/dbConnect";
import { MessageReplyModel } from "@/model/User";
import UserModel from "@/model/User";
import mongoose from "mongoose";
import { User } from "next-auth";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET(request: Request) {
  await dbConnect();
  try {
    const session = await getServerSession(authOptions);
    const _user: User = session?.user;
    if (!session || !_user) {
      return Response.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }
    const allRepliedMessages = await MessageReplyModel.find({
      userId: _user._id,
    });
    if (!allRepliedMessages) {
      return Response.json(
        { message: "No replied message for this user", success: true },
        { status: 201 }
      );
    }
    return Response.json(
      {
        message: "Message fetched successfully",
        messages: allRepliedMessages,
        success: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error fetching message:", error);
    return Response.json(
      { message: "Error fetching message", success: false },
      { status: 401 }
    );
  }
}
