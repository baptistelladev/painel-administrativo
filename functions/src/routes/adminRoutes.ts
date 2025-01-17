import { Router } from 'express';
import { createNewAdminController } from '../controllers/adminController';

const router = Router();

router.post('/admin/create-new-admin', createNewAdminController);

export default router;
