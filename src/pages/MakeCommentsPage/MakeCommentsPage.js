import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { getDaily, getComments, postComment } from '../../services/daily'; // Import functions
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const MakeCommentsPage = () => {
    const { id } = useParams(); // Get the ID from the URL parameters
    const [report, setReport] = useState(null);
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const response = await getDaily(id);
                setReport(response.data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        const fetchComments = async () => {
            try {
                const response = await getComments(id);
                setComments(response.data);
            } catch (error) {
                toast.error('Error fetching comments.');
            }
        };

        fetchReport();
        fetchComments();
    }, [id]);

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await postComment(id, { text: comment });
            setComment(''); // Clear the comment input
            toast.success('Comment submitted successfully!');
            // Fetch comments again to include the new one
            const response = await getComments(id);
            setComments(response.data);
        } catch (error) {
            toast.error('Error submitting comment.');
        }

        setSubmitting(false);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="page-content">
            <div className="container-fluid">
                <Breadcrumbs title="Make Comments" breadcrumbItem="Make Comments Page" />
                <h1>{report.name}</h1>
                <p>Date: {report.date}</p>
                <p>{report.description}</p>
                <a href={report.link} target="_blank" rel="noopener noreferrer">View Link</a>
                {report.attachment && (
                    <a href={report.attachment} target="_blank" rel="noopener noreferrer">Download Attachment</a>
                )}
                
                <div className="mt-4">
                    <h4>Comments</h4>
                    <div className="list-group mb-4">
                        {comments.map((comment, index) => (
                            <div key={index} className="list-group-item">
                                <p>{comment.text}</p>
                                <small className="text-muted">Posted on {new Date(comment.date).toLocaleDateString()}</small>
                            </div>
                        ))}
                    </div>

                    <h4>Make a Comment</h4>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-3">
                            <label htmlFor="comment" className="form-label">Your Comment</label>
                            <textarea
                                id="comment"
                                className="form-control"
                                rows="4"
                                value={comment}
                                onChange={handleCommentChange}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={submitting}
                        >
                            {submitting ? 'Submitting...' : 'Submit Comment'}
                        </button>
                    </form>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default MakeCommentsPage;
