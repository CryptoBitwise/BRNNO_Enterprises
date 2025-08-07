import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import clientRoutes from './routes/clientRoutes';
import serviceRoutes from './routes/serviceRoutes';
import quoteRoutes from './routes/quoteRoutes';
import invoiceRoutes from './routes/invoiceRoutes';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/clients', clientRoutes);
app.use('/api/v1/services', serviceRoutes);
app.use('/api/v1/quotes', quoteRoutes);
app.use('/api/v1/invoices', invoiceRoutes);

// Health check route
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'BRNNO API is healthy',
    timestamp: new Date().toISOString()
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to BRNNO API',
    version: '1.0.0',
    endpoints: {
      health: '/api/v1/health',
      users: {
        register: '/api/v1/users/register',
        login: '/api/v1/users/login',
        profile: '/api/v1/users/profile (protected)',
        me: '/api/v1/users/me (protected)'
      },
      clients: {
        create: '/api/v1/clients (protected)',
        list: '/api/v1/clients (protected)',
        get: '/api/v1/clients/:id (protected)',
        update: '/api/v1/clients/:id (protected)',
        delete: '/api/v1/clients/:id (protected)'
      },
      services: {
        create: '/api/v1/services (protected)',
        list: '/api/v1/services (protected)',
        get: '/api/v1/services/:id (protected)',
        update: '/api/v1/services/:id (protected)',
        delete: '/api/v1/services/:id (protected)'
      },
      quotes: {
        create: '/api/v1/quotes (protected)',
        list: '/api/v1/quotes (protected)',
        get: '/api/v1/quotes/:id (protected)',
        updateStatus: '/api/v1/quotes/:id/status (protected)',
        delete: '/api/v1/quotes/:id (protected)'
      },
      invoices: {
        createFromQuote: '/api/v1/invoices (protected)'
      }
    }
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 BRNNO API server is running on port ${port}`);
  console.log(`📊 Health check available at: http://localhost:${port}/api/v1/health`);
}); 