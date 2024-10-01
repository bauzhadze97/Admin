import React, { useEffect, useState } from "react";
import { Table, Button, Row, Col, Card, CardBody } from "reactstrap";

// Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { getUserAgreemnets } from "services/agreement";

const UserAgreements = () => {
  document.title = "ხელშეკრულებები | Gorgia LLC";

  const [agreements, setAgreements] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);

  // Fetch the agreements from the API
  const fetchAgreements = async () => {
    try {
      const response = await getUserAgreemnets(); // Fetch user agreements
      setAgreements(response.data.data);
    } catch (err) {
      console.error("Error fetching agreements:", err);
    }
  };

  useEffect(() => {
    fetchAgreements();
  }, []);

  // Handle row expansion toggle
  const toggleRow = (index) => {
    const isRowExpanded = expandedRows.includes(index);
    if (isRowExpanded) {
      setExpandedRows(expandedRows.filter((rowIndex) => rowIndex !== index));
    } else {
      setExpandedRows([...expandedRows, index]);
    }
  };

  // Handle downloading the Word document
  const downloadDocument = (fileUrl) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = "agreement.docx"; // Set a default file name
    link.click();
  };

  // Determine the row class based on the agreement status
  const getRowClass = (status) => {
    switch (status) {
      case "rejected":
        return "table-danger";
      case "approved":
        return "table-success";
      case "pending":
        return "table-warning";
      default:
        return "";
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="ხელშეკრულებები" breadcrumbItem="ჩემი ხელშეკრულებები" />
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody>
                  <div className="table-responsive">
                    <Table className="table mb-0">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>შემსრულებელი</th>
                          <th>მომსახურების აღწერა</th>
                          <th>ხელშეკრულების ვადა</th>
                          <th>სტატუსი</th>
                        </tr>
                      </thead>
                      <tbody>
                        {agreements.map((agreement, index) => (
                          <React.Fragment key={agreement.id}>
                            <tr
                              className={getRowClass(agreement.status)}
                              onClick={() => toggleRow(index)}
                              style={{ cursor: "pointer" }}
                            >
                              <th scope="row">{index + 1}</th>
                              <td>{agreement.performer_name}</td>
                              <td>{agreement.service_description}</td>
                              <td>{agreement.contract_duration} დღე</td>
                              <td>
                                {agreement.status === "rejected"
                                  ? "უარყოფილია"
                                  : agreement.status === "approved"
                                  ? "დადასტურებულია"
                                  : "მოლოდინში"}
                              </td>
                            </tr>
                            {expandedRows.includes(index) && (
                              <tr>
                                <td colSpan="5">
                                  <div className="p-3">
                                    <p>დეტალური ინფორმაცია</p>
                                    <ul>
                                      <li>შემსრულებლის სრული დასახელება: {agreement.performer_name}</li>
                                      <li>საიდენტიფიკაციო კოდი ან პირადი ნომერი: {agreement.id_code_or_personal_number}</li>
                                      <li>იურიდიული მისამართი / ფაქტიური მისამართი: {agreement.legal_or_actual_address}</li>
                                      <li>საკონტაქტო ინფორმაცია: {agreement.contact_info}</li>
                                      <li>ხელშეკრულების დასაწყისი: {agreement.contract_start_period}</li>
                                      <li>მომსახურების ფასი: {agreement.service_price}</li>
                                    </ul>
                                    {agreement.status === "approved" && (
                                      <Button
                                        color="primary"
                                        onClick={() =>
                                          downloadDocument(`${process.env.REACT_APP_BASE_URL}/${agreement.file_path}`)
                                        }
                                      >
                                        ხელშეკრულების ჩამოტვირთვა
                                      </Button>
                                    )}
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
    </React.Fragment>
  );
};

export default UserAgreements;
