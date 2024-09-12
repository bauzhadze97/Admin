import React, { useEffect, useState, useMemo } from 'react';
import {
  Button,
  Container,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { getInvoices, createInvoice, updateInvoice, deleteInvoice } from '../../services/invoiceService';

const InvoicePage = () => {
  const [invoices, setInvoices] = useState([]);
  const [invoice, setInvoice] = useState(null); // For editing a specific invoice
  const [isEdit, setIsEdit] = useState(false); // Determines if we're in edit mode
  const [modalOpen, setModalOpen] = useState(false); // Controls the modal visibility
  const [selectedFile, setSelectedFile] = useState(null); // Stores the selected file

  // Fetch invoices on component mount
  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await getInvoices();
      console.log('Invoices data:', response.data); // Log data for debugging
      setInvoices(response.data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  // Toggle modal visibility
  const toggleModal = () => setModalOpen(!modalOpen);

  // Handle "Add Invoice" button click
  const handleAddClick = () => {
    setInvoice(null); // Clear the invoice to ensure fresh data for adding
    setSelectedFile(null); // Reset the file input
    setIsEdit(false); // Set to 'Add' mode
    toggleModal();
  };

  // Handle "Edit" button click
  const handleEditClick = (invoiceData) => {
    setInvoice(invoiceData);
    setSelectedFile(null); // Reset file when editing
    setIsEdit(true); // Set to 'Edit' mode
    toggleModal();
  };

  // Handle invoice deletion
  const handleDeleteClick = async (invoiceId) => {
    try {
      await deleteInvoice(invoiceId);
      fetchInvoices(); // Refresh the invoices list after deletion
    } catch (error) {
      console.error('Error deleting invoice:', error);
    }
  };

  // Handle file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]); // Store the selected file
  };

  // Handle form submission to save a new or updated invoice
  const handleSaveInvoice = async (event) => {
    event.preventDefault();
  
    const formData = new FormData();
    formData.append('department', event.target.department.value);
    formData.append('invoice_file', selectedFile); // Append the selected file
    formData.append('status', 'pending'); // Default status for a new invoice
    formData.append('comments', event.target.comments.value || '');
  
    try {
      if (isEdit) {
        await updateInvoice(invoice.id, formData);
      } else {
        await createInvoice(formData);
      }
      fetchInvoices(); // Refresh invoices after creating/updating
      toggleModal(); // Close the modal
    } catch (error) {
      console.error('Error saving invoice:', error);
    }
  };
  

  // Table columns definition
  const columns = useMemo(
    () => [
      { field: 'id', headerName: '#', width: 50 },
      { field: 'department', headerName: 'Department', flex: 1 },
      { field: 'invoice_file', headerName: 'Invoice File', flex: 1 },
      { field: 'status', headerName: 'Status', width: 150 },
      { field: 'comments', headerName: 'Comments', flex: 1 },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 150,
        renderCell: (params) => (
          <div className="d-flex gap-2">
            <Button variant="contained" color="primary" onClick={() => handleEditClick(params.row)}>Edit</Button>
            <Button variant="contained" color="secondary" onClick={() => handleDeleteClick(params.row.id)}>Delete</Button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Invoice Management
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddClick}
        style={{ marginBottom: '20px', padding: '10px 20px' }} // Add spacing for button
      >
        Add Invoice
      </Button>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={invoices}
          columns={columns}
          pageSize={5}
          checkboxSelection
          disableSelectionOnClick
          sx={{
            '& .MuiDataGrid-columnHeaders': { // Add space between table headers
              fontWeight: 'bold',
              fontSize: '16px',
              padding: '8px 0',
            },
            '& .MuiDataGrid-cell': { // Add padding to cells
              padding: '8px 16px',
            },
          }}
        />
      </div>

      {/* Modal for Adding/Editing Invoice */}
      <Dialog open={modalOpen} onClose={toggleModal} fullWidth>
        <DialogTitle>{isEdit ? 'Edit Invoice' : 'Add Invoice'}</DialogTitle>
        <DialogContent>
          <form id="invoiceForm" onSubmit={handleSaveInvoice}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="department"
                  label="Department"
                  fullWidth
                  required
                  defaultValue={invoice ? invoice.department : ''}
                />
              </Grid>
              <Grid item xs={12}>
              <Button
  variant="outlined"
  component="label"
  fullWidth
  style={{ textAlign: 'left', padding: '10px' }} // Spacing for better file button layout
>
  {selectedFile ? selectedFile.name : 'Invoice File *'}
  <input
    type="file"
    name="invoice_file"
    hidden
    onChange={handleFileChange}
    accept="application/pdf,.doc,.docx,.xlsx" // Restrict to valid file types
    required={!isEdit} // Only required for new invoices
  />
</Button>

              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="comments"
                  label="Comments (optional)"
                  multiline
                  rows={4}
                  fullWidth
                  defaultValue={invoice ? invoice.comments : ''}
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleModal} color="secondary">
            Cancel
          </Button>
          <Button type="submit" form="invoiceForm" color="primary">
            {isEdit ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default InvoicePage;
