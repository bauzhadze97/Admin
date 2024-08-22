import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { createDailyComment, getDailyCommentList } from '../../services/dailyComment';
import { getDaily } from '../../services/daily';
import { Button, Form, FormGroup, Label, Input, Col, Row, Card, CardBody, ListGroup, ListGroupItem } from 'reactstrap';

const MakeComment = () => {
  const { id } = useParams(); 
  const [item, setItem] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null); // Track which comment is being replied to
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await getDaily(id); // Fetch the daily item
        setItem(response.data);
        const commentsResponse = await getDailyCommentList(); // Fetch all comments
        setComments(commentsResponse.data.filter(comment => comment.daily_id === id)); // Filter comments by daily_id
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) {
        return;
    }

    try {
        const response = await createDailyComment({
            comment: newComment, // Ensure this matches the expected key in your API
            daily_id: id,
            parent_id: replyTo, // Set parent_id if replying to a comment
            user_id: 1, // Adjust as needed to reflect the current user
        });
        const savedComment = response.data;
        setComments([...comments, savedComment]);
        setNewComment('');
        setReplyTo(null); // Reset replyTo after submitting
      } catch (error) {
        console.error("Error submitting comment:", error);
        setError("Failed to submit comment");
      }
  };

  const renderComments = (commentsList, parentId = null) => {
    return commentsList
      .filter(comment => comment.parent_id === parentId)
      .map(comment => (
        <div key={comment.id} style={{ marginLeft: parentId ? '20px' : '0' }}>
          <ListGroupItem className="border-0 p-3 mb-2 bg-light rounded shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <small className="text-muted">
                <strong>Date:</strong> {comment.created_at ? new Date(comment.created_at).toLocaleString() : 'N/A'}
              </small>
              <small className="text-muted">
                <strong>Name:</strong> {comment.user?.name} {comment.user?.sur_name}
              </small>
            </div>
            <p className="mb-0">{comment.comment}</p> {/* Correctly display the comment content */}
            <Button size="sm" color="link" onClick={() => setReplyTo(comment.id)}>Reply</Button>
          </ListGroupItem>
          {renderComments(comment.replies, comment.id)} {/* Recursively render replies */}
        </div>
      ));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mt-4">
      <h2>Item Details</h2>
      {item ? (
        <Card className="mb-4">
          <CardBody>
            <p><strong>ID:</strong> {item.id}</p>
            <p><strong>Date:</strong> {item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Task Name:</strong> {item.name}</p>
            <p><strong>Department:</strong> {item.user?.department?.name}</p>
            <p><strong>Name:</strong> {item.user?.name}</p>
          </CardBody>
        </Card>
      ) : (
        <p>No item found</p>
      )}

      <h3>Comments</h3>
      <ListGroup className="mb-4">
        {renderComments(comments)}
      </ListGroup>

      <h4>{replyTo ? "Reply to Comment" : "Add a Comment"}</h4>
      <Form onSubmit={handleCommentSubmit}>
        <FormGroup row>
          <Label for="comment" sm={2}>Comment</Label>
          <Col sm={10}>
            <Input 
              type="textarea" 
              name="comment" 
              id="comment" 
              value={newComment} 
              onChange={handleCommentChange} 
              placeholder="Enter your comment here" 
              required 
              style={{ height: '100px' }}
            />
          </Col>
        </FormGroup>
        <Row className="justify-content-end">
          <Col sm={10} className="text-right">
            <Button color="primary" type="submit">Submit</Button>
            {replyTo && <Button color="secondary" type="button" onClick={() => setReplyTo(null)} className="ml-2">Cancel</Button>}
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default MakeComment;