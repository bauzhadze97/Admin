import React, { useEffect, useMemo, useState } from "react";
import '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import TableContainer from '../../../components/Common/TableContainer';
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
} from "reactstrap";
import Spinners from "components/Common/Spinner";
import { ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";

const TaskList = () => {

    // Meta title
    document.title = "Tasks List | Gorgia LLC";

    const [modal, setModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [task, setTask] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState(false);

    // Fetch tasks function
    const fetchTasks = async () => {
        setLoading(true);
        try {
            console.log("Fetching tasks...");  // Debugging line
            const response = await getTaskList();
            console.log("Tasks fetched successfully:", response.data);  // Debugging line
            setTasks(response.data || []);  // Ensure it's always an array
        } catch (error) {
            console.error("Error fetching tasks:", error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch tasks on component mount
    useEffect(() => {
        fetchTasks();
    }, []);

    // Form validation
    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {
            taskId: (task && task.taskId) || '',
            taskTitle: (task && task.taskTitle) || '',
            description: (task && task.description) || '',
            assignedTo: (task && task.assignedTo) || '',
            dueDate: (task && task.dueDate) || '',
            priority: (task && task.priority) || 'Medium',
            status: (task && task.status) || 'Pending',
        },
        validationSchema: Yup.object({
            taskId: Yup.string().required("Please Enter Your Task Id"),
            taskTitle: Yup.string().required("Please Enter Your Task Title"),
            description: Yup.string().required("Please Enter Your Description"),
            assignedTo: Yup.string().required("Please Enter Assignee"),
            dueDate: Yup.date().required("Please Enter Due Date"),
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
                    return <Link to="#" className="text-body fw-bold">{cellProps.row.original.id}</Link>
                }
            },
            {
                header: "Task Title",
                accessorKey: "taskTitle",
            },
            {
                header: 'Description',
                accessorKey: "description",
            },
            {
                header: 'Assigned To',
                accessorKey: "assignedTo"
            },
            {
                header: 'Due Date',
                accessorKey: "dueDate"
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
                                    to="#"
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
                                            <TableContainer
                                                columns={columns}
                                                data={tasks}
                                                isCustomPageSize={true}
                                                isGlobalFilter={true}
                                                isPagination={true}
                                                SearchPlaceholder="Search for ..."
                                                tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline mt-4 border-top"
                                                pagination="pagination"
                                                paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
                                            />
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
                                            <Label> Task Id</Label>
                                            <Input
                                                name="taskId"
                                                type="text"
                                                placeholder="Insert Task Id"
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.taskId || ""}
                                                invalid={
                                                    validation.touched.taskId && validation.errors.taskId ? true : false
                                                }
                                            />
                                            {validation.touched.taskId && validation.errors.taskId ? (
                                                <FormFeedback type="invalid">{validation.errors.taskId}</FormFeedback>
                                            ) : null}
                                        </div>
                                        <div className="mb-3">
                                            <Label>Task Title</Label>
                                            <Input
                                                name="taskTitle"
                                                type="text"
                                                placeholder="Insert Task Title"
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.taskTitle || ""}
                                                invalid={
                                                    validation.touched.taskTitle && validation.errors.taskTitle ? true : false
                                                }
                                            />
                                            {validation.touched.taskTitle && validation.errors.taskTitle ? (
                                                <FormFeedback type="invalid">{validation.errors.taskTitle}</FormFeedback>
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
                                                name="assignedTo"
                                                type="text"
                                                placeholder="Assigned To"
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.assignedTo || ""}
                                                invalid={
                                                    validation.touched.assignedTo && validation.errors.assignedTo ? true : false
                                                }
                                            />
                                            {validation.touched.assignedTo && validation.errors.assignedTo ? (
                                                <FormFeedback type="invalid">{validation.errors.assignedTo}</FormFeedback>
                                            ) : null}
                                        </div>
                                        <div className="mb-3">
                                            <Label>Due Date</Label>
                                            <Input
                                                name="dueDate"
                                                type="date"
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.dueDate || ""}
                                                invalid={
                                                    validation.touched.dueDate && validation.errors.dueDate ? true : false
                                                }
                                            />
                                            {validation.touched.dueDate && validation.errors.dueDate ? (
                                                <FormFeedback type="invalid">{validation.errors.dueDate}</FormFeedback>
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
