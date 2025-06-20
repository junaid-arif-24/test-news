import express from 'express';
import auth from '../middleware/authMiddleware';
import checkRole from '../middleware/roleMiddleware';
import upload from '../utils/multer';
import * as newsController from '../controllers/newsController';


const router = express.Router();

//Create News

router.post('/create',auth,checkRole(['admin']),upload.array('images',12), newsController.createNews)

// Get all news
router.get('/', newsController.getAllNews)

// get news by id
router.get('/:id',newsController.getNewsById)

// update news
router.put('/:id',auth ,checkRole(['admin']),upload.array("images",12), newsController.updateNews)

// delete news

router.delete("/:id",auth,checkRole(['admin']),newsController.deleteNews)


export default router;

