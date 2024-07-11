const Organisation = require('./organisation');
const User = require('./user');
const { v4: uuidv4 } = require('uuid');

const getOrganisations = async (req, res) => {
    try {
        const organisations = await Organisation.find({ user: req.userId }).populate('user');
        return res.status(200).json({
            status: 'success',
            message: 'Organisations retrieved successfully',
            data: { organisations },
        });
    } catch (error) {
        console.error('Error retrieving organisations:', error);
        res.status(500).json({ message: 'Error retrieving organisations' });
    }
};

const getOrganisation = async (req, res) => {
    const { orgId } = req.params;
    try {
        const organisation = await Organisation.findOne({ orgId, user: req.userId }).populate('user');
        if (!organisation) {
            return res.status(404).json({ message: 'Organisation not found' });
        }
        return res.status(200).json({
            status: 'success',
            message: 'Organisation retrieved successfully',
            data: { organisation },
        });
    } catch (error) {
        console.error('Error retrieving organisation:', error);
        res.status(500).json({ message: 'Error retrieving organisation' });
    }
};

const createOrganisation = async (req, res) => {
    const { name, description } = req.body;
    try {
        const newOrganisation = new Organisation({
            user: req.userId,
            orgId: uuidv4(),
            name,
            description,
        });
        await newOrganisation.save();
        return res.status(201).json({
            status: 'success',
            message: 'Organisation created successfully',
            data: newOrganisation,
        });
    } catch (error) {
        console.error('Error creating organisation:', error);
        res.status(500).json({ message: 'Error creating organisation' });
    }
};

const addUserToOrganisation = async (req, res) => {
    const { orgId } = req.params;
    const { userId } = req.body;
    try {
        const organisation = await Organisation.findOne({ orgId, user: req.userId });
        if (!organisation) {
            return res.status(404).json({ message: 'Organisation not found' });
        }

        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        organisation.users.push(user._id);
        await organisation.save();

        return res.status(200).json({
            status: 'success',
            message: 'User added to organisation successfully',
        });
    } catch (error) {
        console.error('Error adding user to organisation:', error);
        res.status(500).json({ message: 'Error adding user to organisation' });
    }
};

module.exports = { getOrganisations, getOrganisation, createOrganisation, addUserToOrganisation };
