const discountModel = require('../models/discountModel');

// --- CREATE (store): POST /api/discounts ---
const store = async (req, res) => {
    const { code, percentage, usage_limit } = req.body;

    if (!code || percentage === undefined || usage_limit === undefined) {
        return res.status(400).json({
            success: false,
            message: 'Code, percentage, and usage_limit are required.',
        });
    }
    if (percentage < 0 || percentage > 100) {
        return res.status(400).json({
            success: false,
            message: 'Percentage must be between 0 and 100.',
        });
    }

    try {
        const newDiscount = await discountModel.createDiscount(code, percentage, usage_limit);
        
        return res.status(201).json({
            success: true,
            message: 'Discount created successfully.',
            data: newDiscount,
        });
    } catch (error) {
        console.error("Error in store controller:", error);
        if (error.message.includes('Duplicate entry') || error.message.includes('ER_DUP_ENTRY')) {
             return res.status(409).json({
                success: false,
                message: 'Discount code already exists.',
                details: error.message,
            });
        }
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error while creating discount.',
            details: error.message,
        });
    }
};

// --- READ ALL (index): GET /api/discounts ---
const index = async (req, res) => {
    try {
        const discounts = await discountModel.getDiscounts();
        
        return res.status(200).json({
            success: true,
            message: 'All discounts retrieved successfully.',
            data: discounts,
        });
    } catch (error) {
        console.error("Error in index controller:", error);
        return res.status(500).json({
            success: false,
            message: 'An internal server error occurred while retrieving discounts.',
            details: error.message,
        });
    }
};

// --- READ BY CODE (indexByCode): GET /api/discounts/apply?code=... ---
const indexByCode = async (req, res) => {
    const { code } = req.query; // Check query parameter
    if (!code) {
        return res.status(400).json({
            success: false,
            message: 'Discount code query parameter is required.',
        });
    }

    try {
        const discount = await discountModel.getDiscountByCode(code);

        if (!discount) {
            return res.status(404).json({
                success: false,
                message: `Discount code '${code}' is invalid or inactive.`,
            });
        }

        // Check usage limits before returning
        if (discount.usage_limit !== null && discount.usage_count >= discount.usage_limit) {
            return res.status(403).json({
                success: false,
                message: `Discount code '${code}' has reached its usage limit.`,
            });
        }
        
        return res.status(200).json({
            success: true,
            message: 'Discount successfully applied.',
            data: discount,
        });
    } catch (error) {
        console.error(`Error in indexByCode controller for code ${code}:`, error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error while fetching discount by code.',
            details: error.message,
        });
    }
};

// --- READ USAGE (indexDiscountUsage): GET /api/discounts/usage/:id ---
const indexDiscountUsage = async (req, res) => {
    const discountId = req.params.id;
    try {
        const usageData = await discountModel.getDiscountUsage(discountId);

        if (!usageData) {
            return res.status(404).json({
                success: false,
                message: `Discount with ID ${discountId} not found.`,
            });
        }
        
        return res.status(200).json({
            success: true,
            message: `Discount usage for ID ${discountId} retrieved.`,
            data: usageData,
        });
    } catch (error) {
        console.error(`Error in indexDiscountUsage controller for ID ${discountId}:`, error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error while fetching discount usage.',
            details: error.message,
        });
    }
};

// --- UPDATE (update): PUT /api/discounts/:id ---
const update = async (req, res) => {
    const discountId = req.params.id;
    const { code, percentage, usage_limit, is_active } = req.body;

    if (!code && percentage === undefined && usage_limit === undefined && is_active === undefined) {
        return res.status(400).json({
            success: false,
            message: 'At least one field must be provided for update.',
        });
    }

    try {
        const result = await discountModel.updateDiscount(discountId, code, percentage, usage_limit, is_active);

        if (result.affected === 0) {
            return res.status(404).json({
                success: false,
                message: `Discount with ID ${discountId} not found.`,
            });
        }

        return res.status(200).json({
            success: true,
            message: `Discount with ID ${discountId} updated successfully.`,
        });
    } catch (error) {
        console.error(`Error in update controller for ID ${discountId}:`, error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error while updating discount.',
            details: error.message,
        });
    }
};

// --- DELETE (destroy): PUT /api/discounts/remove/:id ---
// Note: PUT method is specified in your blueprint for DELETE operation
const destroy = async (req, res) => {
    const discountId = req.params.id;

    try {
        const result = await discountModel.deleteDiscount(discountId);

        if (result.affected === 0) {
            return res.status(404).json({
                success: false,
                message: `Discount with ID ${discountId} not found.`,
            });
        }

        return res.status(200).json({
            success: true,
            message: `Discount with ID ${discountId} deleted successfully.`,
        });
    } catch (error) {
        console.error(`Error in destroy controller for ID ${discountId}:`, error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error while deleting discount.',
            details: error.message,
        });
    }
};

// Collective Export
module.exports = {
    store,
    index,
    indexByCode,
    indexDiscountUsage,
    update,
    destroy,
};