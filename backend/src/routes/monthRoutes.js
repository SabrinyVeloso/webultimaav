import { Router } from 'express';
import { auth } from '../middlewares/auth.js';
import * as controller from '../controllers/monthController.js';
const router = Router();
router.use(auth);
router.get('/', controller.list);
router.post('/', controller.close);
export default router;
