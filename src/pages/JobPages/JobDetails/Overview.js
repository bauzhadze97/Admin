import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, Col, Button } from 'reactstrap';

// Import images
import adobephotoshop from "../../../assets/images/companies/adobe-photoshop.svg";

const Overview = () => {
    // State to manage the task status and time tracking
    const [isTaskStarted, setIsTaskStarted] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(null);

    const handleApplyNowClick = () => {
        // Set the task as started and record the start time
        setIsTaskStarted(true);
        setStartTime(new Date());
    };

    const handleFinishTaskClick = () => {
        if (isTaskStarted) {
            const finishTime = new Date();
            setEndTime(finishTime);

            // Calculate the elapsed time in minutes
            const timeDiff = (finishTime - startTime) / 1000 / 60; // converting milliseconds to minutes
            setElapsedTime(timeDiff);

            // Simulate task closing
            setIsTaskStarted(false);
            alert(`Task finished! Elapsed time: ${timeDiff.toFixed(2)} minutes.`);
        }
    };

    return (
        <React.Fragment>
            <Col xl={3}>
                <Card>
                    <CardBody>
                        <h5 className="fw-semibold">Overview</h5>

                        <div className="table-responsive">
                            <table className="table">
                                <tbody>
                                    <tr>
                                        <th scope="col">Job Title</th>
                                        <td scope="col">Magento Developer</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Experience:</th>
                                        <td>0-2 Years</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Vacancy</th>
                                        <td>12</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Job Type</th>
                                        <td><span className="badge badge-soft-success">Full Time</span></td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Status</th>
                                        <td><span className="badge badge-soft-info">New</span></td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Posted Date</th>
                                        <td>25 June, 2022</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Close Date</th>
                                        <td>13 April, 2022</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="hstack gap-2">
                            {!isTaskStarted ? (
                                <Button className="btn btn-soft-primary w-100" onClick={handleApplyNowClick}>
                                    დაწყება
                                </Button>
                            ) : (
                                <Button className="btn btn-soft-success w-100" onClick={handleFinishTaskClick}>
                                    დასრულება
                                </Button>
                            )}
                           
                        </div>
                    </CardBody>
                </Card>

                <Card>
                    <CardBody>
                        <div className="text-center">
                            <img src={adobephotoshop} alt="" height="50" className="mx-auto d-block" />
                            <h5 className="mt-3 mb-1">GORGIA</h5>
                            <p className="text-muted mb-0">Since July 2017</p>
                        </div>

                        <ul className="list-unstyled mt-4">
                            <li>
                                <div className="d-flex">
                                    <i className="bx bx-phone text-primary fs-4"></i>
                                    <div className="ms-3">
                                        <h6 className="fs-14 mb-2">Phone</h6>
                                        <p className="text-muted fs-14 mb-0">+589 560 56555</p>
                                    </div>
                                </div>
                            </li>
                            <li className="mt-3">
                                <div className="d-flex">
                                    <i className="bx bx-mail-send text-primary fs-4"></i>
                                    <div className="ms-3">
                                        <h6 className="fs-14 mb-2">Email</h6>
                                        <p className="text-muted fs-14 mb-0">GORGIA@gmail.com</p>
                                    </div>
                                </div>
                            </li>
                            <li className="mt-3">
                                <div className="d-flex">
                                    <i className="bx bx-globe text-primary fs-4"></i>
                                    <div className="ms-3">
                                        <h6 className="fs-14 mb-2">Website</h6>
                                        <p className="text-muted fs-14 text-break mb-0">www.GORGIA.com</p>
                                    </div>
                                </div>
                            </li>
                            <li className="mt-3">
                                <div className="d-flex">
                                    <i className="bx bx-map text-primary fs-4"></i>
                                    <div className="ms-3">
                                        <h6 className="fs-14 mb-2">Location</h6>
                                        <p className="text-muted fs-14 mb-0">Oakridge Lane Richardson.</p>
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <div className="mt-4">
                            <Link to="#" className="btn btn-soft-primary btn-hover w-100 rounded"><i className="mdi mdi-eye"></i> View Profile</Link>
                        </div>
                    </CardBody>
                </Card>
            </Col>
        </React.Fragment>
    );
}

export default Overview;
