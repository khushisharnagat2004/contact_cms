const Contact = require('../model/Contact');

const createContact = async (req, res) => {
    try {
        // console.log(req.body); 
        const newContact = await Contact.create(req.body);
        res.status(201).json({
            success: true,
            mesg: "Contact created successfully",
            data: newContact
        })
    } catch (error) {
        if (error.name === 'ValidationError') {
            //console.log(error.errors);
            const validationErrors = Object.entries(error.errors).map(([field, { message }]) => ({
                field,
                message,
            }));
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors: validationErrors,
            });
        }

        console.error("Error creating contact:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while creating the contact",
            error: error.message,
        });
    }
}

const getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.status(200).json({
            success: true,
            data: contacts,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch contacts',
            error: error.message,
        });
    }
}

const getContact = async (req, res) => {
    const { id } = req.params;
    try {
        const contact = await Contact.findById(id);
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found',
            });
        }
        res.status(200).json({
            success: true,
            data: contact,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Invalid ID format',
            error: error.message,
        });
    }
}
const updateContact = async (req, res) => {
    const { id } = req.params;
    const { name, age, address } = req.body;
    try {
        const updatedContact = await Contact.findByIdAndUpdate(
            id,
            { name, age, address },
            { new: true, runValidators: true }
        );
        if (!updatedContact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Contact updated successfully',
            data: updatedContact,
        });

    } catch (error) {
        const errorMessage =
            error.name === 'CastError'
                ? 'Invalid ID format'
                : 'An error occurred while updating the contact';

        res.status(400).json({
            success: false,
            message: errorMessage,
            error: error.message,
        });
    }
}

const deleteContact = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedContact = await Contact.findByIdAndDelete(id);

        if (!deletedContact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Contact deleted successfully',
            data: deletedContact,
        });
    } catch (error) {
        const errorMessage =
            error.name === 'CastError'
                ? 'Invalid ID format'
                : 'An error occurred while deleting the contact';

        res.status(400).json({
            success: false,
            message: errorMessage,
        });
    }
}
module.exports = { createContact, getContacts, getContact,updateContact,deleteContact};