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

//get trending news
router.get('/trending',newsController.getTrendingNews);

//get Latest News
router.get('/latest',newsController.getLatestNews);

// get news by id
router.get('/:id',newsController.getNewsById)

//get related news
router.get('/relatable/:id', newsController.getRelatedNews)

// update news
router.put('/:id',auth ,checkRole(['admin']),upload.array("images",12), newsController.updateNews)

// delete news

router.delete("/:id",auth,checkRole(['admin']),newsController.deleteNews)


export default router;

