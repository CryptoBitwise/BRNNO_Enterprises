import { Router } from 'express';
import { 
  createService, 
  getServicesForUser, 
  updateService, 
  deleteService, 
  getServiceById 
} from '../controllers/serviceController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

// Apply authentication middleware to all service routes
router.use(authenticateToken);

// Service CRUD routes
router.post('/', createService);                    // Create a new service
router.get('/', getServicesForUser);                // Get all services for user
router.get('/:id', getServiceById);                 // Get a specific service
router.put('/:id', updateService);                  // Update a service
router.delete('/:id', deleteService);               // Delete a service

export default router; 