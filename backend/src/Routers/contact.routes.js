const express = require('express');
const router = express.Router();
const contactController = require('../Controllers/contact.controller');
const { authenticate } = require('../middlewares/auth'); 

router.post('/addcontact', authenticate, contactController.addContact);
router.post('/getcontact', authenticate, contactController.getAllContacts);
router.post('/delete', authenticate, contactController.deleteContact);
router.post('/:id', authenticate, contactController.getContactById);
router.put('/updatecontact/:id', authenticate, contactController.updateContact);

module.exports = router;