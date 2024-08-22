import React, { useEffect, useState, useMemo } from 'react';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import TableContainer from '../../components/Common/TableContainer';
import { getDailyList } from '../../services/daily';
import { getDepartments } from '../../services/auth';

const DatatableTables = () => {
    const [data, setData] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);  // Adjust itemsPerPage as needed
    const [filters, setFilters] = useState({
        date: '',
        taskName: '',
        department: '',
        adminNotCommented: false
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await getDailyList(currentPage, itemsPerPage);
                const sortedData = response.data.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                setData(sortedData);
                setTotalItems(response.data.total);  // Adjust based on your API response
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
        if (currentPage < Math.ceil(totalItems / itemsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(parseInt(e.target.value));
        setCurrentPage(1);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="page-content">
            <div className="container-fluid">
                <Breadcrumbs title="Tables" breadcrumbItem="Data Tables" />
                <div className="table-container">
                    <h2 className="page-name">
                        <div>Data Table</div>
                    </h2>
                    
                    <TableContainer
                        columns={columns}
                        data={data}
                        isGlobalFilter={true}
                        isPagination={true}
                        SearchPlaceholder="Search records..."
                        pagination="pagination"
                        paginationWrapper='dataTables_paginate paging_simple_numbers'
                        tableClass="table-bordered table-nowrap dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
                        currentPage={currentPage}
                        itemsPerPage={itemsPerPage}
                        totalItems={totalItems}
                        onPreviousPage={handlePreviousPage}
                        onNextPage={handleNextPage}
                        onItemsPerPageChange={handleItemsPerPageChange}
                        setCurrentPage={setCurrentPage}
                    />
                </div>
            </div>
        </div>
    );
};

export default DatatableTables;
