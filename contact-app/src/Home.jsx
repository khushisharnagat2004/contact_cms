import React, { useContext, useEffect, useState } from 'react';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import './App.css';
import { FaPlusCircle } from "react-icons/fa";
import { AuthContext } from './context/authContext';
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

const Home = () => {
  const [contacts, setContacts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentContact, setCurrentContact] = useState({ _id: '', name: '', address: '', phoneNo: '' });
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  // const api_url="http://localhost:4000";
   const api_url="https://contact-cms-backend.onrender.com";


  useEffect(() => {
    getContacts();
  }, []);

  const getContacts = async () => {
    try {
//      const response = await fetch('http://localhost:4000/api/contact');
      const response = await fetch(api_url +'/api/contact');

      const data = await response.json();
      setContacts(data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentContact({ ...currentContact, [name]: value });
  };

  const handleAddOrUpdateContact = async (e) => {
    e.preventDefault();

    const contactData = isEditing ? currentContact : { ...currentContact, _id: undefined };

    try {
      const method = isEditing ? 'PUT' : 'POST';
      // const url = isEditing
      //   ? `http://localhost:4000/api/contact/${currentContact._id}`
      //   : 'http://localhost:4000/api/contact';
        const url = isEditing
        ? `${api_url}/api/contact/${currentContact._id}`
        : api_url+'/api/contact';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData),
      });

      if (response.ok) {
        toast.success(isEditing ? 'Contact updated successfully!' : 'Contact added successfully!');
        getContacts();
        setShowModal(false);
        setIsEditing(false);
        setCurrentContact({ _id: '', name: '', address: '', phoneNo: '' }); // Reset form
      } else {
        toast.error('Failed to process contact!');
      }
    } catch (error) {
      console.error('Error processing contact:', error);
      toast.error('Error occurred while processing contact!');
    }
  };

  const handleEdit = (contact) => {
    setCurrentContact(contact);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      //const response = await fetch(`http://localhost:4000/api/contact/${id}`, { method: 'DELETE' });
      const response = await fetch(`${api_url}/api/contact/${id}`, { method: 'DELETE' });

      if (response.ok) {
        toast.success('Contact deleted successfully!');
        setContacts(contacts.filter((contact) => contact._id !== id));
      } else {
        toast.error('Failed to delete contact!');
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast.error('Error occurred while deleting contact!');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <div className='container'>
      <div className="row py-4">
        <div className="col-md-12 d-flex">
          <button className='btn btn-dark ms-auto' onClick={handleLogout}>Logout</button>
        </div>
      </div>
      <header id="header" className='py-4 d-flex'>
        <h2>Contacts</h2>
        <button className='btn btn-primary ms-auto' onClick={() => { setShowModal(true); setIsEditing(false); }}>Add Contact <FaPlusCircle /></button>
      </header>
      <table className="table table-striped mt-4">
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.length > 0 ? (
            contacts.map((contact) => (
              <tr key={contact._id}>
                <td>{contact.name}</td>
                <td>{contact.address}</td>
                <td>{contact.phoneNo}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(contact)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(contact._id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">No contacts found.</td>
            </tr>
          )}
        </tbody>
      </table>
      {showModal && (
        <div className="modal" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{isEditing ? 'Edit Contact' : 'Add Contact'}</h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleAddOrUpdateContact}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={currentContact.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      name="address"
                      value={currentContact.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input
                      type="text"
                      className="form-control"
                      name="phoneNo"
                      value={currentContact.phoneNo}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {isEditing ? 'Update Contact' : 'Add Contact'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default Home;
