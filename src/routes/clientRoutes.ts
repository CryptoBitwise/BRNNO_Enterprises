import { Router } from 'express';
import { 
  createClient, 
  getClientsForUser, 
  updateClient, 
  deleteClient, 
  getClientById 
} from '../controllers/clientController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

// Apply authentication middleware to all client routes
router.use(authenticateToken);

// Client CRUD routes
router.post('/', createClient);                    // Create a new client
router.get('/', getClientsForUser);                // Get all clients for user
router.get('/:id', getClientById);                 // Get a specific client
router.put('/:id', updateClient);                  // Update a client
router.delete('/:id', deleteClient);               // Delete a client

export default router; 