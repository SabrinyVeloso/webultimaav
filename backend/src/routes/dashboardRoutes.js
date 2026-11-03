import { Router } from 'express';
import { auth } from '../middlewares/auth.js';
import { dashboard, report } from '../controllers/dashboardController.js';
const router = Router();
router.use(auth);
router.get('/', dashboard);
router.get('/reports', report);
export default router;
