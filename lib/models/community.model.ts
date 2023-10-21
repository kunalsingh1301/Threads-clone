import mongoose from "mongoose";

const communitySchema = new mongoose.Schema({
    id:{type:String,required:true},
    username:{type:String,required:true,unique:true},
    name:{type:String,required:true},
    image:String,
    bio:String,
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    //one user can have refrence to many threads
    threads:[
        {
            type:mongoose.Schema.Types.ObjectId, //When you define a field as type: mongoose.Schema.Types.      ObjectId, Mongoose will expect values in that field to be MongoDB ObjectIds. In your schema, the threads field is an array of ObjectIds, and it's set up to reference documents in the "Thread" collection
            ref:'Thread'
        }
    ],
    members:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ]

});

const Community = mongoose.models.Community || mongoose.model('Community',communitySchema) //first time there is no no model so first one will run but fter that second one

export default Community;