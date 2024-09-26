import React, { useEffect, useState, useMemo } from "react";
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
  Input,
  Button,
  Form,
} from "reactstrap";
import { FaTrash, FaPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import {
  Breadcrumbs,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useTranslation } from "react-i18next";
import { toast } from 'react-toastify';
import {
  assignHead,
  createDepartment,
  deleteDepartment,
  getDepartments,
  getUsers,
  deleteUser,
} from "../../services/admin/department";

const AdminPage = () => {
  const { t } = useTranslation();
  const queryParams = new URLSearchParams(location.search);
  const initialActiveSide = queryParams.get("activeSide") || "departments";
  const navigate = useNavigate();

  const [modal, setModal] = useState(false);
  const [isAddDepartmentModal, setIsAddDepartmentModal] = useState(false);
  const [activeSide, setActiveSide] = useState(initialActiveSide);
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [chosenDepartment, setChosenDepartment] = useState(null);
  const [searchedUsers, setSearchedUsers] = useState(users);

  useEffect(() => {
    fetchDepartments();
    fetchUsers();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await getDepartments();
      setDepartments(res.data.departments);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data.users);
      setFilteredUsers(res.data.users);
      setSearchedUsers(res.data.users);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearchChange = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);

    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)
    );
    setFilteredUsers(filtered);
  };

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    try {
      const res = await createDepartment({
        name: e.target.name.value,
        type: e.target.type.value,
        status: "active",
      });
      if (res) {
        fetchDepartments();
        setModal(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const confirmDelete = async (depId, name) => {
    if (window.confirm(`${t("are_you_sure_you_want_to_delete")} ${name}?`)) {
      try {
        const res = await deleteDepartment({ id: depId });
        if (res) {
          fetchDepartments();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDeleteUser = async (user) => {
    if (window.confirm(`${t("დარწმუნებული ხართ რომ გსურთ იუზერ")} ${user.name}-ის წაშლა?`)) {
      try {
        const res = await deleteUser(user.id);
        if (res) {
          fetchUsers();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const openAssignHeadModal = (department) => {
    setChosenDepartment(department);
    setIsAddDepartmentModal(false);
    setModal(true);
  };

  const handleAssignHead = async (e) => {
    e.preventDefault();
    try {
      const res = await assignHead({
        user_id: e.target.user_id.value,
        department_id: chosenDepartment.id,
      });
      if (res) {
        toast.success(t("successfully_assigned"));
        setModal(false);
        fetchDepartments();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSideChange = (side) => {
    setActiveSide(side);
    navigate(`?activeSide=${side}`);
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="Admin" breadcrumbItem="Dashboard" />
        <Col>
        <Col lg="2" className="sidebar">
          <div className="d-flex  gap-3 mb-3">
            <Button
              color={activeSide === "departments" ? "primary" : "secondary"}
              onClick={() => handleSideChange("departments")}
            >
              {t("departments")}
            </Button>
            <Button
              color={activeSide === "users" ? "primary" : "secondary"}
              onClick={() => handleSideChange("users")}
            >
              {t("users")}
            </Button>
          </div>
        </Col>

          <Col >
            {activeSide === "departments" && (
              <>
                <Card>
                  <CardBody>
                    <Button
                      color="success"
                      className="mb-3"
                      onClick={() => setModal(true)}
                    >
                      {t("add_department")}
                    </Button>
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>{t("department_name")}</th>
                          <th>{t("department_head")}</th>
                          <th>{t("action")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {departments.map((dep, index) => (
                          <tr key={dep.id}>
                            <td>{index + 1}</td>
                            <td>{dep.name}</td>
                            <td>{dep.head ? dep.head.name : "N/A"}</td>
                            <td>
                              <Button
                                color="primary"
                                size="sm"
                                onClick={() => openAssignHeadModal(dep)}
                              >
                                <FaPlus />
                              </Button>
                              <Button
                                color="danger"
                                size="sm"
                                onClick={() => confirmDelete(dep.id, dep.name)}
                              >
                                <FaTrash />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardBody>
                </Card>

                {/* Modal for assigning head */}
                <Modal isOpen={modal} toggle={() => setModal(!modal)}>
                  <ModalHeader toggle={() => setModal(!modal)}>
                    {isAddDepartmentModal ? t("add_department") : t("assign_head_to")} {chosenDepartment?.name}
                  </ModalHeader>
                  <ModalBody>
                    {isAddDepartmentModal ? (
                      <Form onSubmit={handleAddDepartment}>
                        <Label>{t("department_name")}</Label>
                        <Input type="text" name="name" required />
                        <Label>{t("is_it_purchase_department")}</Label>
                        <Input type="select" name="type">
                          <option value="department">{t("no")}</option>
                          <option value="purchase_head">{t("yes")}</option>
                        </Input>
                        <Button type="submit" color="success" className="mt-3">
                          {t("add")}
                        </Button>
                      </Form>
                    ) : (
                      <Form onSubmit={handleAssignHead}>
                        <Label>{t("search_user")}</Label>
                        <Input
                          type="text"
                          value={searchTerm}
                          onChange={handleSearchChange}
                        />
                        <Input type="hidden" name="department_id" value={chosenDepartment?.id} />
                        <Label>{t("choose_head")}</Label>
                        <Input type="select" name="user_id">
                          {filteredUsers.map((user) => (
                            <option key={user.id} value={user.id}>
                              {user.name} - {user.email}
                            </option>
                          ))}
                        </Input>
                        <Button type="submit" color="success" className="mt-3">
                          {t("assign")}
                        </Button>
                      </Form>
                    )}
                  </ModalBody>
                </Modal>
              </>
            )}

            {activeSide === "users" && (
              <Card>
                <CardBody>
                  <Input
                    type="text"
                    placeholder={t("search_by_name_or_email")}
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="mb-3"
                  />
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>{t("name")}</th>
                        <th>{t("email")}</th>
                        <th>{t("department")}</th>
                        <th>{t("action")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {searchedUsers.map((user) => (
                        <tr key={user.id}>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>{user.department ? user.department.name : "N/A"}</td>
                          <td>
                            <Button
                              color="danger"
                              size="sm"
                              onClick={() => handleDeleteUser(user)}
                            >
                              <FaTrash />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardBody>
              </Card>
            )}
          </Col>
          </Col>
      </Container>
    </div>
  );
};

export default AdminPage;
