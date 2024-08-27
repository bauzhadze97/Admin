import echo from 'plugins/echo';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input, Col, Row, Card, CardBody, ListGroup, ListGroupItem } from 'reactstrap';
import { getDaily } from 'services/daily';
import { createDailyComment } from 'services/dailyComment';
import Pusher from 'pusher-js';

const MakeComment = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 10;

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await getDaily(id);
        setItem(response.data);
        setComments(response.data.comments || []);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);


  const userId = 1;

  // useEffect(() => {
  //   console.log('useEffect called for userId:', userId);

  //   const channel = echo.private(`user.${userId}`);
    
  //   channel.listen('App\\Events\\ReplyMade', (e) => {
  //     console.log('New reply received:', e);
  //   });

  //   return () => {
  //     console.log('Cleaning up useEffect for userId:', userId);
  //     channel.stopListening('App\\Events\\ReplyMade');
  //     echo.leaveChannel(`user.${userId}`);
  //   };
  // }, []); 
  
  // useEffect(() => {
  //   console.log('useEffect called for userId:', userId);

  //   const channel = echo.private(`user.${userId}`);
    
  //   // Match the event name here with what is broadcasted from Laravel
  //   channel.listen('.ReplyMade', (e) => {
  //     console.log('New reply received:', e);
  //   });
  //   console.log(channel)
  //   return () => {
  //     console.log('Cleaning up useEffect for userId:', userId);
  //     channel.stopListening('.ReplyMade');
  //     echo.leaveChannel(`user.${userId}`);
  //   };
  // }, [userId]); // Include userId as a dependency if it's subject to change
 
  useEffect(() => {
    console.log(window.Echo)
    if (window.Echo) {
      // Subscribe to the correct channel with user ID
      const channel = window.Echo.channel(`user.${userId}`);
      // Listen for the event
      channel.listen('ReplyMade', (event) => {
        console.log('Event received:', event);
        // setUserData(event.user);
      });

      // Cleanup on unmount
      return () => {
        window.Echo.leave(`user.${userId}`);
      };
    }
  }, [userId, window.Echo]);


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
        comment: newComment,
        daily_id: id,
        parent_id: replyTo,
        user_id: 1,
      });
      const savedComment = response.data;
      setComments([...comments, savedComment]);
      setNewComment('');
      setReplyTo(null);
    } catch (error) {
      console.error("Error submitting comment:", error);
      setError("Failed to submit comment");
    }
  };

  const paginate = (commentsList) => {
    const startIndex = (currentPage - 1) * commentsPerPage;
    const endIndex = startIndex + commentsPerPage;
    return commentsList.slice(startIndex, endIndex);
  };

  const renderComments = (commentsList, parentId = null) => {
    const paginatedComments = paginate(commentsList);


   

    return (paginatedComments || [])
      .filter(comment => comment.parent_id === parentId && comment.user_id !== 1)
      .map(comment => (
        <div key={comment.id} style={{ marginLeft: parentId ? '20px' : '0', borderLeft: parentId ? '2px solid #ddd' : 'none', paddingLeft: parentId ? '15px' : '0', marginBottom: '10px' }}>
          <ListGroupItem className="border border-light p-3 mb-2 bg-light rounded shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <small className="text-muted">
                <strong>თარიღი:</strong> {comment.created_at ? new Date(comment.created_at).toLocaleString() : 'N/A'}
              </small>
              <small className="text-muted">
                <strong>სახელი / გვარი:</strong> {comment.user?.name} / {comment.user?.sur_name}
              </small>
            </div>
            <p className="mb-0">{comment.comment}</p>
            <Button size="sm" color="link" className="text-primary p-0" onClick={() => setReplyTo(comment.id)}>პასუხი</Button>
          </ListGroupItem>
          {renderComments(commentsList, comment.id)}
        </div>
      ));
  };

  const renderAdminReplies = (parentId) => {
    return comments
      .filter(comment => comment.parent_id === parentId)
      .map(comment => (
        <Card key={comment.id} className="mb-3 border border-secondary shadow-sm" style={{ marginLeft: '20px' }}>
          <CardBody>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div>
                <strong>{comment.user?.name} {comment.user?.sur_name}</strong>
                <p className="mb-1"><small className="text-muted">Department: {comment.user?.department?.name}</small></p>
              </div>
              <small className="text-muted">{new Date(comment.created_at).toLocaleTimeString()}</small>
            </div>
            <p className="mb-1">{comment.comment}</p>
          </CardBody>
        </Card>
      ));
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(comments.length / commentsPerPage)) setCurrentPage(currentPage + 1);
  };

  const adminComments = comments.filter(comment => comment.user_id === 1);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;






  // useEffect(() => {
  //   const pusher = new Pusher(process.env.REACT_APP_PUSHER_APP_KEY, {
  //     cluster: process.env.REACT_APP_PUSHER_APP_CLUSTER,
  //     encrypted: true,
  //   });

  //   const userId = 1; 
  //   const channel = echo.private(`user.${userId}`);

  //   channel.listen('App\\Events\\ReplyMade', (e) => {
  //     console.log('New reply received:', e);
    
  //   });

  //   return () => {
  //     channel.unbind_all();
  //     channel.unsubscribe();
  //   };
  // }, []);

  

  return (
    <div className="container-fluid mt-4">
      <Row style={{ paddingTop: '60px' }}>
        <Col md={8}>
          <Card className="mb-4 shadow border-0">
            <CardBody className="p-5">
              <h3 className="text-dark mb-4">დღის საკითხის აღწერა</h3>
              <p className="lead text-muted" style={{ whiteSpace: 'pre-wrap' }}>{item?.description}</p>
            </CardBody>
          </Card>

          <h3 className="text-dark mb-4">კომენტარები</h3>
          <ListGroup className="mb-4">
            {comments.length > 0 ? renderComments(comments) : <p className="text-muted">ამ საკითხზე კომენტარი ჯერ არ არის.</p>}
          </ListGroup>

          {comments.length > commentsPerPage && (
            <div className="d-flex justify-content-between mb-3">
              <Button color="primary" disabled={currentPage === 1} onClick={handlePreviousPage}>წინა გვერდი</Button>
              <Button color="primary" disabled={currentPage === Math.ceil(comments.length / commentsPerPage)} onClick={handleNextPage}>შემდეგი გვერდი</Button>
            </div>
          )}

          <h4 className="text-dark mb-3">{replyTo ? "პასუხი კომენტარზე" : "კომენტარის დამატება"}</h4>
          <Form onSubmit={handleCommentSubmit} className="mb-4 pb-5 shadow-sm p-4 bg-white rounded">
            <FormGroup row className="mb-3">
              <Label for="comment" sm={2} className="col-form-label">კომენტარი</Label>
              <Col sm={10}>
                <Input 
                  type="textarea" 
                  name="comment" 
                  id="comment" 
                  value={newComment} 
                  onChange={handleCommentChange} 
                  placeholder="დაწერეთ თქვენი კომენტარი აქ..." 
                  required 
                  style={{ height: '120px', borderColor: '#ced4da' }}
                  className="border-0 shadow-sm"
                />
              </Col>
            </FormGroup>
            <Row className="justify-content-end">
              <Col sm={10} className="text-right">
                <Button color="success" type="submit" className="shadow-sm">გაგზავნა</Button>
                {replyTo && <Button color="secondary" type="button" onClick={() => setReplyTo(null)} className="ml-2 shadow-sm">გაუქმება</Button>}
              </Col>
            </Row>
          </Form>
        </Col>

        <Col md={4}>
          <Card className="mb-4 shadow">
            <CardBody>
              <h5 className="text-center text-primary mb-4">დამფუძნებლის კომენტარი</h5>
              {adminComments.length > 0 ? (
                adminComments.map(comment => (
                  <Card key={comment.id} className="mb-3 border border-primary shadow-sm">
                    <CardBody>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <strong className="text-primary">
                          <i className="fas fa-user-shield me-2"></i> Admin
                        </strong>
                        <span className="badge bg-primary text-white">{new Date(comment.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="mb-1">{comment.comment}</p>
                      <div className="text-end">
                        <small className="text-muted">{new Date(comment.created_at).toLocaleTimeString()}</small>
                      </div>
                      <Button size="sm" color="link" className="text-primary p-0" onClick={() => setReplyTo(comment.id)}>პასუხი</Button>
                      {renderAdminReplies(comment.id)}
                    </CardBody>
                  </Card>
                ))
              ) : (
                <p className="text-muted">დამფუძნებლის კომენტარი არ არის.</p>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MakeComment;
