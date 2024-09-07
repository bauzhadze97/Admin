import React, { useEffect, useState, useMemo } from "react";
import { Card, CardBody, Col, Container, Row, Modal, ModalHeader, ModalBody, Label, FormFeedback, Input, Form, Button } from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";

// Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import DeleteModal from "components/Common/DeleteModal";
import TableContainer from "../../../components/Common/TableContainer";
import Spinners from "components/Common/Spinner";
import { ToastContainer } from "react-toastify";

// Import contact services
import { getContactList, createContact, updateContact, deleteContact } from "services/contactService";

const ContactsList = () => {
  document.title = "Contact List | React Admin Dashboard";

  const [contacts, setContacts] = useState([]);
  const [contact, setContact] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setIsLoading(true);
    try {
      const response = await getContactList();
      setContacts(response);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: (contact && contact.name) || "",
      surname: (contact && contact.surname) || "",
      id_number: (contact && contact.id_number) || "",
      mobile_number: (contact && contact.mobile_number) || "",
      email: (contact && contact.email) || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please enter the contact's name"),
      surname: Yup.string().required("Please enter the contact's surname"),
      id_number: Yup.string().required("Please enter ID number"),
      mobile_number: Yup.string().required("Please enter mobile number"),
      email: Yup.string().email("Invalid email").required("Please enter email"),
    }),
    onSubmit: async (values) => {
      try {
        if (isEdit) {
          await updateContact(contact.id, values);
        } else {
          await createContact(values);
        }
        fetchContacts();
        toggleModal();
      } catch (error) {
        console.error("Error creating/updating contact:", error);
      }
    },
  });

  const toggleModal = () => {
    setModal(!modal);
  };

  // Edit handler
  const handleUserClick = (user, event) => {
    event.preventDefault(); // Prevent default navigation behavior
    setContact(user);
    setIsEdit(true);
    toggleModal();
  };

  // Add handler
  const handleUserClicks = (event) => {
    event.preventDefault(); // Prevent default navigation behavior
    setContact(null);
    setIsEdit(false);
    toggleModal();
  };

  // Delete handler
  const handleDeleteClick = (user, event) => {
    event.preventDefault(); // Prevent default navigation behavior
    setContact(user);
    setDeleteModal(true);
  };

  const handleDeleteUser = async () => {
    try {
      if (contact && contact.id) {
        await deleteContact(contact.id);
        fetchContacts();
      }
      setDeleteModal(false);
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  const columns = useMemo(
    () => [
      {
        header: "#",
        accessorKey: "id",  // Ensure unique key
        cell: (cell) => (
          <>
            <div className="avatar-xs">
              <span className="avatar-title rounded-circle">{cell.row.original.name.charAt(0)}</span>
            </div>
          </>
        ),
      },
      {
        header: "Name",
        accessorKey: "name",
        cell: (cell) => (
          <>
            <h5 className="font-size-14 mb-1">
              <span className="text-dark">{cell.getValue()}</span>
            </h5>
            <p className="text-muted mb-0">{cell.row.original.surname}</p>
          </>
        ),
      },
      {
        header: "Email",
        accessorKey: "email",
      },
      {
        header: "Mobile Number",
        accessorKey: "mobile_number",
      },
      {
        header: "Actions",
        cell: (cellProps) => (
          <div className="d-flex gap-3">
            <button
              className="btn btn-success"
              onClick={(e) => handleUserClick(cellProps.row.original, e)}  // Edit handler with preventDefault
            >
              <i className="mdi mdi-pencil font-size-18" />
            </button>
            <button
              className="btn btn-danger"
              onClick={(e) => handleDeleteClick(cellProps.row.original, e)}  // Delete handler with preventDefault
            >
              <i className="mdi mdi-delete font-size-18" />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteUser}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Contacts" breadcrumbItem="User List" />

          {/* Add Contact Button */}
          <Row>
            <Col>
              <Button
                color="success"
                className="btn btn-rounded waves-effect waves-light mb-2"
                onClick={handleUserClicks}  // Manually trigger modal for adding contact with preventDefault
              >
                Add Contact
              </Button>
            </Col>
          </Row>

          <Row>
            {isLoading ? (
              <Spinners setLoading={setIsLoading} />
            ) : (
              <Col lg="12">
                <Card>
                  <CardBody>
                    <TableContainer
                      columns={columns}
                      data={contacts || []}
                      isGlobalFilter={true}
                      isPagination={true}
                      SearchPlaceholder="Search..."
                      isCustomPageSize={true}
                      tableClass="align-middle table-nowrap table-hover dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
                      theadClass="table-light"
                      paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
                      pagination="pagination"
                    />
                  </CardBody>
                </Card>
              </Col>
            )}

            {/* Add/Edit Modal */}
            <Modal isOpen={modal} toggle={toggleModal}>
              <ModalHeader toggle={toggleModal} tag="h4">
                {isEdit ? "Edit Contact" : "Add Contact"}
              </ModalHeader>
              <ModalBody>
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    validation.handleSubmit();
                  }}
                >
                  <Row>
                    <Col xs={12}>
                      <div className="mb-3">
                        <Label className="form-label">Name</Label>
                        <Input
                          name="name"
                          type="text"
                          placeholder="Enter Name"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.name || ""}
                          invalid={
                            validation.touched.name &&
                            validation.errors.name
                          }
                        />
                        {validation.touched.name && validation.errors.name ? (
                          <FormFeedback type="invalid">
                            {validation.errors.name}
                          </FormFeedback>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <Label className="form-label">Surname</Label>
                        <Input
                          name="surname"
                          type="text"
                          placeholder="Enter Surname"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.surname || ""}
                          invalid={
                            validation.touched.surname &&
                            validation.errors.surname
                          }
                        />
                        {validation.touched.surname && validation.errors.surname ? (
                          <FormFeedback type="invalid">
                            {validation.errors.surname}
                          </FormFeedback>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <Label className="form-label">Email</Label>
                        <Input
                          name="email"
                          type="email"
                          placeholder="Enter Email"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.email || ""}
                          invalid={
                            validation.touched.email &&
                            validation.errors.email
                          }
                        />
                        {validation.touched.email && validation.errors.email ? (
                          <FormFeedback type="invalid">
                            {validation.errors.email}
                          </FormFeedback>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <Label className="form-label">Mobile Number</Label>
                        <Input
                          name="mobile_number"
                          type="text"
                          placeholder="Enter Mobile Number"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.mobile_number || ""}
                          invalid={
                            validation.touched.mobile_number &&
                            validation.errors.mobile_number
                          }
                        />
                        {validation.touched.mobile_number &&
                          validation.errors.mobile_number ? (
                          <FormFeedback type="invalid">
                            {validation.errors.mobile_number}
                          </FormFeedback>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <Label className="form-label">ID Number</Label>
                        <Input
                          name="id_number"
                          type="text"
                          placeholder="Enter ID Number"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.id_number || ""}
                          invalid={
                            validation.touched.id_number &&
                            validation.errors.id_number
                          }
                        />
                        {validation.touched.id_number &&
                          validation.errors.id_number ? (
                          <FormFeedback type="invalid">
                            {validation.errors.id_number}
                          </FormFeedback>
                        ) : null}
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <div className="text-end">
                        <button type="submit" className="btn btn-success save-user">
                          Save
                        </button>
                      </div>
                    </Col>
                  </Row>
                </Form>
              </ModalBody>
            </Modal>
          </Row>
        </Container>
      </div>
      <ToastContainer />
    </React.Fragment>
  );
};

export default ContactsList;
