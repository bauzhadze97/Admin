import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { createHrDocument, getHrDocuments, getCurrentUser } from "services/hrDocument";
import { fetchUser, updateUser } from "services/user";

const HrPage = () => {
  document.title = "ვიზირება | Gorgia LLC";

  const [hrDocuments, setHrDocuments] = useState([]);
  const [modal, setModal] = useState(false);
  const [expandedRows, setExpandedRows] = useState([]); // State to track expanded rows
  const [missingIdUser, setMissingIdUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [newIdNumber, setNewIdNumber] = useState(""); 

  const fetchCurrentUser = async () => {
    try {
      const response = await fetchUser();
      setCurrentUser(response.data);
    } catch (err) {
      console.error("Error fetching current user:", err);
    }
  };

  const fetchHrDocuments = async () => {
    try {
      const response = await getHrDocuments();
      setHrDocuments(response.data);
    } catch (err) {
      console.error("Error fetching HR documents:", err);
    }
  };

  useEffect(() => {
    fetchCurrentUser(); 
    fetchHrDocuments(); 
  }, []);

  const handleCreateDocument = async (type) => {
    if (!currentUser?.id_number) {
      setMissingIdUser(currentUser);
      setModal(true);
      return;
    }

    try {
      const documentName = type === "paid" ? "ხელფასიანი ცნობა" : "უხელფასო ცნობა";
      const response = await createHrDocument({ name: documentName });
      setHrDocuments([...hrDocuments, response.data]);
    } catch (err) {
      console.error("Error creating HR document:", err);
    }
  };

  const getRowClass = (status) => {
    switch (status) {
      case "rejected":
        return "table-danger";
      case "approved":
        return "table-success";
      case "in_progress":
        return "table-warning";
      default:
        return "";
    }
  };

  // Handle row click to toggle the expansion
  const handleRowClick = (index) => {
    const currentExpandedRows = expandedRows;
    const isRowExpanded = currentExpandedRows.includes(index);

    if (isRowExpanded) {
      setExpandedRows(currentExpandedRows.filter((id) => id !== index));
    } else {
      setExpandedRows([...currentExpandedRows, index]);
    }
  };

  const handleUpdateIdNumber = async () => {
    try {
      const updatedUser = { id_number: newIdNumber }; 
      await updateUser(updatedUser); 
      setCurrentUser({ ...currentUser, id_number: newIdNumber }); 
      setModal(false); 
      fetchHrDocuments(); 
    } catch (err) {
      console.error("Error updating ID number:", err);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="HR" breadcrumbItem="მოთხოვნილი ცნობები" />

          <Row>
            <Col xl={12}>
              <Card>
                <CardBody>
                  <CardTitle className="h4">მოთხოვნილი ცნობები</CardTitle>
                  {currentUser && (
                    <div className="mb-4">
                      <strong>Currently Logged In:</strong> {currentUser.name || "უცნობი"} (ID:{" "}
                      {currentUser.id_number || "უცნობი"})
                    </div>
                  )}
                  <CardSubtitle className="card-title-desc d-flex justify-content-between align-items-center">
                    <div>
                      ქვევით ნაჩვენებია უკვე დადასტურებული ან უარყოფილი მოთხოვნილი ცნობები
                    </div>
                    <div>
                      <Button
                        type="button"
                        color="primary"
                        className="me-1"
                        onClick={() => handleCreateDocument("paid")}
                      >
                        <i className="font-size-12 align-middle "></i> ხელფასიანი ცნობის მოთხოვნა
                      </Button>
                      <Button
                        type="button"
                        color="success"
                        onClick={() => handleCreateDocument("unpaid")}
                      >
                        <i className="font-size-12 align-middle"></i> უხელფასო ცნობის მოთხოვნა
                      </Button>
                    </div>
                  </CardSubtitle>

                  <div className="table-responsive">
                    <Table className="table mb-0">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>მომთხოვნი პირი</th>
                          <th>ID ნომერი</th>
                          <th>სამსახურის დაწყების თარიღი</th>
                          <th>ცნობის მოთხოვნის თარიღი</th>
                          <th>მოთხოვნილი ცნობის ფორმა</th>
                          <th>ვიზირება</th>
                        </tr>
                      </thead>
                      <tbody>
                        {hrDocuments.map((document, index) => (
                          <React.Fragment key={document.id}>
                            <tr
                              className={getRowClass(document.status)}
                              onClick={() => handleRowClick(index)}
                              style={{ cursor: "pointer" }}
                            >
                              <th scope="row">{index + 1}</th>
                              <td>{document.user?.name || "უცნობი"}</td>
                              <td>{document.user?.id_number || "უცნობი"}</td>
                              <td>
                                {document.user?.working_start_date
                                  ? new Date(document.user.working_start_date).toLocaleDateString("ka-GE")
                                  : "უცნობი"}
                              </td>
                              <td>
                                {document.created_at
                                  ? new Date(document.created_at).toLocaleDateString("ka-GE")
                                  : "უცნობი"}
                              </td>
                              <td>{document.name}</td>
                              <td>
                                {document.status === "rejected"
                                  ? "უარყოფილია"
                                  : document.status === "approved"
                                  ? "დადასტურებულია"
                                  : "მოლოდინში"}
                              </td>
                            </tr>

                            {/* Expandable row to show the comment */}
                            {expandedRows.includes(index) && (
                              <tr>
                                <td colSpan="7">
                                  <div className="p-3">
                                    <strong>კომენტარი:</strong>
                                    <p>{document.comment || "კომენტარი არ არის"}</p>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      {/* Modal for missing ID Number */}
      <Modal isOpen={modal} toggle={() => setModal(!modal)}>
        <ModalHeader toggle={() => setModal(!modal)}>
          პირადი ნომრის შეცდომა
        </ModalHeader>
        <ModalBody>
          {missingIdUser ? (
            <>
              <p>{missingIdUser.name} - ID ნომერი არ არსებობს.</p>
              <Input
                type="text"
                value={newIdNumber}
                onChange={(e) => setNewIdNumber(e.target.value)}
                placeholder="შეიყვანეთ ID ნომერი"
              />
            </>
          ) : (
            "ID ნომერი არ არსებობს, გთხოვთ შეავსოთ ID ნომერი, თქვენს პროფილზე"
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleUpdateIdNumber}>
            შენახვა
          </Button>
          <Button color="secondary" onClick={() => setModal(false)}>
            დახურვა
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default HrPage;
