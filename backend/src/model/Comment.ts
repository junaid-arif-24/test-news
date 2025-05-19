import mongoose, {Schema, Document} from "mongoose";


interface IComment extends Document {
    text: string;
    user: mongoose.Schema.Types.ObjectId;
    news: mongoose.Schema.Types.ObjectId;
    date : Date;

}


const CommentSchema: Schema =  new Schema({
    text:{type:String, required:true},
    user : {type:Schema.Types.ObjectId, ref:'User'},
    news:{type:Schema.Types.ObjectId, ref:'News'},
    date : {type:Date, default:Date.now}
})


const Comment = mongoose.model<IComment>("Comment", CommentSchema);

export default Comment;