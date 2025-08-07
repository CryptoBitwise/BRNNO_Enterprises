import { Request, Response } from 'express';
import pool from '../config/database';

// Interface for client data
interface Client {
  id: string;
  user_id: string;
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

// Create a new client
export const createClient = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, notes } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        error: 'User not authenticated'
      });
    }

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        error: 'Client name is required'
      });
    }

    // Insert new client
    const newClient = await pool.query(
      'INSERT INTO clients (user_id, name, email, phone, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, name, email || null, phone || null, notes || null]
    );

    const client: Client = newClient.rows[0];

    res.status(201).json({
      message: 'Client created successfully',
      client: {
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        notes: client.notes,
        created_at: client.created_at,
        updated_at: client.updated_at
      }
    });

  } catch (error) {
    console.error('Create client error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

// Get all clients for the authenticated user
export const getClientsForUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        error: 'User not authenticated'
      });
    }

    // Get all clients for the user
    const clientsResult = await pool.query(
      'SELECT * FROM clients WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    const clients: Client[] = clientsResult.rows;

    res.status(200).json({
      message: 'Clients retrieved successfully',
      clients: clients.map(client => ({
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        notes: client.notes,
        created_at: client.created_at,
        updated_at: client.updated_at
      })),
      count: clients.length
    });

  } catch (error) {
    console.error('Get clients error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

// Update a client
export const updateClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, phone, notes } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        error: 'User not authenticated'
      });
    }

    if (!id) {
      return res.status(400).json({
        error: 'Client ID is required'
      });
    }

    // Check if client exists and belongs to the user
    const existingClient = await pool.query(
      'SELECT * FROM clients WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (existingClient.rows.length === 0) {
      return res.status(404).json({
        error: 'Client not found or access denied'
      });
    }

    // Update the client
    const updatedClient = await pool.query(
      'UPDATE clients SET name = COALESCE($1, name), email = $2, phone = $3, notes = $4, updated_at = now() WHERE id = $5 AND user_id = $6 RETURNING *',
      [name, email || null, phone || null, notes || null, id, userId]
    );

    const client: Client = updatedClient.rows[0];

    res.status(200).json({
      message: 'Client updated successfully',
      client: {
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        notes: client.notes,
        created_at: client.created_at,
        updated_at: client.updated_at
      }
    });

  } catch (error) {
    console.error('Update client error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

// Delete a client
export const deleteClient = async (req: Request, res: Response) => {
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
        error: 'Client ID is required'
      });
    }

    // Check if client exists and belongs to the user
    const existingClient = await pool.query(
      'SELECT * FROM clients WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (existingClient.rows.length === 0) {
      return res.status(404).json({
        error: 'Client not found or access denied'
      });
    }

    // Delete the client
    await pool.query(
      'DELETE FROM clients WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    res.status(200).json({
      message: 'Client deleted successfully'
    });

  } catch (error) {
    console.error('Delete client error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

// Get a single client by ID
export const getClientById = async (req: Request, res: Response) => {
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
        error: 'Client ID is required'
      });
    }

    // Get the client
    const clientResult = await pool.query(
      'SELECT * FROM clients WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (clientResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Client not found or access denied'
      });
    }

    const client: Client = clientResult.rows[0];

    res.status(200).json({
      message: 'Client retrieved successfully',
      client: {
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        notes: client.notes,
        created_at: client.created_at,
        updated_at: client.updated_at
      }
    });

  } catch (error) {
    console.error('Get client by ID error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
}; 