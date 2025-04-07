'use client'

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { X } from 'lucide-react';
import { Message } from '@/model/User';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from './ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ApiResponse } from '@/types/ApiResponse';

import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Textarea } from './ui/textarea';

import { CardDescription } from "@/components/ui/card"
import { useSession } from 'next-auth/react';
import { User } from 'next-auth';


const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
};

type MessageCardProps = {
  key: string;
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

export function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const { toast } = useToast();

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {setOpen(false), setReply("")};
  const [reply, setReply] = useState("")

  const { data: session } = useSession();
  const user : User = session?.user;

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );
      toast({
        title: response.data.message,
      });
      onMessageDelete(message._id as string);

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ?? 'Failed to delete message',
        variant: 'destructive',
      });
    }
  };

  const sendReply = async () => {
    try {
      const response = await axios.post<ApiResponse>(
        `/api/reply-messages/${message._id}`, {
          reply,
          userId: user._id
        }
      );
      toast({
        title: response.data?.message || "Error in reply message",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ?? 'Failed to reply message',
        variant: 'destructive',
      });
    }finally {
      handleClose()
    }
  }

  return (
    <Card className="card-bordered">
      <CardHeader className='text-wrap'>
        <div className="flex justify-between items-center ">
          <CardTitle className='w-full overflow-hidden whitespace-nowrap overflow-ellipsis'>{message.content}</CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='destructive'>
                <X className="w-3 h-3" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this message.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="text-sm mt-5">
          {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
        </div>
      </CardHeader>
      <Button className='mx-5' onClick={handleOpen}>Answer</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div style={style}>
        <Card className="w-full max-w-md shadow-md">
          <CardHeader>
            <CardTitle>Share Your Reply</CardTitle>
            <CardDescription>We value your input and would love to hear your thoughts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea value={reply} onChange={(e) => setReply(e.target.value)} className="resize-none" placeholder="Enter your reply here..." rows={5} />
            <div className="flex justify-center">
              <Button onClick={sendReply}>Send Reply</Button>
            </div>
          </CardContent>
        </Card>
        </div>
      </Modal>
      <CardContent></CardContent>

    </Card>
  );
}
