import express from 'express';
import { getHeroImages, getAllHeroImages, createHeroImage, deleteHeroImage, updateHeroImage } from '../controllers/heroController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        const filetypes = /jpg|jpeg|png|webp/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb('Images only!');
        }
    },
});

router.route('/')
    .get(getHeroImages)
    .post(protect, admin, upload.single('image'), createHeroImage);

router.route('/admin').get(protect, admin, getAllHeroImages);

router.route('/:id')
    .delete(protect, admin, deleteHeroImage)
    .put(protect, admin, upload.single('image'), updateHeroImage);

export default router;
