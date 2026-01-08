import express from 'express';
import { getDiamondSlabs, createDiamondSlab, updateDiamondSlab, deleteDiamondSlab } from '../controllers/diamondSlabController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getDiamondSlabs)
    .post(protect, admin, createDiamondSlab);

router.route('/:id')
    .put(protect, admin, updateDiamondSlab)
    .delete(protect, admin, deleteDiamondSlab);

export default router;
