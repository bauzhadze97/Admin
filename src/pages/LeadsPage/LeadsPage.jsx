import React, { useEffect, useState, useMemo } from 'react';
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  Input,
  Form,
  Button,
} from 'reactstrap';
import { useTable, usePagination, useSortBy } from 'react-table';
import DeleteModal from 'components/Common/DeleteModal';
import {
  getLeads,
  createLead,
  updateLead,
  deleteLead,
} from '../../services/leadsService'; // Ensure these functions are implemented
import Breadcrumbs from 'components/Common/Breadcrumb';

const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [lead, setLead] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [modal, setModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const fetchLeads = async () => {
    try {
      const response = await getLeads();
      setLeads(response || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
      setLeads([]);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleStatusChange = async (leadId, newStatus) => {
    const leadToUpdate = leads.find(lead => lead.id === leadId);
  
    
  
    const updatedLead = { ...leadToUpdate, status: newStatus };
  
    try {
      await updateLead(leadId, updatedLead); 
      console.log('Updated Lead:', updatedLead);
      fetchLeads(); 
    } catch (error) {
      console.error('Error updating lead status:', error);
    }
  };
  

  const columns = useMemo(() => [
    { Header: 'First Name', accessor: 'first_name' },
    { Header: 'Last Name', accessor: 'last_name' },
    { Header: 'Request', accessor: 'request' },
    { Header: 'Responsible Person', accessor: 'responsible_person' },
    {
      Header: 'Status',
      accessor: 'status',
      Cell: ({ row }) => (
        <Input
          type="select"
          value={row.original.status}
          onChange={(e) => handleStatusChange(row.original.id, e.target.value)} 
        >
          <option value="Active">Active</option>
          <option value="Closed">Closed</option>
          <option value="Problem">Problem</option>
        </Input>
      ),
    },
    { Header: 'Comment', accessor: 'comment' },
    {
      Header: 'Actions',
      id: 'actions',
      Cell: ({ row }) => (
        <div className="d-flex gap-2">
          <Button color="primary" onClick={() => handleEditClick(row.original)}>Edit</Button>
          <Button color="danger" onClick={() => handleDeleteClick(row.original)}>Delete</Button>
        </div>
      )
    }
  ], []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data: leads }, useSortBy, usePagination);

  const handleAddClick = () => {
    setLead(null);
    setIsEdit(false);
    setModal(true);
  };

  const handleEditClick = (leadData) => {
    setLead(leadData);
    setIsEdit(true);
    setModal(true);
  };

  const handleDeleteClick = (leadData) => {
    setLead(leadData);
    setDeleteModal(true);
  };

  const handleDeleteLead = async () => {
    try {
      await deleteLead(lead.id);
      fetchLeads();
      setDeleteModal(false);
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  const handleSaveLead = async (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const leadData = {
      first_name: data.get('first_name'),
      last_name: data.get('last_name'),
      request: data.get('request'),
      responsible_person: data.get('responsible_person'),
      status: data.get('status'),
      comment: data.get('comment'),
    };

    try {
      if (isEdit) {
        await updateLead(lead.id, leadData);
      } else {
        await createLead(leadData);
      }
      fetchLeads(); 
      setModal(false);
    } catch (error) {
      console.error('Error saving lead:', error);
    }
  };

  console.log(rows);
  

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteLead}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Leads Management" breadcrumbItem="Leads" />
          <Row className="mb-3">
            <Col>
              <Button
                color="success"
                className="btn-rounded waves-effect waves-light mb-2"
                onClick={handleAddClick}>
                Add Lead
              </Button>
            </Col>
          </Row>
          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <table {...getTableProps()} className="table">
                    <thead>
                      {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                          {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps(column.getSortByToggleProps())} key={column.id}>
                              {column.render('Header')}
                              <span>
                                {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                              </span>
                            </th>
                          ))}
                        </tr>
                      ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                      {rows.map(row => {
                        prepareRow(row);
                        return (
                          <tr {...row.getRowProps()} key={row.id}>
                            {row.cells.map(cell => (
                              <td {...cell.getCellProps()} key={cell.column.id}>{cell.render('Cell')}</td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Modal isOpen={modal} toggle={() => setModal(!modal)}>
            <ModalHeader toggle={() => setModal(!modal)}>{isEdit ? 'Edit Lead' : 'Add Lead'}</ModalHeader>
            <ModalBody>
              <Form onSubmit={handleSaveLead}>
                <Label for="first_name">First Name</Label>
                <Input id="first_name" name="first_name" defaultValue={lead ? lead.first_name : ''} required />
                <Label for="last_name">Last Name</Label>
                <Input id="last_name" name="last_name" defaultValue={lead ? lead.last_name : ''} required />
                <Label for="request">Request</Label>
                <Input id="request" name="request" defaultValue={lead ? lead.request : ''} required />
                <Label for="responsible_person">Responsible Person</Label>
                <Input id="responsible_person" name="responsible_person" defaultValue={lead ? lead.responsible_person : ''} required />
                <Label for="status">Status</Label>
                {/* <Input type="select" id="status" name="status" >
                  <option>Active</option>
                  <option>Closed</option>
                  <option>Problem</option>
                </Input> */}
                <Input
                  type="select"
                  name='status'
                  defaultValue={lead ? lead.status : 'Active'}
                >
                  <option value="Active">Active</option>
                  <option value="Closed">Closed</option>
                  <option value="Problem">Problem</option>
                </Input>
                <Label for="comment">Comment</Label>
                <Input type="textarea" id="comment" name="comment" defaultValue={lead ? lead.comment : ''} />
                <Button style={{marginTop:"10px"}} type="submit" color="primary">{isEdit ? 'Update Lead' : 'Add Lead'}</Button>
              </Form>
            </ModalBody>
          </Modal>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default LeadsPage;
