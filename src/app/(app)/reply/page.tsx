"use client"

import ReplyCard from "@/components/component/reply-card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

interface Message {
    content: string;
    reply: string;
}


const ReplyBox = () => {
    const [messages, setMessages] = useState<Message[]>([])
    const { data: session } = useSession();
    const fetchALlMessage = useCallback(
        async (refresh: boolean = false) => {
            try {
                const response = await axios.get<ApiResponse>(`/api/get-all-reply-message/`);
                const newMessages: any = response.data.messages
                setMessages(newMessages);
            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>;
                toast({
                    title: 'Error',
                    description:
                        axiosError.response?.data.message ?? 'Failed to fetch messages',
                    variant: 'destructive',
                });
                console.log(error);
            }
        }, [session]
    )

    useEffect(() => {
        fetchALlMessage()
    }, [fetchALlMessage])

    return (
        <>
            <>
                <div className="flex justify-center items-center flex-wrap">
                    {messages.length > 0 ? (
                        messages.map((message, index) => (
                            <ReplyCard key={index} question={message?.content} answer={message?.reply} />
                        ))
                    ) : (
                        <>
                            <div className="flex items-center justify-center h-screen">
                                <div className="text-gray-500 dark:text-gray-400 text-2xl font-medium">
                                    <span className="inline-block animate-[typing_2s_steps(20)_infinite]">No Replied Messages</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </>

        </>
    );
}

export default ReplyBox