import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Breadcrumbs,
  TextField,
  IconButton,
} from "@mui/material"
import { getNoteList } from "../../services/note"
import NoteIcon from "../../assets/images/note-icon.png"
import SearchIcon from "../../assets/images/search-icon.png"
import SaveIcon from "../../assets/images/save.png"

const NotesPage = () => {
  const [notes, setNotes] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    try {
      const fetchData = async () => {
        const response = await getNoteList()
        const sortedNotes = response.data.notes.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        )
        setNotes(sortedNotes)
      }

      fetchData()
    } catch (error) {
      console.log(error)
    }
  }, [])

  const handleGetStarted = () => {
    navigate("/notes-editor")
  }

  // Search functionality to filter notes
  const filteredNotes = notes.filter(note => {
    const lowerCaseSearchQuery = searchQuery.toLowerCase()

    const lowerCaseTitle = note.title ? note.title.toLowerCase() : "" // Handle possible null titles
    const lowerCaseNote = note.note
      ? note.note.replace(/(<([^>]+)>)/gi, "").toLowerCase()
      : "" // Handle possible null note content

    return (
      lowerCaseTitle.includes(lowerCaseSearchQuery) ||
      lowerCaseNote.includes(lowerCaseSearchQuery)
    )
  })

  return (
    <div className="page-content">
      <div className="container-fluid">
        <Breadcrumbs title="Admin" breadcrumbItem="My Notes" />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", color: "#105D8D" }}
          >
            My Notes
          </Typography>
          <Box sx={{ display: "flex", gap: "10px" }}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <IconButton position="start">
                    <img src={SearchIcon} alt="search" />
                  </IconButton>
                ),
              }}
              sx={{
                backgroundColor: "#fff",
                borderRadius: "8px",
                boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
              }}
            />
            <Link to="/notes-editor">
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#007dba",
                  color: "#ffffff",
                  borderRadius: "25px",
                  padding: "10px 20px",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  textTransform: "none",
                }}
              >
                <img src={SaveIcon} alt="Save Icon" style={{ width: "16px" }} />
                Add Note
              </Button>
            </Link>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            paddingBottom: "50px",
          }}
        >
          {filteredNotes.length === 0 ? (
            <Box sx={{ textAlign: "center", paddingTop: "50px" }}>
              <img
                src={NoteIcon}
                alt="Empty Notes"
                style={{ marginBottom: "20px", width: "150px" }}
              />
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", marginBottom: "10px", color: "#333" }}
              >
                No Notes Found
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#666666", marginBottom: "20px" }}
              >
                You don't have any notes yet. Click below to get started.
              </Typography>
              <Button
                onClick={handleGetStarted}
                variant="contained"
                sx={{
                  backgroundColor: "#007dba",
                  color: "#ffffff",
                  borderRadius: "25px",
                  padding: "10px 30px",
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                Get Started
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
              {filteredNotes.map((note, index) => (
                <Link
                  to={`/notes-editor/${note.id}`}
                  key={note.id}
                  style={{
                    textDecoration: "none",
                    width: "calc(33.333% - 20px)",
                  }}
                >
                  <Card
                    sx={{
                      padding: "20px",
                      borderRadius: "15px",
                      boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
                      backgroundColor: "#ffffff",
                      transition: "transform 0.3s",
                      "&:hover": {
                        transform: "scale(1.03)",
                      },
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#888888",
                          marginBottom: "8px",
                        }}
                      >
                        {new Date(note.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </Typography>

                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: "bold",
                          fontFamily: '"BPG Rioni", sans-serif',
                          color: "#007dba",
                          marginBottom: "12px",
                        }}
                      >
                        {note.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontFamily: '"BPG Rioni", sans-serif',
                          color: "#333333",
                          lineHeight: "1.6",
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
    </div>
  )
}

export default NotesPage
