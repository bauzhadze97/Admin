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
  FormGroup,
  Button,
} from 'reactstrap';
import { useTable, usePagination, useSortBy } from 'react-table';
import DeleteModal from 'components/Common/DeleteModal';
import { getVipLeads, createVipLead, updateVipLead, deleteVipLead } from '../../services/vipLeadsService';
import Breadcrumbs from 'components/Common/Breadcrumb';

const VipLeadsPage = () => {
  const [vipLeads, setVipLeads] = useState([]);
  const [vipLead, setVipLead] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [modal, setModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  // Fetch VIP leads from the server
  const fetchVipLeads = async () => {
    try {
      const response = await getVipLeads();
      setVipLeads(response || []);
    } catch (error) {
      console.error('Error fetching VIP leads:', error);
      setVipLeads([]);
    }
  };

  useEffect(() => {
    fetchVipLeads();
  }, []);

  // Handle status change directly from the table
  const handleStatusChange = async (leadId, newStatus) => {
    const leadToUpdate = vipLeads.find(lead => lead.id === leadId);
    const updatedLead = { ...leadToUpdate, status: newStatus };
    try {
      await updateVipLead(leadId, updatedLead);
      console.log('Updated Lead:', updatedLead);
      fetchVipLeads();
    } catch (error) {
      console.error('Error updating lead status:', error);
    }
  };

  // Define table columns and actions, including the status dropdown
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
      ),
    },
  ], [vipLeads]);

  // Initialize table with pagination and sorting
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data: vipLeads }, useSortBy, usePagination);

  // Open modal for adding new VIP lead
  const handleAddClick = () => {
    setVipLead(null);
    setIsEdit(false);
    setModal(true);
  };

  // Open modal for editing an existing VIP lead
  const handleEditClick = (leadData) => {
    setVipLead(leadData);
    setIsEdit(true);
    setModal(true);
  };

  // Handle deletion of a VIP lead
  const handleDeleteClick = (leadData) => {
    setVipLead(leadData);
    setDeleteModal(true);
  };

  const handleDeleteVipLead = async () => {
    try {
      await deleteVipLead(vipLead.id);
      fetchVipLeads();
      setDeleteModal(false);
    } catch (error) {
      console.error('Error deleting VIP lead:', error);
    }
  };

  // Save new or edited VIP lead
  const handleSaveVipLead = async (event) => {
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
        await updateVipLead(vipLead.id, leadData);
      } else {
        await createVipLead(leadData);
      }
      fetchVipLeads();
      setModal(false);
    } catch (error) {
      console.error('Error saving VIP lead:', error);
    }
  };

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteVipLead}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="VIP Leads Management" breadcrumbItem="VIP Leads" />
          <Row className="mb-3">
            <Col>
              <Button
                color="success"
                className="btn-rounded waves-effect waves-light mb-2"
                onClick={handleAddClick}>
                Add VIP Lead
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
            <ModalHeader toggle={() => setModal(!modal)}>{isEdit ? 'Edit VIP Lead' : 'Add VIP Lead'}</ModalHeader>
            <ModalBody>
              <Form onSubmit={handleSaveVipLead}>
                <FormGroup>
                  <Label for="first_name">First Name</Label>
                  <Input id="first_name" name="first_name" defaultValue={vipLead ? vipLead.first_name : ''} required />
                </FormGroup>
                <FormGroup>
                  <Label for="last_name">Last Name</Label>
                  <Input id="last_name" name="last_name" defaultValue={vipLead ? vipLead.last_name : ''} required />
                </FormGroup>
                <FormGroup>
                  <Label for="request">Request</Label>
                  <Input id="request" name="request" defaultValue={vipLead ? vipLead.request : ''} required />
                </FormGroup>
                <FormGroup>
                  <Label for="responsible_person">Responsible Person</Label>
                  <Input id="responsible_person" name="responsible_person" defaultValue={vipLead ? vipLead.responsible_person : ''} required />
                </FormGroup>
                <FormGroup>
                  <Label for="status">Status</Label>
                  <Input
                    type="select"
                    name="status"
                    defaultValue={vipLead ? vipLead.status : 'Active'} 
                  >
                    <option value="Active">Active</option>
                    <option value="Closed">Closed</option>
                    <option value="Problem">Problem</option>
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label for="comment">Comment</Label>
                  <Input type="textarea" id="comment" name="comment" defaultValue={vipLead ? vipLead.comment : ''} />
                </FormGroup>
                <Button type="submit" color="primary">{isEdit ? 'Update VIP Lead' : 'Add VIP Lead'}</Button>
              </Form>
            </ModalBody>
          </Modal>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default VipLeadsPage;
