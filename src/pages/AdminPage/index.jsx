import React, { useEffect, useState, useMemo } from "react";
import { useTable, usePagination, useSortBy } from "react-table";
import { FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import {
  Breadcrumbs,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
} from "@mui/material";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import {
  getDepartments,
  getUsers,
  deleteUser,
 
} from "../../services/admin/department";

export default function AdminPage() {
  const { t } = useTranslation();
  const queryParams = new URLSearchParams(location.search);
  const initialActiveSide = queryParams.get("activeSide") || "departments";
  const navigate = useNavigate();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeSide, setActiveSide] = useState(initialActiveSide);
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [offices, setOffices] = useState(["Office1", "Office2", "Office3"]); 

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await getDepartments();
        setDepartments(res.data.departments);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchUsers = async () => {
      try {
        const res = await getUsers();
        setUsers(res.data.users);
        setFilteredUsers(res.data.users);
      } catch (err) {
        console.log(err);
      }
    };

    fetchDepartments();
    fetchUsers();
  }, []);

  const handleSearchChange = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
    );
    setFilteredUsers(filtered);
  };

  const handleSideChange = (side) => {
    setActiveSide(side);
    navigate(`?activeSide=${side}`);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedUser(null);
    setEditModalOpen(false);
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    const updatedUserData = {
      name: event.target.name.value,
      sur_name: event.target.sur_name.value,
      email: event.target.email.value,
      mobile_number: event.target.mobile_number.value,
      office: event.target.office.value,
      position: event.target.position.value,
      location: event.target.location.value,
    };

    try {
      await updateUser(selectedUser.id, updatedUserData);
      toast.success(t("მომხმარებელი წარმატებით განახლდა!"));
      closeEditModal();
      // Optionally reload to fetch updated data
      const res = await getUsers();
      setUsers(res.data.users);
      setFilteredUsers(res.data.users);
    } catch (err) {
      console.error(err);
      toast.error(t("მოხდა შეცდომა მომხმარებლის განახლებისას!"));
    }
  };

  const columnsForUsers = useMemo(
    () => [
      { Header: t("სახელი"), accessor: "name" },
      { Header: t("გვარი"), accessor: "sur_name" },
      { Header: t("ელ.ფოსტა"), accessor: "email" },
      { Header: t("მობილური"), accessor: "mobile_number" },
      { Header: t("დეპარტამენტი"), accessor: "department.name" },
      { Header: t("პოზიცია"), accessor: "position" },
      { Header: t("ადგილმდებარეობა"), accessor: "location" },
      { Header: t("როლი"), accessor: "type" },
      {
        Header: t("მოქმედება"),
        Cell: ({ row }) => (
          <div className="d-flex gap-2">
            <Button
              variant="contained"
              color="success"
              onClick={() => openEditModal(row.original)}
            >
              {t("რედაქტირება")}
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleDeleteUser(row.original)}
            >
              {t("წაშლა")}
            </Button>
          </div>
        ),
      },
    ],
    [t]
  );

  const tableInstanceForUsers = useTable(
    { columns: columnsForUsers, data: filteredUsers, initialState: { pageSize: 10 } },
    useSortBy,
    usePagination
  );

  const renderTable = (tableInstance) => {
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      page,
      prepareRow,
      canPreviousPage,
      canNextPage,
      previousPage,
      nextPage,
      state: { pageIndex },
    } = tableInstance;

    return (
      <>
        <table {...getTableProps()} className="table table-hover table-bordered table-striped">
          <thead>
            {headerGroups.map((headerGroup, headerGroupIndex) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={headerGroupIndex}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    key={column.id || column.accessor}
                  >
                    {column.render("Header")}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " 🔽"
                          : " 🔼"
                        : ""}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, rowIndex) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={rowIndex}>
                  {row.cells.map((cell, cellIndex) => (
                    <td {...cell.getCellProps()} key={cellIndex}>
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="pagination">
          <Button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          >
            {"<"}
          </Button>
          <span>
            {t("გვერდი")} {pageIndex + 1}
          </span>
          <Button
            onClick={() => nextPage()}
            disabled={!canNextPage}
          >
            {">"}
          </Button>
        </div>
      </>
    );
  };

  return (
    <div className="page-content">
      <div className="container-fluid">
        <Breadcrumbs title="ადმინისტრაცია" breadcrumbItem="ყოველდღიური ანგარიში" />
        <div className="flex">
          <div className="flex flex-col bg-[#d1e1e8] bg-opacity-[.8] h-[100vh] text-[#fff] p-8">
            <Link
              to="https://crm.gorgia.ge/profile"
              className="p-2 bg-[#2bc0ff] text-center rounded-lg w-[160px] mb-3"
            >
              crm.gorgia.ge
            </Link>
            <Button
              variant="contained"
              className={`mb-3 ${activeSide === "departments" ? "bg-[#018AD1]" : "bg-[#2bc0ff]"}`}
              onClick={() => handleSideChange("departments")}
            >
              {t("დეპარტამენტები")}
            </Button>
            <Button
              variant="contained"
              className={`mb-3 ${activeSide === "users" ? "bg-[#018AD1]" : "bg-[#2bc0ff]"}`}
              onClick={() => handleSideChange("users")}
            >
              {t("მომხმარებლები")}
            </Button>
          </div>

          <div className="bg-[#e1f0f7] bg-opacity-[.6] w-[100%] p-8">
            {activeSide === "users" && (
              <>
                <TextField
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder={t("სახელის, გვარის ან ელ. ფოსტის ძიება")}
                  fullWidth
                  margin="normal"
                />
                {renderTable(tableInstanceForUsers)}
              </>
            )}
          </div>
        </div>

        {/* Edit User Modal */}
        <Dialog open={editModalOpen} onClose={closeEditModal} fullWidth maxWidth="sm">
          <DialogTitle>
            {t("მომხმარებლის რედაქტირება")}
          </DialogTitle>
          <DialogContent>
            <form onSubmit={handleEditSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label={t("სახელი")}
                    name="name"
                    defaultValue={selectedUser?.name}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label={t("გვარი")}
                    name="sur_name"
                    defaultValue={selectedUser?.sur_name}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label={t("ელ. ფოსტა")}
                    name="email"
                    defaultValue={selectedUser?.email}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label={t("მობილური")}
                    name="mobile_number"
                    defaultValue={selectedUser?.mobile_number}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>{t("ფილიალი")}</InputLabel>
                    <Select
                      name="office"
                      defaultValue={selectedUser?.office}
                    >
                      {offices.map((office, index) => (
                        <MenuItem value={office} key={index}>
                          {office}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label={t("პოზიცია")}
                    name="position"
                    defaultValue={selectedUser?.position}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label={t("ადგილი")}
                    name="location"
                    defaultValue={selectedUser?.location}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
              </Grid>
              <DialogActions>
                <Button onClick={closeEditModal} color="secondary">
                  {t("გაუქმება")}
                </Button>
                <Button type="submit" color="primary">
                  {t("შენახვა")}
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
