"use client"

import * as z from "zod"
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { zodResolver } from '@hookform/resolvers/zod';
import Image from "next/image";
import { usePathname } from "next/navigation";

import { CommentValidation } from "@/lib/validations/thread";
import { addCommentToThread } from "@/lib/actions/thread.action";

interface Props {
    threadId: string;
    currentUserImg: string;
    currentUserId: string;
}

const Comment = ({
    threadId,
    currentUserImg,
    currentUserId
}: Props) => {
    const pathname = usePathname();

    const form = useForm({
        resolver: zodResolver(CommentValidation),
        defaultValues: {
            thread: '',
        }
    });
    console.log("threadif:",threadId, "crruid:",currentUserId,)

    const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
        await addCommentToThread(
            threadId,
            values.thread,
            JSON.parse(currentUserId),
            pathname
        );
        console.log("zeep")

        form.reset(); //if want to add another comment
    }
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className=" comment-form">
                <FormField
                    control={form.control}
                    name="thread"
                    render={({ field }) => (
                        <FormItem className="flex gap-3 items-center w-full">
                            <FormLabel>
                                <Image
                                    src={currentUserImg}
                                    alt="profile image"
                                    width={48}
                                    height={48}
                                    className="rounded-full object-cover"
                                />
                            </FormLabel>
                            <FormControl className="border-none bg-transparent">
                                <Input
                                    type="text"
                                    placeholder="Comment..."
                                    className="no-focus text-light-1 outline-none "
                                    {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="comment-form_btn">
                    Reply
                </Button>
            </form>
        </Form>
    )
}

export default Comment;