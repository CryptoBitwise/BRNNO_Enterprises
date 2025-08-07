import { Request, Response } from 'express';
import pool from '../config/database';

// Interface for service data
interface Service {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  price: number;
  duration_minutes?: number;
  created_at: Date;
  updated_at: Date;
}

// Create a new service
export const createService = async (req: Request, res: Response) => {
  try {
    const { name, description, price, duration_minutes } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        error: 'User not authenticated'
      });
    }

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        error: 'Service name is required'
      });
    }

    if (price === undefined || price === null) {
      return res.status(400).json({
        error: 'Service price is required'
      });
    }

    // Validate price is a positive number
    if (typeof price !== 'number' || price < 0) {
      return res.status(400).json({
        error: 'Price must be a positive number'
      });
    }

    // Validate duration_minutes if provided
    if (duration_minutes !== undefined && duration_minutes !== null) {
      if (typeof duration_minutes !== 'number' || duration_minutes <= 0) {
        return res.status(400).json({
          error: 'Duration must be a positive number'
        });
      }
    }

    // Insert new service
    const newService = await pool.query(
      'INSERT INTO services (user_id, name, description, price, duration_minutes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, name, description || null, price, duration_minutes || null]
    );

    const service: Service = newService.rows[0];

    res.status(201).json({
      message: 'Service created successfully',
      service: {
        id: service.id,
        name: service.name,
        description: service.description,
        price: service.price,
        duration_minutes: service.duration_minutes,
        created_at: service.created_at,
        updated_at: service.updated_at
      }
    });

  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

// Get all services for the authenticated user
export const getServicesForUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        error: 'User not authenticated'
      });
    }

    // Get all services for the user
    const servicesResult = await pool.query(
      'SELECT * FROM services WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    const services: Service[] = servicesResult.rows;

    res.status(200).json({
      message: 'Services retrieved successfully',
      services: services.map(service => ({
        id: service.id,
        name: service.name,
        description: service.description,
        price: service.price,
        duration_minutes: service.duration_minutes,
        created_at: service.created_at,
        updated_at: service.updated_at
      })),
      count: services.length
    });

  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

// Update a service
export const updateService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price, duration_minutes } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        error: 'User not authenticated'
      });
    }

    if (!id) {
      return res.status(400).json({
        error: 'Service ID is required'
      });
    }

    // Validate price if provided
    if (price !== undefined && price !== null) {
      if (typeof price !== 'number' || price < 0) {
        return res.status(400).json({
          error: 'Price must be a positive number'
        });
      }
    }

    // Validate duration_minutes if provided
    if (duration_minutes !== undefined && duration_minutes !== null) {
      if (typeof duration_minutes !== 'number' || duration_minutes <= 0) {
        return res.status(400).json({
          error: 'Duration must be a positive number'
        });
      }
    }

    // Check if service exists and belongs to the user
    const existingService = await pool.query(
      'SELECT * FROM services WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (existingService.rows.length === 0) {
      return res.status(404).json({
        error: 'Service not found or access denied'
      });
    }

    // Update the service
    const updatedService = await pool.query(
      'UPDATE services SET name = COALESCE($1, name), description = $2, price = COALESCE($3, price), duration_minutes = $4, updated_at = now() WHERE id = $5 AND user_id = $6 RETURNING *',
      [name, description || null, price, duration_minutes || null, id, userId]
    );

    const service: Service = updatedService.rows[0];

    res.status(200).json({
      message: 'Service updated successfully',
      service: {
        id: service.id,
        name: service.name,
        description: service.description,
        price: service.price,
        duration_minutes: service.duration_minutes,
        created_at: service.created_at,
        updated_at: service.updated_at
      }
    });

  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

// Delete a service
export const deleteService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        error: 'User not authenticated'
      });
    }

    if (!id) {
      return res.status(400).json({
        error: 'Service ID is required'
      });
    }

    // Check if service exists and belongs to the user
    const existingService = await pool.query(
      'SELECT * FROM services WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (existingService.rows.length === 0) {
      return res.status(404).json({
        error: 'Service not found or access denied'
      });
    }

    // Delete the service
    await pool.query(
      'DELETE FROM services WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    res.status(200).json({
      message: 'Service deleted successfully'
    });

  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

// Get a single service by ID
export const getServiceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        error: 'User not authenticated'
      });
    }

    if (!id) {
      return res.status(400).json({
        error: 'Service ID is required'
      });
    }

    // Get the service
    const serviceResult = await pool.query(
      'SELECT * FROM services WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (serviceResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Service not found or access denied'
      });
    }

    const service: Service = serviceResult.rows[0];

    res.status(200).json({
      message: 'Service retrieved successfully',
      service: {
        id: service.id,
        name: service.name,
        description: service.description,
        price: service.price,
        duration_minutes: service.duration_minutes,
        created_at: service.created_at,
        updated_at: service.updated_at
      }
    });

  } catch (error) {
    console.error('Get service by ID error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
}; 