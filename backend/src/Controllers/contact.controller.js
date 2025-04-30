const Contact = require("../models/contacts"); 
const User = require("../models/user"); 
const jwt = require("jsonwebtoken"); 

const addContact = async (req, res) => {
  try {
    const { firstName, lastName, phone, address, email } = req.body.formData;

    if (!firstName || !phone) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const user = await User.findById(req.user.id).populate("contacts");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isPhoneExist = user.contacts.some((contact) => contact?.phone == phone);

    if (isPhoneExist) {
      return res
        .status(409)
        .json({ message: "A contact with this phone number already exists." });
    }

    const newContact = await Contact.create({
      userId: req.user.id,
      firstName,
      lastName,
      phone,
      address,
      email,
    });

    user.contacts.push(newContact._id);
    await user.save();

    res.status(201).json({
      message: "Contact created successfully.",
      contact: newContact,
    });
  } catch (error) {
    console.error("Error adding contact:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};


const getAllContacts = async (req, res) => {
  try {
    const token = req.body.token; 

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    const user = await User.findById(req.user.id).populate("contacts");
    let contacts = user.contacts

    if (!contacts || contacts.length == 0) {
      return res
        .status(404)
        .json({ message: "No contacts found for this user" });
    }

    return res
      .status(200)
      .json({ message: "Contacts fetched successfully", contacts });
  } catch (error) {
    console.error("Error fetching contacts:", error.message);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};


const deleteContact = async (req, res) => {
  try {
    const contactId  = req.body.id;
    const contact = await Contact.findById(contactId);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found." });
    }

    if (contact.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized to delete this contact." });
    }

    const deletedContact = await Contact.findByIdAndDelete(contactId)

    const user = await User.findById(req.user.id);
    user.contacts.pull(contactId);
    await user.save();

    res.status(200).json({ message: "Contact deleted successfully." });
  } catch (error) {
    console.error("Error deleting contact:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};


const getContactById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found." });
    }

    if (contact.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to view this contact." });
    }

    res.status(200).json({
      message: "Contact fetched successfully.",
      contact,
    });
  } catch (error) {
    console.error("Error fetching contact by ID:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};


const updateContact = async (req, res) => {
  try {
    const { id } = req.params; 
    const { firstName, lastName, phone, address, email } = req.body.formData; 

    if (!id || (!firstName && !lastName && !phone && !address && !email)) {
      return res.status(400).json({ message: "Please provide valid data to update." });
    }

    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found." });
    }

    if (contact.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to update this contact." });
    }

    if (firstName) contact.firstName = firstName;
    if (lastName) contact.lastName = lastName;
    if (phone) contact.phone = phone;
    if (address) contact.address = address;
    if (email) contact.email = email;

    const updatedContact = await contact.save();

    res.status(200).json({
      message: "Contact updated successfully.",
      contact: updatedContact,
    });
  } catch (error) {
    console.error("Error updating contact:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { addContact, getAllContacts, deleteContact, getContactById, updateContact };
