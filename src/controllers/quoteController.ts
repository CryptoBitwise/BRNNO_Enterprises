import { Request, Response } from 'express';
import pool from '../config/database';

// Interface for quote data
interface Quote {
  id: string;
  user_id: string;
  client_id: string;
  quote_number: string;
  status: string;
  total_amount: number;
  issued_at?: Date;
  expires_at?: Date;
  created_at: Date;
  updated_at: Date;
}

// Interface for quote item data
interface QuoteItem {
  id: string;
  quote_id: string;
  service_id: string;
  description: string;
  unit_price: number;
  quantity: number;
  created_at: Date;
  updated_at: Date;
}

// Interface for quote item input
interface QuoteItemInput {
  service_id: string;
  description: string;
  unit_price: number;
  quantity: number;
}

// Interface for create quote input
interface CreateQuoteInput {
  client_id: string;
  items: QuoteItemInput[];
  issued_at?: string;
  expires_at?: string;
}

// Generate a unique quote number
const generateQuoteNumber = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `Q-${timestamp}-${random}`;
};

// Create a new quote with items
export const createQuote = async (req: Request, res: Response) => {
  const client = await pool.connect();
  
  try {
    const { client_id, items, issued_at, expires_at }: CreateQuoteInput = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        error: 'User not authenticated'
      });
    }

    // Validate required fields
    if (!client_id) {
      return res.status(400).json({
        error: 'Client ID is required'
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: 'At least one item is required'
      });
    }

    // Validate each item
    for (const item of items) {
      if (!item.service_id) {
        return res.status(400).json({
          error: 'Service ID is required for all items'
        });
      }
      if (!item.description) {
        return res.status(400).json({
          error: 'Description is required for all items'
        });
      }
      if (typeof item.unit_price !== 'number' || item.unit_price < 0) {
        return res.status(400).json({
          error: 'Unit price must be a positive number'
        });
      }
      if (typeof item.quantity !== 'number' || item.quantity <= 0) {
        return res.status(400).json({
          error: 'Quantity must be a positive number'
        });
      }
    }

    // Verify client belongs to user
    const clientCheck = await client.query(
      'SELECT id FROM clients WHERE id = $1 AND user_id = $2',
      [client_id, userId]
    );

    if (clientCheck.rows.length === 0) {
      return res.status(404).json({
        error: 'Client not found or access denied'
      });
    }

    // Verify all services belong to user
    const serviceIds = items.map(item => item.service_id);
    const servicesCheck = await client.query(
      'SELECT id FROM services WHERE id = ANY($1) AND user_id = $2',
      [serviceIds, userId]
    );

    if (servicesCheck.rows.length !== serviceIds.length) {
      return res.status(404).json({
        error: 'One or more services not found or access denied'
      });
    }

    // Begin transaction
    await client.query('BEGIN');

    // Generate quote number
    const quoteNumber = generateQuoteNumber();

    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);

    // Insert quote
    const quoteResult = await client.query(
      `INSERT INTO quotes (user_id, client_id, quote_number, total_amount, issued_at, expires_at) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [userId, client_id, quoteNumber, totalAmount, issued_at || null, expires_at || null]
    );

    const quote: Quote = quoteResult.rows[0];

    // Insert quote items
    const quoteItems: QuoteItem[] = [];
    for (const item of items) {
      const itemResult = await client.query(
        `INSERT INTO quote_items (quote_id, service_id, description, unit_price, quantity) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING *`,
        [quote.id, item.service_id, item.description, item.unit_price, item.quantity]
      );
      quoteItems.push(itemResult.rows[0]);
    }

    // Commit transaction
    await client.query('COMMIT');

    res.status(201).json({
      message: 'Quote created successfully',
      quote: {
        id: quote.id,
        quote_number: quote.quote_number,
        client_id: quote.client_id,
        status: quote.status,
        total_amount: quote.total_amount,
        issued_at: quote.issued_at,
        expires_at: quote.expires_at,
        created_at: quote.created_at,
        updated_at: quote.updated_at,
        items: quoteItems.map(item => ({
          id: item.id,
          service_id: item.service_id,
          description: item.description,
          unit_price: item.unit_price,
          quantity: item.quantity
        }))
      }
    });

  } catch (error) {
    // Rollback transaction on error
    await client.query('ROLLBACK');
    console.error('Create quote error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  } finally {
    client.release();
  }
};

// Get a quote by ID with all its items
export const getQuoteById = async (req: Request, res: Response) => {
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
        error: 'Quote ID is required'
      });
    }

    // Get quote details
    const quoteResult = await pool.query(
      `SELECT q.*, c.name as client_name, c.email as client_email 
       FROM quotes q 
       JOIN clients c ON q.client_id = c.id 
       WHERE q.id = $1 AND q.user_id = $2`,
      [id, userId]
    );

    if (quoteResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Quote not found or access denied'
      });
    }

    const quote = quoteResult.rows[0];

    // Get quote items with service details
    const itemsResult = await pool.query(
      `SELECT qi.*, s.name as service_name 
       FROM quote_items qi 
       JOIN services s ON qi.service_id = s.id 
       WHERE qi.quote_id = $1 
       ORDER BY qi.created_at ASC`,
      [id]
    );

    const items = itemsResult.rows;

    res.status(200).json({
      message: 'Quote retrieved successfully',
      quote: {
        id: quote.id,
        quote_number: quote.quote_number,
        client_id: quote.client_id,
        client_name: quote.client_name,
        client_email: quote.client_email,
        status: quote.status,
        total_amount: quote.total_amount,
        issued_at: quote.issued_at,
        expires_at: quote.expires_at,
        created_at: quote.created_at,
        updated_at: quote.updated_at,
        items: items.map(item => ({
          id: item.id,
          service_id: item.service_id,
          service_name: item.service_name,
          description: item.description,
          unit_price: item.unit_price,
          quantity: item.quantity,
          line_total: item.unit_price * item.quantity
        }))
      }
    });

  } catch (error) {
    console.error('Get quote by ID error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

// Get all quotes for the authenticated user
export const getQuotesForUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { status } = req.query;

    if (!userId) {
      return res.status(401).json({
        error: 'User not authenticated'
      });
    }

    let query = `
      SELECT q.*, c.name as client_name, c.email as client_email,
             COUNT(qi.id) as item_count
      FROM quotes q 
      JOIN clients c ON q.client_id = c.id 
      LEFT JOIN quote_items qi ON q.id = qi.quote_id
      WHERE q.user_id = $1
    `;
    
    const queryParams = [userId];
    let paramIndex = 1;

    // Add status filter if provided
    if (status && typeof status === 'string') {
      paramIndex++;
      query += ` AND q.status = $${paramIndex}`;
      queryParams.push(status);
    }

    query += ` GROUP BY q.id, c.name, c.email ORDER BY q.created_at DESC`;

    // Get all quotes with client information
    const quotesResult = await pool.query(query, queryParams);

    const quotes = quotesResult.rows;

    res.status(200).json({
      message: 'Quotes retrieved successfully',
      quotes: quotes.map(quote => ({
        id: quote.id,
        quote_number: quote.quote_number,
        client_id: quote.client_id,
        client_name: quote.client_name,
        client_email: quote.client_email,
        status: quote.status,
        total_amount: quote.total_amount,
        item_count: parseInt(quote.item_count),
        issued_at: quote.issued_at,
        expires_at: quote.expires_at,
        created_at: quote.created_at,
        updated_at: quote.updated_at
      })),
      count: quotes.length
    });

  } catch (error) {
    console.error('Get quotes error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

// Update quote status
export const updateQuoteStatus = async (req: Request, res: Response) => {
  const client = await pool.connect();
  
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        error: 'User not authenticated'
      });
    }

    if (!id) {
      return res.status(400).json({
        error: 'Quote ID is required'
      });
    }

    if (!status) {
      return res.status(400).json({
        error: 'Status is required'
      });
    }

    // Validate status values
    const validStatuses = ['draft', 'sent', 'approved', 'declined'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Invalid status. Must be one of: draft, sent, approved, declined'
      });
    }

    // Verify quote belongs to user and get current quote
    const quoteCheck = await client.query(
      'SELECT * FROM quotes WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (quoteCheck.rows.length === 0) {
      return res.status(404).json({
        error: 'Quote not found or access denied'
      });
    }

    const currentQuote = quoteCheck.rows[0];

    // Update quote status
    const updateResult = await client.query(
      `UPDATE quotes 
       SET status = $1, updated_at = now() 
       WHERE id = $2 AND user_id = $3 
       RETURNING *`,
      [status, id, userId]
    );

    const updatedQuote = updateResult.rows[0];

    res.status(200).json({
      message: 'Quote status updated successfully',
      quote: {
        id: updatedQuote.id,
        quote_number: updatedQuote.quote_number,
        client_id: updatedQuote.client_id,
        status: updatedQuote.status,
        total_amount: updatedQuote.total_amount,
        issued_at: updatedQuote.issued_at,
        expires_at: updatedQuote.expires_at,
        created_at: updatedQuote.created_at,
        updated_at: updatedQuote.updated_at
      }
    });

  } catch (error) {
    console.error('Update quote status error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  } finally {
    client.release();
  }
};

// Delete quote
export const deleteQuote = async (req: Request, res: Response) => {
  const client = await pool.connect();
  
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
        error: 'Quote ID is required'
      });
    }

    // Verify quote belongs to user and check status
    const quoteCheck = await client.query(
      'SELECT * FROM quotes WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (quoteCheck.rows.length === 0) {
      return res.status(404).json({
        error: 'Quote not found or access denied'
      });
    }

    const quote = quoteCheck.rows[0];

    // Only allow deletion if quote is in draft status
    if (quote.status !== 'draft') {
      return res.status(400).json({
        error: 'Only draft quotes can be deleted'
      });
    }

    // Begin transaction
    await client.query('BEGIN');

    // Delete quote items first (due to foreign key constraint)
    await client.query(
      'DELETE FROM quote_items WHERE quote_id = $1',
      [id]
    );

    // Delete the quote
    await client.query(
      'DELETE FROM quotes WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    // Commit transaction
    await client.query('COMMIT');

    res.status(200).json({
      message: 'Quote deleted successfully'
    });

  } catch (error) {
    // Rollback transaction on error
    await client.query('ROLLBACK');
    console.error('Delete quote error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  } finally {
    client.release();
  }
}; 