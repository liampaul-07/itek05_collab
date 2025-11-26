const customersModel = require('../models/customersModel');
const orderModel = require('../models/orderModel');

const illegalCharsRegex = /[^a-zA-Z\s.,'&-]/;

const validateId = (id) => {
    const parsedId = parseInt(id);
    return !id || !Number.isInteger(parsedId) || parsedId <= 0 ? false : parsedId;
};

// --- CREATE (store): POST /api/customers ---
const store = async (req, res) => {
    const { customer_name, contact } = req.body;

    if (!customer_name || typeof customer_name !== 'string' || customer_name.trim().length === 0) {
        return res.status(400).json({
            success: false,
            message: "Customer name is required and must be a valid text string.",
        });
    }

    if (illegalCharsRegex.test(customer_name.trim())) {
        return res.status(400).json({
            success: false,
            message: "Customer name must be a valid text string."
        });
    }
    
    if (!contact || typeof contact !== 'string' || contact.trim().length === 0) {
        return res.status(400).json({
            success: false,
            message: "Contact number is required and must be a non-empty string."
        });
    }
    const phoneRegex = /^09\d{9}$/;

    if (!phoneRegex.test(contact.trim())) {
        return res.status(400).json({
            success: false,
            message: "Invalid contact number format. Please ensure it is 11 digits long, starts with '09', and contains only numbers (e.g., 09XXYYYYYYY)."
        });
    }
    
    try {
        const newCustomer = await customersModel.createCustomer(customer_name, contact);
        
        if (newCustomer && newCustomer.customer_id > 0) {
            return res.status(201).json({
                success: true,
                message: 'Customer created successfully.',
                data: newCustomer,
            });
        }
    } catch (error) {
        console.error("Error in store controller:", error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error while creating customer.',
        });
    }
};

// --- READ ALL (index): GET /api/customers ---
const index = async (req, res) => {
    try {
        const customers = await customersModel.getCustomers();
        
        return res.status(200).json({
            success: true,
            message: 'All customers retrieved successfully.',
            data: customers,
        });
    } catch (error) {
        console.error("Error in index controller:", error);
        return res.status(500).json({
            success: false,
            message: 'An internal server error occurred while retrieving customers.'
        });
    }
};

// --- READ BY ID (show): GET /api/customers/:id ---
const show = async (req, res) => {
    const customer_id = req.params.customerId;

    try {
        const customer = await customersModel.getCustomersById(customer_id);

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: `Customer with ID ${customer_id} not found.`,
            });
        }
        
        return res.status(200).json({
            success: true,
            message: `Customer ${customer_id} retrieved successfully.`,
            data: customer,
        });
    } catch (error) {
        console.error(`Error in show controller for ID ${customer_id}:`, error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error while fetching customer by ID.'
        });
    }
};

// UPDATE Controllers
const update = async (req, res) => {
    let customer_id = req.params.customerId;
    const { customer_name, contact, is_active } = req.body;

    if (!customer_id || isNaN(customer_id) || parseInt(customer_id) != customer_id ||  parseInt(customer_id) <= 0) {
        return res.status(400).json({
            success: false,
            message: "Invalid customer ID. It must be a positive integer."
        });
    }

    customer_id = parseInt(customer_id);
    
    const customer = await customersModel.getCustomersById(customer_id);

    if (!customer) {
        return res.status(404).json({
            success: false,
            message: `Customer with ID ${customer_id} not found.`,
        });
    }

    if (!customer_name || typeof customer_name !== 'string' || customer_name.trim().length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid customer_name input. Please input the required and valid customer name (text).',
        });
    }

    if (illegalCharsRegex.test(customer_name.trim())) {
        return res.status(400).json({
            success: false,
            message: "Customer name must be a text string."
        });
    }

    if (!contact || typeof contact !== 'string' || contact.trim().length === 0) {
        return res.status(400).json({
            success: false,
            message: "Contact number is required and must be a non-empty string."
        });
    }



    const phoneRegex = /^09\d{9}$/;

    if (!phoneRegex.test(contact.trim())) {
        return res.status(400).json({
            success: false,
            message: "Invalid contact number format. Please ensure it is 11 digits long, starts with '09', and contains only numbers (e.g., 09XXYYYYYYY)."
        });
    }

    if (is_active === undefined || typeof is_active !== "number" || (is_active !== 0 && is_active !== 1)) {
        return res.status(400).json({ 
            success: false, 
            message: "Invalid is_active state. Must be 0 or 1 (integer)." 
        });   
    }

    try {
        const result = await customersModel.updateCustomer(customer_id, customer_name, contact, is_active);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: `Customer with ID ${customer_id} not found.`,
            });
        }
        return res.status(200).json({
            success: true,
            message: `Customer with ID ${customer_id} updated successfully.`,
            data: result
        });
    } catch (error) {
        console.error(`Error in update controller for ID ${customer_id}:`, error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error while updating customer.',
        });
    }
};

//UPDATE is_active
const updateActive = async (req, res) => {
    const customer_id = req.params.customerId;
    const { is_active } = req.body;

    if (is_active === undefined || typeof is_active !== "number" || (is_active !== 0 && is_active !== 1)) {
        return res.status(400).json({ 
            success: false, 
            message: "Invalid is_active state. Must be 0 or 1 (integer)." 
        });   
    }

    try {
        const result = await customersModel.updateIsActive(customer_id, is_active);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: `Customer with ID ${customer_id} not found.`,
            });
        }
        return res.status(204).end();
    } catch (error) {
        console.error(`Error in update controller for ID ${customer_id}:`, error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error while updating is_active state of customer.',
        });
    }
};

// DELETE request
const destroy = async (req, res) => {
    const customer_id = req.params.customerId;

    try {
        const orderExist = await orderModel.getOrderByCustomer(customer_id);

        if (orderExist) {
            const result = await customersModel.destroyWithOrder(customer_id);

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: `Customer with ID ${customer_id} not found.`,
                });
            }
            
            return res.status(204).end();
        }
        const result = await customersModel.destroy(customer_id);
        return result;        
    } catch (error) {
        console.error(`Error in destroy controller for ID ${customer_id}:`, error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error while deleting customer.'
        });
    }
};

// Collective Export
module.exports = {
    index,
    show,
    store,
    update,
    updateActive,
    destroy,
};