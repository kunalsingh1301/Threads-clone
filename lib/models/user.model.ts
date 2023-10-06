import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    id:{type:String,required:true},
    username:{type:String,required:true,unique:true},
    name:{type:String,required:true},
    image:String,
    bio:String,
    //one user can have refrence to many threads
    threads:[
        {
            type:mongoose.Schema.Types.ObjectId, //When you define a field as type: mongoose.Schema.Types.      ObjectId, Mongoose will expect values in that field to be MongoDB ObjectIds. In your schema, the threads field is an array of ObjectIds, and it's set up to reference documents in the "Thread" collection
            ref:'Thread'
        }
    ],
    onboarded:{
        type:Boolean,
        default:false,
    },
    communities:[
        {
            type:mongoose.Schema.ObjectId,
            ref:'Community'
        }
    ]

});

const User = mongoose.models.User || mongoose.model('User',userSchema) //first time there is no no model so first one will run but fter that second one

export default User;