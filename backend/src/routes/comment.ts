import express from 'express';
import auth from '../middleware/authMiddleware';
import * as commentController from '../controllers/commentController';

const router = express.Router();

// get all comments
router.get('/all',auth,commentController.getAllComments);

// Add a comment 
router.post("/:id/comments",auth, commentController.addComment);

// Delete a Comment 

router.delete("/:id",auth,commentController.deleteComment);

export default router;
