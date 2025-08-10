import mongoose , { Schema, Document } from 'mongoose';

interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: string;
    subscriptions: mongoose.Schema.Types.ObjectId[];
    savedNews : mongoose.Schema.Types.ObjectId[];
}


const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true,unique:true },
    password: { type: String, required: true },
    role:{type:String , enum:['admin','subscriber'],default:'subscriber'},
    subscriptions: [{type: mongoose.Schema.Types.ObjectId, ref:'Category'  }],
    savedNews: [{type:mongoose.Schema.Types.ObjectId, ref:'News'}]
});

const User = mongoose.model<IUser>('User', UserSchema);
export default User;

