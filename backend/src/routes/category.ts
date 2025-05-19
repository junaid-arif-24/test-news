import express from 'express';
import auth from '../middleware/authMiddleware';
import checkRole from '../middleware/roleMiddleware';
import * as categoryController from '../controllers/categoryController';
import optionalAuth from '../middleware/optionalMiddleware';

const router = express.Router();
// console.log("categoryController.updateCategory",categoryController.updateCategory)
router.post('/create',auth, checkRole(['admin']), categoryController.createCategory);
router.put('/update/:id',auth,checkRole(["admin"]), categoryController.updateCategory);
router.post('/subscribe',auth, categoryController.subscribeCategory);
router.post('/unsubscribe',auth, categoryController.unsubscribeCategory);
router.post('/subscribed-categories',auth, categoryController.getSubscribedCategories);
router.get('/',optionalAuth, categoryController.getAllCategories);
router.delete('/delete/:id',auth,checkRole(["admin"]), categoryController.deleteCategory);

export default router;