import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import NoteImage from '../../assets/images/illustration.png';
import { Box, Typography, Button, Card, CardContent, Breadcrumbs } from '@mui/material';
import { getNoteList } from '../../services/note';
import NoteIcon from '../../assets/images/note-icon.png';
import SearchIcon from '../../assets/images/search-icon.png';
import SaveIcon from '../../assets/images/save.png';

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    try {
      const fetchData = async () => {
        const response = await getNoteList();
        
        // Sort notes by creation date in descending order (most recent first)
        const sortedNotes = response.data.notes.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setNotes(sortedNotes);
      };

      fetchData();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/notes-editor');
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      // Add the new note to the beginning of the notes array
      setNotes([newNote.trim(), ...notes]);
      setNewNote('');
    }
  };

  return (
    <div className="page-content">
    <div className="container-fluid">
        <Breadcrumbs title="Admin" breadcrumbItem="Daily Report" />
    <div className="vacation-dashboard-container">
      <div className="middle-wrapper flex pl-10">
        <main className="vacation-main-content grow ">
          <div className="flex flex-col items-center">
            <Box sx={{ width: '60%', paddingBottom: '20px', textAlign: 'center' }}>
              {notes.length === 0 ? (
                <Box sx={{ marginTop: '50px', }}>
                  <Card
                    sx={{
                      padding: '20px',
                      backgroundColor: '#f5f5f5',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      borderRadius: '15px',
                    }}
                  >
                    <img
                      src={NoteImage}
                      alt="Empty Notes"
                      style={{ marginBottom: '20px', width: '200px' }}
                    />
                    <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
                      It's Empty
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666666', marginBottom: '20px' }}>
                      Hmm... Looks like you don’t have any notes.
                    </Typography>
                    <Button
                      onClick={handleGetStarted}
                      variant="contained"
                      sx={{
                        backgroundColor: '#007dba',
                        color: '#ffffff',
                        borderRadius: '25px',
                        padding: '10px 30px',
                        fontWeight: 'bold',
                        fontSize: '16px',
                      }}
                    >
                      Get Started
                    </Button>
                  </Card>
                </Box>
              ) : (
                <Box sx={{ backgroundColor: "white", width: "100%", padding: "50px", mt: "50px" }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <img src={NoteIcon} alt="Note Icon" />
                    <p style={{ marginBottom: '1.5rem', fontSize: '32px', color: '#105D8D' }}>My Notes</p>
                    <p style={{ color: '#939191' }}>{notes && notes.length}</p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1.5rem', paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
                    <Link to='/notes-editor'>
                      <img src={SaveIcon} alt="Save Icon" />
                    </Link>
                    <img src={SearchIcon} alt="Search Icon" />
                  </div>
                  {notes.map((note, index) => (
                    <Link 
                      to={`/notes-editor/${note.id}`} 
                      key={index} 
                      style={{ textDecoration: 'none' }}
                    >
                      <Card
                        sx={{
                          marginBottom: '20px',
                          padding: '20px',
                          borderRadius: '15px',
                          boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
                          backgroundColor: '#ffffff',
                          transition: 'transform 0.3s',
                          '&:hover': {
                            transform: 'scale(1.03)',
                          },
                        }}
                      >
                        <CardContent>
                          <Typography
                            variant="body2"
                            sx={{
                              color: '#888888',
                              marginBottom: '8px',
                            }}
                          >
                            {new Date(note.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </Typography>

                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 'bold',
                              fontFamily: '"BPG Rioni", sans-serif',
                              color: '#007dba',
                              marginBottom: '12px',
                            }}
                          >
                            {note.title}
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              fontFamily: '"BPG Rioni", sans-serif',
                              color: '#333333',
                              lineHeight: '1.6',
                            }}
                            dangerouslySetInnerHTML={{ __html: note.note }} 
                          />
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </Box>
              )}
            </Box>
          </div>
        </main>
      </div>
    </div>
    </div>
    </div>
  );
};

export default NotesPage;
