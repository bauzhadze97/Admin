<<<<<<< HEAD
// src/components/filter.js
import React, { useEffect, useState, useMemo } from 'react';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import TableContainer from '../../components/Common/TableContainer';

import { getDailyList } from '../../services/daily';
import { getDepartments } from '../../services/auth';
import { Link } from 'react-router-dom';
=======
import React, { useEffect, useState, useMemo } from 'react';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import TableContainer from '../../components/Common/TableContainer';
import { getDailyList, createDaily } from '../../services/daily';
import { getDepartments } from '../../services/auth';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './DatatableTables.css'; // Add your custom styles here
>>>>>>> 9627d4e (added comments page)

const DatatableTables = () => {
    const [data, setData] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(30);
    const [filters, setFilters] = useState({
        date: '',
        taskName: '',
        department: '',
        adminNotCommented: false
    });

<<<<<<< HEAD
=======
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        reportTitle: '',
        selectDate: new Date().toISOString().split('T')[0],
        description: '',
        link: '',
        department: ''
    });
    const [attachment, setAttachment] = useState(null);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

>>>>>>> 9627d4e (added comments page)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getDailyList(currentPage, itemsPerPage);
                const sortedData = response.data.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                setData(sortedData);
                setTotalPages(response.data.last_page);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, [currentPage, itemsPerPage]);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await getDepartments();
                setDepartments(response.data.departments);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchDepartments();
    }, []);

<<<<<<< HEAD
=======
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        setAttachment(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            console.log(formData);
            
            // Create the daily report
            await createDaily(formData); 
            
            toast.success('Task added successfully!', {
                position: 'top-right',
                autoClose: 3000,
            });
    
            // Re-fetch the updated list of daily reports to ensure all fields are populated
            const updatedResponse = await getDailyList(currentPage, itemsPerPage);
            const sortedData = updatedResponse.data.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            setData(sortedData);
    
            // Reset form fields
            setFormData({
                reportTitle: '',
                selectDate: '',
                description: '',
                link: '',
                department: ''
            });
            setAttachment(null);
    
            handleClose(); // Close the modal
    
        } catch (error) {
            toast.error('Error creating daily report!', {
                position: 'top-right',
                autoClose: 3000,
            });
            console.error('Error creating daily report:', error);
        }
    };
    

>>>>>>> 9627d4e (added comments page)
    const columns = useMemo(
        () => [
            {
                header: 'საკითხის ნომერი',
                accessorKey: 'id',
                enableSorting: true,
            },
            {
                header: 'თარიღი',
                accessorKey: 'date',
                enableSorting: true,
            },
            {
                header: 'საკითხი',
                accessorKey: 'name',
                enableSorting: true,
            },
            {
                header: 'დეპარტამენტი',
                accessorKey: 'user.department.name',
                enableSorting: true,
            },
            {
                header: 'სახელი/გვარი',
                accessorKey: 'user.name',
                enableSorting: true,
            },
        ],
        []
    );

    const handleFilterChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFilters({
            ...filters,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(parseInt(e.target.value));
        setCurrentPage(1);
    };

    const filteredData = data.filter(item => {
        const adminHasNotCommented = filters.adminNotCommented ? !item.comments.some(comment => comment.user.id === 1) : true;
        return (
            (filters.date === '' || new Date(item.date).toLocaleDateString() === new Date(filters.date).toLocaleDateString()) &&
            (filters.taskName === '' || item.name.toLowerCase().includes(filters.taskName.toLowerCase())) &&
            (filters.department === '' || item.user?.department?.id === filters.department) &&
            adminHasNotCommented
        );
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="page-content">
            <div className="container-fluid">
                <Breadcrumbs title="Tables" breadcrumbItem="Data Tables" />
                <div className="table-container">
                    <h2 className="page-name">
<<<<<<< HEAD
                        <div>Data Table</div>
                        <div className='button-container'>
                            {/* <Link to='/create-daily'>
                                <Button variant="contained" color="primary">Create Task</Button>
                            </Link> */}
=======
                        <div className='button-container'>
                            <button className="btn btn-primary" onClick={handleOpen}>
                                საკითხის გამოტანა
                            </button>
>>>>>>> 9627d4e (added comments page)
                        </div>
                    </h2>
                    
                    <TableContainer
                        columns={columns}
                        data={filteredData}
                        isGlobalFilter={true}
                        isPagination={true}
                        SearchPlaceholder="Search records..."
                        pagination="pagination"
                        paginationWrapper='dataTables_paginate paging_simple_numbers'
                        tableClass="table-bordered table-nowrap dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
                    />
<<<<<<< HEAD
                   
                </div>
            </div>
=======

                    {open && (
                        <div className="modal-overlay">
                            <div className="modal-centered">
                                <div className="modal-content">
                                    {/* <h2 className="modal-title">Add Daily Report</h2> */}
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label className="form-label">საკითხის სახელწოდება</label>
                                            <input
                                                type="text"
                                                name="reportTitle"
                                                value={formData.reportTitle}
                                                onChange={handleChange}
                                                required
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">აირჩიეთ თარიღი</label>
                                            <input
                                                type="date"
                                                name="selectDate"
                                                value={formData.selectDate}
                                                onChange={handleChange}
                                                required
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">აღწერა</label>
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleChange}
                                                rows="4"
                                                required
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">დეპარტამენტის მიბმა</label>
                                            <select
                                                name="department"
                                                value={formData.department}
                                                onChange={handleChange}
                                                required
                                                className="form-select"
                                            >
                                                <option value="" disabled>
                                                    აირჩიეთ დეპარტამენტი
                                                </option>
                                                {departments.map(department => (
                                                    <option key={department.id} value={department.id}>
                                                        {department.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">ბმული</label>
                                            <input
                                                type="url"
                                                name="link"
                                                value={formData.link}
                                                onChange={handleChange}
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">ფაილი</label>
                                            <input
                                                type="file"
                                                name="attachment"
                                                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                                                onChange={handleFileChange}
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <button type="submit" className="btn btn-success">
                                                რეპორტის დამატება
                                            </button>
                                            <button type="button" className="btn btn-secondary" onClick={handleClose}>
                                                დახურვა
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <ToastContainer />
>>>>>>> 9627d4e (added comments page)
        </div>
    );
};

export default DatatableTables;
