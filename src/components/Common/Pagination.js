import { Link } from "react-router-dom";
import React, { useEffect } from "react";
import { Col, Row } from "reactstrap";

const Paginations = ({ perPageData, data, currentPage, setCurrentPage, isShowingPageLength, paginationDiv, paginationClass }) => {

<<<<<<< HEAD
    //pagination

    const handleClick = (e) => {
        setCurrentPage(Number(e.target.id));
    };

=======
>>>>>>> 9627d4e (added comments page)
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(data?.length / perPageData); i++) {
        pageNumbers.push(i);
    }
<<<<<<< HEAD
    const handleprevPage = () => {
        let prevPage = currentPage - 1;
        setCurrentPage(prevPage);
    };
    const handlenextPage = (event) => {
        event.preventDefault();
        let nextPage = currentPage + 1;
        setCurrentPage(nextPage);
    };

    useEffect(() => {
        if (pageNumbers.length && pageNumbers.length < currentPage) {
            setCurrentPage(pageNumbers.length)
        }
    }, [pageNumbers.length, currentPage, setCurrentPage])
=======

    const handleClick = (e) => {
        const page = Number(e.target.id);
        if (page !== currentPage) {
            setCurrentPage(page);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = (event) => {
        event.preventDefault();
        if (currentPage < pageNumbers.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    useEffect(() => {
        if (pageNumbers.length && currentPage > pageNumbers.length) {
            setCurrentPage(pageNumbers.length);
        }
    }, [pageNumbers.length, currentPage, setCurrentPage]);
>>>>>>> 9627d4e (added comments page)

    return (
        <React.Fragment>
            <Row className="justify-content-between align-items-center">
<<<<<<< HEAD
                {isShowingPageLength && <Col sm={12} md={5}>
                    <div className="text-muted dataTables_info">Showing {perPageData} of {data?.length} entries</div>
                </Col>}
                <div className={paginationDiv}>
                    <ul className={paginationClass}>
                        <li className={`page-item ${currentPage <= 1 ? "disabled" : ''}`}>
                            <Link className="page-link" to="#" onClick={() => handleprevPage()}>
                                <i className="mdi mdi-chevron-left"></i>
                            </Link>
                        </li>
                        {(pageNumbers || []).map((item, index) => (
                            <li className={currentPage === item ? "page-item active " : "page-item"} key={index}>
                                <Link className="page-link" to="#" id={item} onClick={(e) => handleClick(e)}>
=======
                {isShowingPageLength && (
                    <Col sm={12} md={5}>
                        <div className="text-muted dataTables_info">
                            Showing {perPageData} of {data?.length} entries
                        </div>
                    </Col>
                )}
                <div className={paginationDiv}>
                    <ul className={paginationClass}>
                        <li className={`page-item ${currentPage <= 1 ? "disabled" : ""}`}>
                            <Link className="page-link" to="#" onClick={handlePrevPage}>
                                <i className="mdi mdi-chevron-left"></i>
                            </Link>
                        </li>
                        {pageNumbers.map((item, index) => (
                            <li
                                className={currentPage === item ? "page-item active" : "page-item"}
                                key={index}
                            >
                                <Link
                                    className="page-link"
                                    to="#"
                                    id={item}
                                    onClick={handleClick}
                                >
>>>>>>> 9627d4e (added comments page)
                                    {item}
                                </Link>
                            </li>
                        ))}
<<<<<<< HEAD
                        <li className={`page-item ${currentPage > 1 ? "disabled" : ''}`}>
                            <Link className="page-link" to="#" onClick={(e) => handlenextPage(e)}>
=======
                        <li className={`page-item ${currentPage >= pageNumbers.length ? "disabled" : ""}`}>
                            <Link className="page-link" to="#" onClick={handleNextPage}>
>>>>>>> 9627d4e (added comments page)
                                <i className="mdi mdi-chevron-right"></i>
                            </Link>
                        </li>
                    </ul>
                </div>
            </Row>
        </React.Fragment>
    );
<<<<<<< HEAD
}

export default Paginations;
=======
};

export default Paginations;
>>>>>>> 9627d4e (added comments page)
