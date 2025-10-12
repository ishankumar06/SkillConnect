import express from 'express';
import * as resumeController from '../controller/resumeController.js';

const router = express.Router();

router.post('/', resumeController.createResume);
router.get('/', resumeController.getResumes);
router.get('/:id', resumeController.getResumeById);
router.put('/:id', resumeController.updateResume);
router.delete('/:id', resumeController.deleteResume);

export default router;
