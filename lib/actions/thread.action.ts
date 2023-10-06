"use server"
import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

interface Params {
    text: string,
    author: string,
    communityId: string | null,
    path: string,
}

export async function createThread({ text, author, communityId, path }: Params) {
    try {
        connectToDB();

        const createdThread = await Thread.create({
            text,
            author,
            community: null,
        });

        //update user model
        await User.findByIdAndUpdate(author, {
            $push: {
                threads: createdThread._id
            }
        });

        revalidatePath(path);
    } catch (error: any) {
        throw new Error(error.message);
    }
}

export async function fetchPosts(pageNumber=1,pageSize=20){
        connectToDB();

        //calculating skip amount
        const skipAmount = (pageNumber-1)*pageSize

        //fetch posts that have no parents
        const postsQuery = Thread.find({ parentId:{$in:[null,undefined]} })
        .sort({createdAt:-1})
        .skip(skipAmount)
        .limit(pageSize)
        .populate({path:"author", model:User})
        .populate({
            path:"children",
            populate:{
                path:"author",
                model:User,
                select:'_id name parentId image'
            }
        })

        const totalPostsCount = await Thread.countDocuments({ parentId:{$in:[null,undefined]} })

        const posts = await postsQuery.exec();

        const isNext = totalPostsCount > skipAmount + posts.length;

        return {posts, isNext};
}

export async function fetchThreadById(id:string){

    connectToDB();

    try {
        const thread = await Thread.findById(id)
        .populate({
            path:'author',
            model:User,
            select:"_id id name image"
        })
        .populate({
            path:'children',
            populate:[
                {
                    path:'author',
                    model:User,
                    select:"_id id name parentId image"
                },
                {
                    path:'children',
                    model:Thread,
                    populate:{
                        path:'author',
                        model:User,
                        select:"_id id name parentId image"
                    } 
                }
            ]
        }).exec()

        return thread;
    } catch (error:any) {
        throw new Error(error.message)
    }
}

export async function addCommentToThread(
    threadId:string,
    commentText:string,
    userId: string,
    path:string,
    ){
        
        try {
            connectToDB();
            console.log("zueep")
            const originalThread = await Thread.findById(threadId);

            if(!originalThread){
                throw new Error("Thread not found")
            }

            const commentThread = new Thread({
                text:commentText,
                author:userId,
                parentId:threadId,
            })

            //save the thread
            const savedCommentThread = await commentThread.save();

            //update the original thread
            originalThread.children.push(savedCommentThread._id);

            //save the original thread
            await originalThread.save();

            revalidatePath(path);
        } catch (error:any) {
            throw new Error(error.message)
        }
}