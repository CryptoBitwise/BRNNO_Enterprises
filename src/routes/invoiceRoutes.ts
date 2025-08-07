import { Router } from 'express';
import { createInvoiceFromQuote } from '../controllers/invoiceController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

// Apply authentication middleware to all invoice routes
router.use(authenticateToken);

// Invoice routes
router.post('/', createInvoiceFromQuote);  // Create invoice from approved quote

export default router; 