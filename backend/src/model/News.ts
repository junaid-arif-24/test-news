import mongoose, {Schema , Document} from "mongoose";
import { title } from "process";

interface INews extends Document {
    title: string;
    description: string;
    images: string[];
    date: Date;
    time: string;
    tags: string[];
    category: mongoose.Schema.Types.ObjectId;
    visibility : 'public' | 'private';
    views: number;
    youtubeUrl: string;
    comments  : mongoose.Schema.Types.ObjectId[];
}

const NewsSchema: Schema = new Schema({
    title: {type : String, required: true},
    description: {type : String, required: true},
    images: [{type : String}],
    date: {type : Date, default: Date.now},
    time: {type : String},
    tags: [{type : String}],
    category : {type : mongoose.Schema.Types.ObjectId, ref : 'Category'},
    visibility : {type : String, enum:['public','private'], default:'public'},
    views: {type : Number, default: 0},
    youtubeUrl: {type : String},
    comments  : [{type : mongoose.Schema.Types.ObjectId, ref : 'Comment'}]
})


const News =  mongoose.model<INews>("News", NewsSchema);

export default News;