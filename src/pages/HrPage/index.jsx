import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import Navigation from '../../components/Navigation';
import { FormControl, InputLabel, MenuItem, Select, Button, Box, Breadcrumbs } from '@mui/material';

const HrPage = () => {
  const [selectedDocument, setSelectedDocument] = useState('');
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleDocumentChange = (event) => {
    setSelectedDocument(event.target.value);
  };

  const handleNext = () => {
    if (selectedDocument) {
      // Perform any request logic here (e.g., send the data to the backend)
      // After the request, navigate to the hr-status page
      navigate('/hr-status'); // Navigate to the status page
    } else {
      alert('Please select an HR document type.');
    }
  };

  return (
    <div className="page-content">
    <div className="container-fluid">
        <Breadcrumbs title="Admin" breadcrumbItem="Daily Report" />
    <div className="vacation-dashboard-container">
      <div className="middle-wrapper flex pl-10">
        <main className="vacation-main-content grow">
          <div className="flex flex-col items-center">
            <div className="vacation-main-header border-[3px] border-[#105D8D] w-[100%]">
              <h1 style={{ color: '#007dba' }} className="font-semibold text-xl">
                HR Documents
              </h1>
            </div>
            <div className="w-[80%] h-[600px] pt-2 flex flex-col items-center">
              <Box
                sx={{
                  textAlign: 'center',
                  marginTop: '50px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2, // Space between the dropdown and the button
                }}
              >
                <FormControl variant="outlined" sx={{ minWidth: 300 }}>
                  <InputLabel id="hr-document-label" style={{ color: '#000' }} sx={{ fontFamily: '"BPG Rioni", sans-serif' }}>
                    აირჩიეთ დოკუმენტის ტიპი
                  </InputLabel>
                  <Select
                    labelId="hr-document-label"
                    value={selectedDocument}
                    onChange={handleDocumentChange}
                    label="Choose HR Document Type"
                    sx={{
                      backgroundColor: '#ffffff',
                      borderRadius: '25px',
                      height: '50px',
                      fontFamily: '"BPG Rioni", sans-serif',
                    }}
                  >
                    <MenuItem value="salary" sx={{ fontFamily: '"BPG Rioni", sans-serif' }}>
                      ცნობა ხელფასის შესახებ
                    </MenuItem>
                    <MenuItem value="notes" sx={{ fontFamily: '"BPG Rioni", sans-serif' }}>
                      ცნობა სამსახურის შესახებ
                    </MenuItem>
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{
                    backgroundColor: '#FFE61C',
                    color: '#009FE3',
                    borderRadius: '25px',
                    padding: '10px 30px',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    fontFamily: '"BPG Rioni", sans-serif',
                  }}
                >
                  გაგზავნა
                </Button>
              </Box>
            </div>
          </div>
        </main>
      </div>
    </div>
    </div>
    </div>
  );
};

export default HrPage;
