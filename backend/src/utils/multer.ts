import multer , {memoryStorage, StorageEngine} from 'multer';
import {CloudinaryStorage} from 'multer-storage-cloudinary';
import cloudinary from './cloudinary';


interface MulterFile {
    orifinalname : string;
}

const storage: StorageEngine = new CloudinaryStorage({
    cloudinary,
    params:{
        folder:"new_images_folder",
        format: async (): Promise<string> => 'jpeg',
    } as any
})


const upload = multer({storage});

export default upload;