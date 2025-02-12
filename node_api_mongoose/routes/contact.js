const express=require('express');
const router=express.Router();
const {createContact,getContacts,getContact,updateContact,deleteContact}=require('../controller/contactController');



router.post('/',createContact).get('/',getContacts);

router.get('/:id',getContact);
router.put('/:id',updateContact);
router.delete('/:id',deleteContact);


module.exports=router;