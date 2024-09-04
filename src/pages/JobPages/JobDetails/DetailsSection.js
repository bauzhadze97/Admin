import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, Col, Form, FormGroup, Input, Button } from 'reactstrap';

// Import images
import wechat from "../../../assets/images/companies/wechat.svg";
import { createTaskComment } from 'services/taskComment';

const DetailsSection = ({ task }) => {
    const [comment, setComment] = useState('');  
    const [comments, setComments] = useState(task.comments || []); 

    const {
        id: taskId,
        task_title,
        description,
        assigned_to,
        due_date,
        priority,
        status,
        created_at,
        updated_at
    } = task;

    const handleCommentChange = (event) => {
        setComment(event.target.value);
    };

    const handleCommentSubmit = async (event) => {
        event.preventDefault();
    
        if (!comment.trim()) return;  // Prevent submitting empty comments
    
        try {
            const newCommentData = {
                task_id: taskId,
                comment_text: comment
            };
    
            const newComment = await createTaskComment(taskId, newCommentData);
            setComments((prevComments) => [...prevComments, newComment]);
            setComment('');
        } catch (error) {
            console.error('Error creating comment:', error?.response?.data || error.message);
            alert('Failed to add comment. Please try again.');
        }
    };

    return (
        <React.Fragment>
            <Col xl={9}>
                <Card>
                    <CardBody className="border-bottom">
                        <div className="d-flex">
                            <img src={wechat} alt="" height="50" />
                            <div className="flex-grow-1 ms-3">
                                <h5 className="fw-semibold">{task_title || "No Title Available"}</h5>
                                <ul className="list-unstyled hstack gap-2 mb-0">
                                    <li>
                                        <i className="bx bx-building-house"></i> 
                                        <span className="text-muted">{assigned_to || "No Assignee"}</span>
                                    </li>
                                    <li>
                                        <i className="bx bx-calendar"></i> 
                                        <span className="text-muted">Due Date: {due_date || "N/A"}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </CardBody>
                    <CardBody>
                        <h5 className="fw-semibold mb-3">Description</h5>
                        <p className="text-muted">{description || "No description available."}</p>
                        
                        <h5 className="fw-semibold mb-3">Task Details</h5>
                        <ul className="vstack gap-3 job-vstack">
                            <li>
                                <strong>Priority:</strong> {priority || "N/A"}
                            </li>
                            <li>
                                <strong>Status:</strong> {status || "N/A"}
                            </li>
                            <li>
                                <strong>Created At:</strong> {created_at ? new Date(created_at).toLocaleString() : "N/A"}
                            </li>
                            <li>
                                <strong>Updated At:</strong> {updated_at ? new Date(updated_at).toLocaleString() : "N/A"}
                            </li>
                        </ul>

                        <div className="mt-4">
                            <span className="badge badge-soft-warning me-1">Task Tag</span>
                        </div>

                        <div className="mt-4">
                            <ul className="list-inline mb-0">
                                <li className="list-inline-item mt-1">
                                    Share this job:
                                </li>
                                <li className="list-inline-item mt-1">
                                    <Link to="#" className="btn btn-outline-primary btn-hover">
                                        <i className="uil uil-facebook-f"></i> Facebook
                                    </Link>
                                </li>
                                <li className="list-inline-item mt-1">
                                    <Link to="#" className="btn btn-outline-danger btn-hover">
                                        <i className="uil uil-google"></i> Google+
                                    </Link>
                                </li>
                                <li className="list-inline-item mt-1">
                                    <Link to="#" className="btn btn-outline-success btn-hover">
                                        <i className="uil uil-linkedin-alt"></i> LinkedIn
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </CardBody>
                    <CardBody>
                        <h5 className="fw-semibold mb-3">Leave a Comment</h5>
                        <Form onSubmit={handleCommentSubmit}>
                            <FormGroup>
                                <Input
                                    type="textarea"
                                    value={comment}
                                    onChange={handleCommentChange}
                                    placeholder="Write your comment here..."
                                    className="rounded-3"
                                    style={{ borderColor: '#ddd', padding: '10px' }}
                                />
                            </FormGroup>
                            <Button type="submit" color="primary">Submit Comment</Button>
                        </Form>

                        <div className="mt-4">
                            <h5 className="fw-semibold">Comments</h5>
                            {comments.length > 0 ? (
                                <ul className="list-unstyled">
                                    {comments.map((comment, index) => (
                                        <li key={index} className="mb-3">
                                            <div className="d-flex">
                                                <div className="me-2">
                                                    <img src="https://via.placeholder.com/40" alt="User Avatar" className="rounded-circle" />
                                                </div>
                                                <div className="bg-light p-3 rounded" style={{ flexGrow: 1, borderRadius: '15px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                                                    <p className="mb-1" style={{ fontWeight: 'bold', fontSize: '14px', color: '#333' }}>User Name</p>
                                                    <p className="mb-0" style={{ fontSize: '13px', color: '#555' }}>{comment.comment_text}</p>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No comments yet. Be the first to comment!</p>
                            )}
                        </div>
                    </CardBody>
                </Card>
            </Col>
        </React.Fragment>
    );
}

export default DetailsSection;
