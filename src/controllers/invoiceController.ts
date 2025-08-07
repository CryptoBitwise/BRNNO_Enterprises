import { Request, Response } from 'express';
import pool from '../config/database';

// Interface for invoice data
interface Invoice {
    id: string;
    user_id: string;
    client_id: string;
    quote_id?: string;
    invoice_number: string;
    status: string;
    total_amount: number;
    issued_date: Date;
    due_date?: Date;
    paid_at?: Date;
    created_at: Date;
    updated_at: Date;
}

// Interface for invoice item data
interface InvoiceItem {
    id: string;
    invoice_id: string;
    description: string;
    unit_price: number;
    quantity: number;
    created_at: Date;
    updated_at: Date;
}

// Interface for create invoice from quote input
interface CreateInvoiceFromQuoteInput {
    quote_id: string;
    due_date?: string;
}

// Generate a unique invoice number
const generateInvoiceNumber = (): string => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `INV-${timestamp}-${random}`;
};

// Create an invoice from an approved quote
export const createInvoiceFromQuote = async (req: Request, res: Response) => {
    const client = await pool.connect();

    try {
        const { quote_id, due_date }: CreateInvoiceFromQuoteInput = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                error: 'User not authenticated'
            });
        }

        if (!quote_id) {
            return res.status(400).json({
                error: 'Quote ID is required'
            });
        }

        // Verify quote belongs to user and get quote details
        const quoteResult = await client.query(
            `SELECT q.*, c.name as client_name, c.email as client_email 
       FROM quotes q 
       JOIN clients c ON q.client_id = c.id 
       WHERE q.id = $1 AND q.user_id = $2`,
            [quote_id, userId]
        );

        if (quoteResult.rows.length === 0) {
            return res.status(404).json({
                error: 'Quote not found or access denied'
            });
        }

        const quote = quoteResult.rows[0];

        // Check if quote is approved
        if (quote.status !== 'approved') {
            return res.status(400).json({
                error: 'Only approved quotes can be converted to invoices'
            });
        }

        // Check if invoice already exists for this quote
        const existingInvoiceResult = await client.query(
            'SELECT id FROM invoices WHERE quote_id = $1',
            [quote_id]
        );

        if (existingInvoiceResult.rows.length > 0) {
            return res.status(400).json({
                error: 'An invoice already exists for this quote'
            });
        }

        // Get quote items
        const quoteItemsResult = await client.query(
            'SELECT * FROM quote_items WHERE quote_id = $1 ORDER BY created_at ASC',
            [quote_id]
        );

        if (quoteItemsResult.rows.length === 0) {
            return res.status(400).json({
                error: 'Quote has no items to convert to invoice'
            });
        }

        const quoteItems = quoteItemsResult.rows;

        // Begin transaction
        await client.query('BEGIN');

        // Generate invoice number
        const invoiceNumber = generateInvoiceNumber();

        // Create invoice
        const invoiceResult = await client.query(
            `INSERT INTO invoices (user_id, client_id, quote_id, invoice_number, total_amount, due_date) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
            [userId, quote.client_id, quote_id, invoiceNumber, quote.total_amount, due_date || null]
        );

        const invoice: Invoice = invoiceResult.rows[0];

        // Create invoice items
        const invoiceItems: InvoiceItem[] = [];
        for (const item of quoteItems) {
            const itemResult = await client.query(
                `INSERT INTO invoice_items (invoice_id, description, unit_price, quantity) 
         VALUES ($1, $2, $3, $4) 
         RETURNING *`,
                [invoice.id, item.description, item.unit_price, item.quantity]
            );
            invoiceItems.push(itemResult.rows[0]);
        }

        // Update quote status to 'invoiced' to prevent duplicate conversion
        await client.query(
            'UPDATE quotes SET status = $1, updated_at = now() WHERE id = $2',
            ['invoiced', quote_id]
        );

        // Commit transaction
        await client.query('COMMIT');

        res.status(201).json({
            message: 'Invoice created successfully from quote',
            invoice: {
                id: invoice.id,
                invoice_number: invoice.invoice_number,
                client_id: invoice.client_id,
                client_name: quote.client_name,
                client_email: quote.client_email,
                quote_id: invoice.quote_id,
                status: invoice.status,
                total_amount: invoice.total_amount,
                issued_date: invoice.issued_date,
                due_date: invoice.due_date,
                created_at: invoice.created_at,
                updated_at: invoice.updated_at,
                items: invoiceItems.map(item => ({
                    id: item.id,
                    description: item.description,
                    unit_price: item.unit_price,
                    quantity: item.quantity,
                    line_total: item.unit_price * item.quantity
                }))
            }
        });

    } catch (error) {
        // Rollback transaction on error
        await client.query('ROLLBACK');
        console.error('Create invoice from quote error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    } finally {
        client.release();
    }
}; 