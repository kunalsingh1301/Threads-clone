import mongoose from "mongoose";

const threadSchema = new mongoose.Schema({
    text: { type: String, required: true },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    community: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community',
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    parentId: {
        type: String
    },
    //making a thread parent and children 
    // ->Thread1(parent of 2 and 3)
    //  ->Thread2
    //  ->Thread3(parent for 4 and children of 1)
    //   ->Thread4
    children: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Thread'
        }
    ]
});

const Thread = mongoose.models.Thread || mongoose.model('Thread', threadSchema) //first time there is no no model so first one will run but fter that second one

export default Thread;