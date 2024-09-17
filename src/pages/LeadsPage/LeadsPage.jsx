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
} from '../../services/leadsService'; // Make sure these functions are implemented
import Breadcrumbs from 'components/Common/Breadcrumb';

const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [lead, setLead] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [modal, setModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await getLeads(); // Ensure this function is implemented correctly
        setLeads(response.data || []); // Provide a fallback to ensure we always set an array
      } catch (error) {
        console.error('Error fetching leads:', error);
        setLeads([]); // Ensure the state is always set to an array even in error
      }
    };
    fetchLeads();
  }, []);

  const columns = useMemo(() => [
    { Header: 'First Name', accessor: 'first_name' },
    { Header: 'Last Name', accessor: 'last_name' },
    { Header: 'Request', accessor: 'request' },
    { Header: 'Responsible Person', accessor: 'responsible_person' },
    { Header: 'Status', accessor: 'status' },
    { Header: 'Comment', accessor: 'comment' },
    {
      Header: 'Actions',
      id: 'actions', // unique ID for 'key' prop purposes
      Cell: ({ row }) => (
        <div className="d-flex gap-2">
          <Button color="primary" onClick={() => handleEditClick(row.original)}>
            Edit
          </Button>
          <Button color="danger" onClick={() => handleDeleteClick(row.original)}>
            Delete
          </Button>
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
  } = useTable({
    columns,
    data: leads
  }, useSortBy, usePagination);

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
    const formData = new FormData(event.target);
    const data = {
      first_name: formData.get('first_name'),
      last_name: formData.get('last_name'),
      request: formData.get('request'),
      responsible_person: formData.get('responsible_person'),
      status: formData.get('status'),
      comment: formData.get('comment'),
    };

    try {
      if (isEdit) {
        await updateLead(lead.id, data);
      } else {
        await createLead(data);
      }
      fetchLeads();
      setModal(false);
    } catch (error) {
      console.error('Error saving lead:', error);
    }
  };

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
                      {headerGroups.map((headerGroup, index) => (
                        <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                          {headerGroup.headers.map((column) => (
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
                      {rows.map((row, rowIndex) => {
                        prepareRow(row);
                        return (
                          <tr {...row.getRowProps()} key={rowIndex}>
                            {row.cells.map((cell, cellIndex) => (
                              <td {...cell.getCellProps()} key={cellIndex}>{cell.render('Cell')}</td>
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
                <Input type="select" id="status" name="status" defaultValue={lead ? lead.status : 'Active'}>
                  <option>Active</option>
                  <option>Closed</option>
                  <option>Problem</option>
                </Input>
                <Label for="comment">Comment</Label>
                <Input type="textarea" id="comment" name="comment" defaultValue={lead ? lead.comment : ''} />
                <Button type="submit" color="primary">{isEdit ? 'Update Lead' : 'Add Lead'}</Button>
              </Form>
            </ModalBody>
          </Modal>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default LeadsPage;
