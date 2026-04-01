const mongoose = require('mongoose');
const Table = require('../models/Table');
const Owner = require('../models/Owner');
const User = require('../models/User');

// Helpers for Haversine distance
function getDistanceFromLatLonInM(lat1, lon1, lat2, lon2) {
    var R = 6371e3; // Radius of the earth in m
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

// @desc    Generate tables for a cafe
// @route   POST /api/tables/generate
exports.generateTables = async (req, res) => {
    const { cafeId, numberOfTables } = req.body;

    if (!cafeId || !numberOfTables) {
        return res.status(400).json({ message: 'Please provide cafeId and numberOfTables' });
    }

    try {
        // Clear existing tables for this cafe or keep them? 
        // For simplicity, let's just delete existing ones and recreate, 
        // OR add missing ones. Recreating is easier but wipes status. 
        // Let's add missing ones up to numberOfTables.

        const existingTablesCount = await Table.countDocuments({ cafeId });

        if (numberOfTables > existingTablesCount) {
            const tablesToAdd = [];
            for (let i = existingTablesCount + 1; i <= numberOfTables; i++) {
                tablesToAdd.push({
                    cafeId,
                    tableNumber: i,
                    qrCodeData: `/cafe/${cafeId}/table/${i}`, // Frontend will prepend base URL
                    isOccupied: false
                });
            }
            await Table.insertMany(tablesToAdd);
        } else if (numberOfTables < existingTablesCount) {
            // Optional: delete tables above the new number
            await Table.deleteMany({ cafeId, tableNumber: { $gt: numberOfTables } });
        }

        const allTables = await Table.find({ cafeId }).sort({ tableNumber: 1 });
        res.status(200).json(allTables);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get all tables for a cafe
// @route   GET /api/tables/:cafeId
exports.getTables = async (req, res) => {
    const { cafeId } = req.params;
    try {
        const tables = await Table.find({ cafeId }).sort({ tableNumber: 1 });
        res.status(200).json(tables);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get status of a specific table
// @route   GET /api/tables/:cafeId/:tableNumber
exports.getTableStatus = async (req, res) => {
    const { cafeId, tableNumber } = req.params;
    try {
        const tableDoc = await Table.findOne({ cafeId, tableNumber: parseInt(tableNumber) });
        if (!tableDoc) return res.status(404).json({ message: 'Table not found. Please scan a valid QR code.' });

        const table = tableDoc.toObject();

        // Find owner to check geofencing settings
        let owner = await User.findById(cafeId);
        if (!owner && mongoose.Types.ObjectId.isValid(cafeId)) {
            owner = await User.findOne({ cafeId, role: 'owner' });
        }
        if (!owner) owner = await Owner.findById(cafeId);
        if (!owner && mongoose.Types.ObjectId.isValid(cafeId)) {
            owner = await Owner.findOne({ cafeId });
        }

        if (owner && owner.locationSettings && owner.locationSettings.enabled) {
            // Only require location if coordinates are actually set
            if (owner.locationSettings.latitude != null && owner.locationSettings.longitude != null) {
                table.locationRequired = true;
            }
        }

        res.status(200).json(table);
    } catch (err) {
        console.error('[getTableStatus] Error:', err);
        res.status(500).json({ message: 'Server error while fetching table status.' });
    }
};

// @desc    Occupy a table
// @route   POST /api/tables/:cafeId/:tableNumber/occupy
exports.occupyTable = async (req, res) => {
    const { cafeId, tableNumber } = req.params;
    const { userLat, userLng } = req.body || {};
    try {
        const table = await Table.findOne({ cafeId, tableNumber: parseInt(tableNumber) });
        if (!table) return res.status(404).json({ message: 'Table not found.' });

        if (table.isOccupied) {
            return res.status(400).json({ message: 'This table is already occupied by another customer.' });
        }

        // Enforce Geofencing if enabled
        let owner = await User.findById(cafeId);
        if (!owner && mongoose.Types.ObjectId.isValid(cafeId)) {
            owner = await User.findOne({ cafeId, role: 'owner' });
        }
        if (!owner) owner = await Owner.findById(cafeId);
        if (!owner && mongoose.Types.ObjectId.isValid(cafeId)) {
            owner = await Owner.findOne({ cafeId });
        }

        if (owner && owner.locationSettings && owner.locationSettings.enabled) {
            const { latitude, longitude, radius } = owner.locationSettings;
            if (latitude != null && longitude != null) {
                if (userLat == null || userLng == null) {
                    return res.status(403).json({ message: 'Location access is required to view the menu at this cafe.' });
                }
                const distance = getDistanceFromLatLonInM(latitude, longitude, userLat, userLng);
                if (distance > (radius || 100)) {
                    return res.status(403).json({ message: 'Validation failed: You must be physically present in the cafe to view the menu.' });
                }
            }
        }

        table.isOccupied = true;
        await table.save();
        res.status(200).json(table);
    } catch (err) {
        console.error('[occupyTable] Error:', err);
        res.status(500).json({ message: 'Server error while occupying table.' });
    }
};

// @desc    Free a table
// @route   POST /api/tables/:cafeId/:tableNumber/free
exports.freeTable = async (req, res) => {
    const { cafeId, tableNumber } = req.params;
    try {
        const table = await Table.findOne({ cafeId, tableNumber: parseInt(tableNumber) });
        if (!table) return res.status(404).json({ message: 'Table not found' });

        table.isOccupied = false;
        table.currentSession = null;
        await table.save();
        res.status(200).json(table);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
