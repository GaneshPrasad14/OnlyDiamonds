import asyncHandler from 'express-async-handler';
import TaxCharge from '../models/TaxCharge.js';

// @desc    Get all tax and charges
// @route   GET /api/tax-charges
// @access  Public
const getTaxCharges = asyncHandler(async (req, res) => {
    // Ensure default karats exist
    const defaultKarats = ['22kt', '18kt', '14kt', '9kt'];

    for (const karat of defaultKarats) {
        const exists = await TaxCharge.findOne({ karat });
        if (!exists) {
            await TaxCharge.create({ karat, vatPercent: 0, makingChargePerGram: 0, vaPercent: 25 });
        }
    }

    const charges = await TaxCharge.find({}).sort({ karat: 1 });
    res.json(charges);
});

// @desc    Update tax and charges
// @route   PUT /api/tax-charges/:id
// @access  Private/Admin
const updateTaxCharge = asyncHandler(async (req, res) => {
    const { vatPercent, makingChargePerGram, vaPercent } = req.body;
    const charge = await TaxCharge.findById(req.params.id);

    if (charge) {
        charge.vatPercent = vatPercent !== undefined ? vatPercent : charge.vatPercent;
        charge.makingChargePerGram = makingChargePerGram !== undefined ? makingChargePerGram : charge.makingChargePerGram;
        charge.vaPercent = vaPercent !== undefined ? vaPercent : charge.vaPercent;

        const updatedCharge = await charge.save();
        res.json(updatedCharge);
    } else {
        res.status(404);
        throw new Error('Tax/Charge record not found');
    }
});

export { getTaxCharges, updateTaxCharge };
