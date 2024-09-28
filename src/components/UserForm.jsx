import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, Button, Form, Label, Input } from "reactstrap";

const UserForm = ({ isOpen, toggle, isEditMode, user, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    position: "",
    location: "",
    working_start_date: "",
    date_of_birth: "",
    mobile_number: "",
    status: "active", // default status
    profile_image: null, // for handling profile image upload
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user?.name || "",
        email: user.email || "",
        department: user.department ? user.department.name : "",
        position: user.position || "",
        location: user.location || "",
        working_start_date: user.working_start_date || "",
        date_of_birth: user.date_of_birth || "",
        mobile_number: user.mobile_number || "",
        status: user.status || "active",
        profile_image: null, // Reset on editing; handle image separately
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      profile_image: e.target.files[0], // handle file input for image
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData); // Call the onSave function from the parent component
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        {isEditMode ? "Edit User" : "Add User"}
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <Label for="name">Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <Label for="email" className="mt-3">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <Label for="department" className="mt-3">Department</Label>
          <Input
            type="text"
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            
          />

          <Label for="position" className="mt-3">Position</Label>
          <Input
            type="text"
            id="position"
            name="position"
            value={formData.position}
            onChange={handleChange}
          />

          <Label for="location" className="mt-3">Location</Label>
          <Input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />

          <Label for="working_start_date" className="mt-3">Working Start Date</Label>
          <Input
            type="date"
            id="working_start_date"
            name="working_start_date"
            value={formData.working_start_date}
            onChange={handleChange}
          />

          <Label for="date_of_birth" className="mt-3">Date of Birth</Label>
          <Input
            type="date"
            id="date_of_birth"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
          />

          <Label for="mobile_number" className="mt-3">Mobile Number</Label>
          <Input
            type="text"
            id="mobile_number"
            name="mobile_number"
            value={formData.mobile_number}
            onChange={handleChange}
          />

          {/* <Label for="status" className="mt-3">Status</Label>
          <Input
            type="select"
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Input> */}

          <Label for="profile_image" className="mt-3">Profile Image</Label>
          <Input
            type="file"
            id="profile_image"
            name="profile_image"
            onChange={handleFileChange}
          />

          <Button color="success" type="submit" className="mt-3">
            {isEditMode ? "Update User" : "Add User"}
          </Button>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default UserForm;
