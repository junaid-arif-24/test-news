import mongoose,{Schema,Document} from "mongoose";


interface ICategorty extends Document {
    name: string;

}

const CategorySchema: Schema = new Schema({
    name:{type:String, required:true, unique:true}
})

const Category = mongoose.model<ICategorty>("Category", CategorySchema);

export default Category;