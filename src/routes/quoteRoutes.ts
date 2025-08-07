import { Router } from 'express';
import { 
  createQuote, 
  getQuoteById, 
  getQuotesForUser,
  updateQuoteStatus,
  deleteQuote
} from '../controllers/quoteController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

// Apply authentication middleware to all quote routes
router.use(authenticateToken);

// Quote routes
router.post('/', createQuote);                    // Create a new quote
router.get('/', getQuotesForUser);                // Get all quotes for user (with optional status filter)
router.get('/:id', getQuoteById);                 // Get a specific quote with items
router.patch('/:id/status', updateQuoteStatus);   // Update quote status
router.delete('/:id', deleteQuote);               // Delete a quote

export default router; 