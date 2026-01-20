import express from 'express';
import { getTaxCharges, updateTaxCharge } from '../controllers/taxChargeController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getTaxCharges);

router.route('/:id')
    .put(protect, admin, updateTaxCharge);

export default router;
