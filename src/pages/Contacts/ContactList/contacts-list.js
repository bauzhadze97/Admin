import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import withRouter from "components/Common/withRouter";
import TableContainer from "../../../components/Common/TableContainer";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  FormFeedback,
  Input,
  Form,
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import DeleteModal from "components/Common/DeleteModal";

import {
  getContacts as onGetContacts,
  addNewContact as onAddNewContact,
  updateContact as onUpdateContact,
  deleteContact as onDeleteContact,
} from "store/contacts/actions";
import { isEmpty } from "lodash";

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import Spinners from "components/Common/Spinner";
import { ToastContainer } from "react-toastify";

const ContactsList = () => {

  //meta title
  document.title = "Contacts List | Gorgia LLC";

  const dispatch = useDispatch();
  const [contact, setContact] = useState();
  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      name: (contact && contact.name) || "",
      surname: (contact && contact.surname) || "",
      id_number: (contact && contact.id_number) || "",
      mobile_number: (contact && contact.mobile_number) || "",
      email: (contact && contact.email) || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please Enter the Name"),
      surname: Yup.string().required("Please Enter the Surname"),
      id_number: Yup.string().required("Please Enter the ID Number"),
      mobile_number: Yup.string().required("Please Enter the Mobile Number"),
      email: Yup.string().matches(
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        "Please Enter Valid Email"
      ).required("Please Enter Your Email"),
    }),
    onSubmit: values => {
      if (isEdit) {
        const updateContact = {
          id: contact.id,
          name: values.name,
          surname: values.surname,
          id_number: values.id_number,
          mobile_number: values.mobile_number,
          email: values.email,
        };
        // update contact
        dispatch(onUpdateContact(updateContact));
        setIsEdit(false);
        validation.resetForm();
      } else {
        const newContact = {
          id: Math.floor(Math.random() * (30 - 20)) + 20,
          name: values["name"],
          surname: values["surname"],
          id_number: values["id_number"],
          mobile_number: values["mobile_number"],
          email: values["email"],
        };
        // save new contact
        dispatch(onAddNewContact(newContact));
        validation.resetForm();
      }
      toggle();
    },
  });

  const ContactsProperties = createSelector(
    (state) => state.contacts,
    (Contacts) => ({
      contacts: Contacts.contacts,
      loading: Contacts.loading
    })
  );

  const {
    contacts, loading
  } = useSelector(ContactsProperties);

  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setLoading] = useState(loading);

  useEffect(() => {
    if (contacts && !contacts.length) {
      dispatch(onGetContacts());
      setIsEdit(false);
    }
  }, [dispatch, contacts]);

  useEffect(() => {
    setContact(contacts);
    setIsEdit(false);
  }, [contacts]);

  useEffect(() => {
    if (!isEmpty(contacts) && !!isEdit) {
      setContact(contacts);
      setIsEdit(false);
    }
  }, [contacts]);

  const toggle = () => {
    setModal(!modal);
  };

  const handleContactClick = arg => {
    const contact = arg;

    setContact({
      id: contact.id,
      name: contact.name,
      surname: contact.surname,
      id_number: contact.id_number,
      mobile_number: contact.mobile_number,
      email: contact.email,
    });
    setIsEdit(true);

    toggle();
  };

  //delete contact
  const [deleteModal, setDeleteModal] = useState(false);

  const onClickDelete = (contacts) => {
    setContact(contacts.id);
    setDeleteModal(true);
  };

  const handleDeleteContact = () => {
    if (contact && contact.id) {
      dispatch(onDeleteContact(contact.id));
    }
    setDeleteModal(false);
  };

  const handleContactClicks = () => {
    setContact("");
    setIsEdit(false);
    toggle();
  };

  const columns = useMemo(
    () => [
      {
        header: "#",
        accessorKey: "img",
        cell: (cell) => (
          <>
            {!cell.getValue() ? (
              <div className="avatar-xs">
                <span className="avatar-title rounded-circle">{cell.row.original.name.charAt(0)} </span>
              </div>
            ) : (
              <div>
                <img className="rounded-circle avatar-xs" src={cell.getValue()} alt="" />
              </div>
            )}
          </>
        ),
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: 'Name',
        accessorKey: 'name',
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cell) => {
          return (
            <>
              <h5 className='font-size-14 mb-1'>
                <Link to='#' className='text-dark'>{cell.getValue()}</Link>
              </h5>
              <p className="text-muted mb-0">{cell.row.original.surname}</p>
            </>
          )
        }
      },
      {
        header: 'ID Number',
        accessorKey: 'id_number',
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: 'Mobile Number',
        accessorKey: 'mobile_number',
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: 'Email',
        accessorKey: 'email',
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: 'Action',
        cell: (cellProps) => {
          return (
            <div className="d-flex gap-3">
              <Link
                to="#"
                className="text-success"
                onClick={() => {
                  const contactData = cellProps.row.original;
                  handleContactClick(contactData);
                }}
              >
                <i className="mdi mdi-pencil font-size-18" id="edittooltip" />
              </Link>
              <Link
                to="#"
                className="text-danger"
                onClick={() => {
                  const contactData = cellProps.row.original; onClickDelete(contactData);
                }}>
                <i className="mdi mdi-delete font-size-18" id="deletetooltip" />
              </Link>
            </div>
          );
        }
      },
    ],
    []
  );

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteContact}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Contacts" breadcrumbItem="Contacts List" />
          <Row>
            {
              isLoading ? <Spinners setLoading={setLoading} />
                :
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
                        isAddButton={true}
                        handleUserClick={handleContactClicks}
                        buttonClass="btn btn-success btn-rounded waves-effect waves-light addContact-modal mb-2"
                        buttonName="New Contact"
                        tableClass="align-middle table-nowrap table-hover dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
                        theadClass="table-light"
                        paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
                        pagination="pagination"
                      />
                    </CardBody>
                  </Card>
                </Col>
            }

            <Modal isOpen={modal} toggle={toggle}>
              <ModalHeader toggle={toggle} tag="h4">
                {!!isEdit ? "Edit Contact" : "Add Contact"}
              </ModalHeader>
              <ModalBody>
                <Form
                  onSubmit={e => {
                    e.preventDefault();
                    validation.handleSubmit();
                    return false;
                  }}
                >
                  <Row>
                    <Col xs={12}>
                      <div className="mb-3">
                        <Label className="form-label">Name</Label>
                        <Input
                          name="name"
                          type="text"
                          placeholder="Insert Name"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.name || ""}
                          invalid={
                            validation.touched.name &&
                              validation.errors.name
                              ? true
                              : false
                          }
                        />
                        {validation.touched.name &&
                          validation.errors.name ? (
                          <FormFeedback type="invalid">
                            {validation.errors.name}
                          </FormFeedback>
                        ) : null}
                      </div>
                      <div className="mb-3">
                        <Label className="form-label">Surname</Label>
                        <Input
                          name="surname"
                          label="Surname"
                          placeholder="Insert Surname"
                          type="text"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.surname || ""}
                          invalid={
                            validation.touched.surname &&
                              validation.errors.surname
                              ? true
                              : false
                          }
                        />
                        {validation.touched.surname &&
                          validation.errors.surname ? (
                          <FormFeedback type="invalid">
                            {validation.errors.surname}
                          </FormFeedback>
                        ) : null}
                      </div>
                      <div className="mb-3">
                        <Label className="form-label">ID Number</Label>
                        <Input
                          name="id_number"
                          type="text"
                          placeholder="Insert ID Number"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.id_number || ""}
                          invalid={
                            validation.touched.id_number &&
                              validation.errors.id_number
                              ? true
                              : false
                          }
                        />
                        {validation.touched.id_number &&
                          validation.errors.id_number ? (
                          <FormFeedback type="invalid">
                            {validation.errors.id_number}
                          </FormFeedback>
                        ) : null}
                      </div>
                      <div className="mb-3">
                        <Label className="form-label">Mobile Number</Label>
                        <Input
                          name="mobile_number"
                          type="text"
                          placeholder="Insert Mobile Number"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.mobile_number || ""}
                          invalid={
                            validation.touched.mobile_number &&
                              validation.errors.mobile_number
                              ? true
                              : false
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
                        <Label className="form-label">Email</Label>
                        <Input
                          name="email"
                          label="Email"
                          type="email"
                          placeholder="Insert Email"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.email || ""}
                          invalid={
                            validation.touched.email &&
                              validation.errors.email
                              ? true
                              : false
                          }
                        />
                        {validation.touched.email &&
                          validation.errors.email ? (
                          <FormFeedback type="invalid">
                            {validation.errors.email}
                          </FormFeedback>
                        ) : null}
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <div className="text-end">
                        <button
                          type="submit"
                          className="btn btn-success save-user"
                        >
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

export default withRouter(ContactsList);
