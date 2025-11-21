const customerModel = require('../models/customerModel');

// --- READ ALL (index): GET /api/customers ---
const index = async (req, res) => {
    try {
        const customers = await customerModel.getCustomers();
        
        return res.status(200).json({
            success: true,
            message: 'All customers retrieved successfully.',
            data: customers,
        });
    } catch (error) {
        console.error("Error in index controller:", error);
        return res.status(500).json({
            success: false,
            message: 'An internal server error occurred while retrieving customers.',
            details: error.message,
        });
    }
};

// --- READ BY ID (show): GET /api/customers/:id ---
const indexByCategory = async (req, res) => {
    const customerId = req.params.id;
    try {
        const customer = await customerModel.getCustomerById(customerId);

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: `Customer with ID ${customerId} not found.`,
            });
        }
        
        return res.status(200).json({
            success: true,
            message: `Customer ${customerId} retrieved successfully.`,
            data: customer,
        });
    } catch (error) {
        console.error(`Error in show controller for ID ${customerId}:`, error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error while fetching customer by ID.',
            details: error.message,
        });
    }
};

// --- CREATE (store): POST /api/customers ---
const store = async (req, res) => {
    // Expecting customer_name and contact from the request body
    const { customer_name, contact } = req.body; 

    // Basic validation
    if (!customer_name) {
        return res.status(400).json({
            success: false,
            message: 'Customer name is required.',
        });
    }

    try {
        // Pass the required fields to the model
        const newCustomer = await customerModel.createCustomer(customer_name, contact);
        
        return res.status(201).json({
            success: true,
            message: 'Customer created successfully.',
            data: newCustomer,
        });
    } catch (error) {
        console.error("Error in store controller:", error);
        if (error.message.includes('Duplicate entry') || error.message.includes('ER_DUP_ENTRY')) {
             return res.status(409).json({
                success: false,
                message: 'Customer with this name or contact already exists.',
                details: error.message,
            });
        }
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error while creating customer.',
            details: error.message,
        });
    }
};

// --- UPDATE (update): PUT /api/customers/:id ---
const update = async (req, res) => {
    const customerId = req.params.id;
    const { customer_name, contact, is_active } = req.body;

    // Check if any fields were provided
    if (!customer_name && !contact && is_active === undefined) {
        return res.status(400).json({
            success: false,
            message: 'At least one field must be provided for update.',
        });
    }

    try {
        const result = await customerModel.updateCustomer(customerId, customer_name, contact, is_active);

        if (result.affected === 0) {
            return res.status(404).json({
                success: false,
                message: `Customer with ID ${customerId} not found.`,
            });
        }

        return res.status(200).json({
            success: true,
            message: `Customer with ID ${customerId} updated successfully.`,
        });
    } catch (error) {
        console.error(`Error in update controller for ID ${customerId}:`, error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error while updating customer.',
            details: error.message,
        });
    }
};

// --- DELETE (destroy): DELETE /api/customers/:id ---
const destroy = async (req, res) => {
    const customerId = req.params.id;

    try {
        const result = await customerModel.deleteCustomer(customerId);

        if (result.affected === 0) {
            return res.status(404).json({
                success: false,
                message: `Customer with ID ${customerId} not found.`,
            });
        }

        return res.status(200).json({
            success: true,
            message: `Customer with ID ${customerId} deleted successfully.`,
        });
    } catch (error) {
        console.error(`Error in destroy controller for ID ${customerId}:`, error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error while deleting customer.',
            details: error.message,
        });
    }
};

// Collective Export
module.exports = {
    index,
    indexByCategory,
    store,
    update,
    destroy,
};