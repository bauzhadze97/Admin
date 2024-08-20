// src/components/filter.js
import React, { useEffect, useState, useMemo } from 'react';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import TableContainer from '../../components/Common/TableContainer';

import { getDailyList } from '../../services/daily';
import { getDepartments } from '../../services/auth';
import { Link } from 'react-router-dom';

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
                        <div>Data Table</div>
                        <div className='button-container'>
                            {/* <Link to='/create-daily'>
                                <Button variant="contained" color="primary">Create Task</Button>
                            </Link> */}
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
                   
                </div>
            </div>
        </div>
    );
};

export default DatatableTables;
