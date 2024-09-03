import React, { Fragment, useEffect, useMemo, useState } from "react";
import '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import * as Yup from "yup";
import { useFormik } from "formik";

// Import components
import Breadcrumbs from '../../../components/Common/Breadcrumb';
import DeleteModal from '../../../components/Common/DeleteModal';

// Import task services
import { getTaskList, createTask, updateTask, deleteTask } from "../../../services/tasks";

import {
    Col,
    Row,
    UncontrolledTooltip,
    Modal,
    ModalHeader,
    ModalBody,
    Form,
    Input,
    FormFeedback,
    Label,
    Card,
    CardBody,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Badge,
    Button,
    Table,
} from "reactstrap";
import Spinners from "components/Common/Spinner";
import { ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel, flexRender } from '@tanstack/react-table';

const TaskList = () => {

    // Meta title
    document.title = "Tasks List | Gorgia LLC";

    const [modal, setModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [task, setTask] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Fetch tasks function
    const fetchTasks = async () => {
        setLoading(true);
        try {
            console.log("Fetching tasks...");  // Debugging line
            const response = await getTaskList();

            console.log("respnse", response);
            
            console.log("Tasks fetched successfully:", response.data);  // Debugging line
            setTasks(response|| []);  // Ensure it's always an array
        } catch (error) {
            console.error("Error fetching tasks:", error);
        } finally {
            setLoading(false);
        }
    };

    

    // Fetch tasks on component mount
    useEffect(() => {
        fetchTasks();
        console.log('Fetched tasks:', tasks); // Add this line to see the tasks after fetching
    }, []);

    // Form validation
    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {
            task_id: (task && task.task_id) || '',
            task_title: (task && task.task_title) || '',
            description: (task && task.description) || '',
            assigned_to: (task && task.assigned_to) || '',
            due_date: (task && task.due_date) || '',
            priority: (task && task.priority) || 'Medium',
            status: (task && task.status) || 'Pending',
        },
        validationSchema: Yup.object({
            task_title: Yup.string().required("Please Enter Your Task Title"),
            description: Yup.string().required("Please Enter Your Description"),
            assigned_to: Yup.string().required("Please Enter Assignee"),
            due_date: Yup.date().required("Please Enter Due Date"),
            priority: Yup.string().required("Please Enter Priority"),
            status: Yup.string().required("Please Enter Status"),
        }),
        onSubmit: async (values) => {
            try {
                if (isEdit) {
                    // Update task
                    await updateTask(task.id, values);
                    console.log("Task updated successfully:", values);
                } else {
                    // Create new task
                    await createTask(values);
                    console.log("New task created successfully:", values);
                }
                validation.resetForm();
                toggle();
                fetchTasks(); // Refresh tasks after submit
            } catch (error) {
                console.error("Error submitting form:", error);
            }
        },
    });

    // Toggle modal visibility
    const toggle = () => {
        setModal(!modal);
        if (!modal) {
            setTask(null);
            setIsEdit(false);
        }
    };

    // Handle task click for edit
    const handleTaskClick = task => {
        setTask(task);
        setIsEdit(true);
        toggle();
    };

    // Handle delete task
    const onClickDelete = (task) => {
        setTask(task);
        setDeleteModal(true);
    };

    const handleDeleteTask = async () => {
        try {
            if (task && task.id) {
                await deleteTask(task.id);
                console.log("Task deleted successfully");
                fetchTasks();
            }
            setDeleteModal(false);
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    // Define table columns
    const columns = useMemo(
        () => [
            {
                header: 'No',
                accessorKey: "id",
                cell: (cellProps) => {
                    return <Link to={`/it-tasks/${cellProps.row.original.id}`} className="text-body fw-bold">{cellProps.row.original.id}</Link>
                }
            },
            {
                header: "Task Title",
                accessorKey: "task_title",
            },
            {
                header: 'Description',
                accessorKey: "description",
            },
            {
                header: 'Assigned To',
                accessorKey: "assigned_to"
            },
            {
                header: 'Due Date',
                accessorKey: "due_date"
            },
            {
                header: "Priority",
                accessorKey: "priority",
                cell: (cellProps) => {
                    switch (cellProps.row.original.priority) {
                        case "High":
                            return <Badge className="bg-danger">High</Badge>;
                        case "Medium":
                            return <Badge className="bg-warning">Medium</Badge>;
                        case "Low":
                            return <Badge className="bg-success">Low</Badge>;
                        default:
                            return <Badge className="bg-secondary">Unknown</Badge>;
                    }
                },
            },
            {
                header: 'Status',
                accessorKey: "status",
                cell: (cellProps) => {
                    switch (cellProps.row.original.status) {
                        case "Pending":
                            return <Badge className="bg-warning">Pending</Badge>
                        case "In Progress":
                            return <Badge className="bg-info">In Progress</Badge>
                        case "Completed":
                            return <Badge className="bg-success">Completed</Badge>
                        case "Cancelled":
                            return <Badge className="bg-danger">Cancelled</Badge>
                        default:
                            return <Badge className="bg-secondary">Unknown</Badge>;
                    }
                }
            },
            {
                header: 'Action',
                cell: (cellProps) => {
                    return (
                        <ul className="list-unstyled hstack gap-1 mb-0">
                            <li data-bs-toggle="tooltip" data-bs-placement="top" title="Edit">
                                <Link
                                    to='#'
                                    className="btn btn-sm btn-soft-info"
                                    onClick={() => handleTaskClick(cellProps.row.original)}
                                >
                                    <i className="mdi mdi-pencil-outline" />
                                </Link>
                            </li>
                            <li data-bs-toggle="tooltip" data-bs-placement="top" title="Delete">
                                <Link
                                    to="#"
                                    className="btn btn-sm btn-soft-danger"
                                    onClick={() => onClickDelete(cellProps.row.original)}
                                >
                                    <i className="mdi mdi-delete-outline" />
                                </Link>
                            </li>
                        </ul>
                    );
                }
            },
        ],
        []
    );

    // Calculate total pages
    const totalPages = Math.ceil(tasks.length / itemsPerPage);

    // Handle page click
    const handlePageClick = (page) => {
        if (page !== currentPage) {
            setCurrentPage(page);
        }
    };

    // Handle previous page click
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Handle next page click
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <React.Fragment>
            <DeleteModal
                show={deleteModal}
                onDeleteClick={handleDeleteTask}
                onCloseClick={() => setDeleteModal(false)}
            />
            <div className="page-content">
                <div className="container-fluid">
                    <Breadcrumbs title="Tasks" breadcrumbItem="Tasks Lists" />
                    {
                        isLoading ? <Spinners setLoading={setLoading} />
                            :
                            <Row>
                                <Col lg="12">
                                    <Card>
                                        <CardBody className="border-bottom">
                                            <div className="d-flex align-items-center">
                                                <h5 className="mb-0 card-title flex-grow-1">Tasks List</h5>
                                                <div className="flex-shrink-0">
                                                    <Link to="#!" onClick={() => setModal(true)} className="btn btn-primary me-1">Add New Task</Link>
                                                    <Link to="#!" className="btn btn-light me-1"><i className="mdi mdi-refresh"></i></Link>
                                                    <UncontrolledDropdown className="dropdown d-inline-block me-1">
                                                        <DropdownToggle type="menu" className="btn btn-success" id="dropdownMenuButton1">
                                                            <i className="mdi mdi-dots-vertical"></i></DropdownToggle>
                                                        <DropdownMenu>
                                                            <li><DropdownItem href="#">Action</DropdownItem></li>
                                                            <li><DropdownItem href="#">Another action</DropdownItem></li>
                                                            <li><DropdownItem href="#">Something else here</DropdownItem></li>
                                                        </DropdownMenu>
                                                    </UncontrolledDropdown>
                                                </div>
                                            </div>
                                        </CardBody>
                                        <CardBody>
    {tasks.length > 0 ? (
        <Fragment>
            <div className="table-responsive">
                <Table hover className="table-nowrap">
                    <thead className="thead-light">
                        <tr>
                            {columns.map((column, index) => (
                                <th key={column.accessorKey || index}>
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((task) => (
                            <tr key={task.id}>
                                {columns.map((column) => (
                                    <td key={`${task.id}-${column.accessorKey}`}>
                                        {column.cell ? column.cell({ row: { original: task } }) : task[column.accessorKey]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            {totalPages > 1 && (
                <Row className="justify-content-between align-items-center mt-3">
                    <Col sm={12} md={5}>
                        <div className="text-muted">
                            Page {currentPage} of {totalPages}
                        </div>
                    </Col>
                    <Col sm={12} md={7}>
                        <ul className="pagination">
                            <li className={`page-item ${currentPage <= 1 ? "disabled" : ''}`}>
                                <Link className="page-link" to="#" onClick={handlePreviousPage}>
                                    <i className="mdi mdi-chevron-left"></i>
                                </Link>
                            </li>
                            {[...Array(totalPages).keys()].map((page) => (
                                <li
                                    key={page + 1}
                                    className={`page-item ${currentPage === page + 1 ? "active" : ""}`}
                                >
                                    <Link
                                        className="page-link"
                                        to="#"
                                        onClick={() => handlePageClick(page + 1)}
                                    >
                                        {page + 1}
                                    </Link>
                                </li>
                            ))}
                            <li className={`page-item ${currentPage >= totalPages ? "disabled" : ''}`}>
                                <Link className="page-link" to="#" onClick={handleNextPage}>
                                    <i className="mdi mdi-chevron-right"></i>
                                </Link>
                            </li>
                        </ul>
                    </Col>
                </Row>
            )}
        </Fragment>
    ) : (
        <div>No tasks available.</div> // Display a message if there are no tasks
    )}
</CardBody>

                                    </Card>
                                </Col>
                            </Row>
                    }
                    <Modal isOpen={modal} toggle={toggle}>
                        <ModalHeader toggle={toggle} tag="h4">
                            {!!isEdit ? "Edit Task" : "Add Task"}
                        </ModalHeader>
                        <ModalBody>
                            <Form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    validation.handleSubmit();
                                    return false;
                                }}
                            >
                                <Row>
                                    <Col className="col-12">
                                  
                                        <div className="mb-3">
                                            <Label>Task Title</Label>
                                            <Input
                                                name="task_title"
                                                type="text"
                                                placeholder="Insert Task Title"
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.task_title || ""}
                                                invalid={
                                                    validation.touched.task_title && validation.errors.task_title ? true : false
                                                }
                                            />
                                            {validation.touched.task_title && validation.errors.task_title ? (
                                                <FormFeedback type="invalid">{validation.errors.task_title}</FormFeedback>
                                            ) : null}
                                        </div>
                                        <div className="mb-3">
                                            <Label>Description</Label>
                                            <Input
                                                name="description"
                                                type="textarea"
                                                placeholder="Insert Description"
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.description || ""}
                                                invalid={
                                                    validation.touched.description && validation.errors.description ? true : false
                                                }
                                            />
                                            {validation.touched.description && validation.errors.description ? (
                                                <FormFeedback type="invalid">{validation.errors.description}</FormFeedback>
                                            ) : null}
                                        </div>
                                        <div className="mb-3">
                                            <Label>Assigned To</Label>
                                            <Input
                                                name="assigned_to"
                                                type="text"
                                                placeholder="Assigned To"
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.assigned_to || ""}
                                                invalid={
                                                    validation.touched.assigned_to && validation.errors.assigned_to ? true : false
                                                }
                                            />
                                            {validation.touched.assigned_to && validation.errors.assigned_to ? (
                                                <FormFeedback type="invalid">{validation.errors.assigned_to}</FormFeedback>
                                            ) : null}
                                        </div>
                                        <div className="mb-3">
                                            <Label>Due Date</Label>
                                            <Input
                                                name="due_date"
                                                type="date"
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.due_date || ""}
                                                invalid={
                                                    validation.touched.due_date && validation.errors.due_date ? true : false
                                                }
                                            />
                                            {validation.touched.due_date && validation.errors.due_date ? (
                                                <FormFeedback type="invalid">{validation.errors.due_date}</FormFeedback>
                                            ) : null}
                                        </div>
                                        <div className="mb-3">
                                            <Label>Priority</Label>
                                            <Input
                                                name="priority"
                                                type="select"
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.priority || ""}
                                                invalid={
                                                    validation.touched.priority && validation.errors.priority ? true : false
                                                }
                                            >
                                                <option>Low</option>
                                                <option>Medium</option>
                                                <option>High</option>
                                            </Input>
                                            {validation.touched.priority && validation.errors.priority ? (
                                                <FormFeedback type="invalid">{validation.errors.priority}</FormFeedback>
                                            ) : null}
                                        </div>
                                        <div className="mb-3">
                                            <Label>Status</Label>
                                            <Input
                                                name="status"
                                                type="select"
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.status || ""}
                                                invalid={
                                                    validation.touched.status && validation.errors.status ? true : false
                                                }
                                            >
                                                <option>Pending</option>
                                                <option>In Progress</option>
                                                <option>Completed</option>
                                                <option>Cancelled</option>
                                            </Input>
                                            {validation.touched.status && validation.errors.status ? (
                                                <FormFeedback type="invalid">{validation.errors.status}</FormFeedback>
                                            ) : null}
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <div className="text-end">
                                            <Button color="success" type="submit" className="save-task">
                                                Save
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>
                            </Form>
                        </ModalBody>
                    </Modal>
                </div>
            </div>
            <ToastContainer />
        </React.Fragment>
    );
};

export default TaskList;
