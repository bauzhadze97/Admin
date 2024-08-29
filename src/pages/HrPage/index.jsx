import React, { useEffect, useState } from "react";
import { Table, Button, Row, Col, Card, CardBody, CardTitle, CardSubtitle } from "reactstrap";

// Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { createHrDocument, getHrDocuments } from "services/hrDocument";

// Import the service functions for creating and fetching HR documents

const HrPage = () => {
  // Meta title
  document.title = "ვიზირება | Gorgia LLC";

  // State to hold the list of HR documents
  const [hrDocuments, setHrDocuments] = useState([]);

  // Fetch HR documents when the component mounts
  const fetchHrDocuments = async () => {
    try {
      const response = await getHrDocuments();
      setHrDocuments(response.data);
    } catch (err) {
      console.error("Error fetching HR documents:", err);
    }
  };

  useEffect(() => {
    fetchHrDocuments();
  }, []);

  const handleCreateDocument = async (type) => {
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
                          <th>სამსახურის დაწყების თარიღი</th>
                          <th>ცნობის მოთხოვნის თარიღი</th>
                          <th>მოთხოვნილი ცნობის ფორმა</th>
                          <th>ვიზირება</th>
                        </tr>
                      </thead>
                      <tbody>
                        {hrDocuments.map((document, index) => (
                          <tr key={document.id} className={getRowClass(document.status)}>
                            <th scope="row">{index + 1}</th>
                            <td>{document.user?.name || "უცნობი"}</td>
                            <td>{document.user?.working_start_date ? new Date(document.user.working_start_date).toLocaleDateString("ka-GE") : "უცნობი"}</td>
                            <td>{document.created_at ? new Date(document.created_at).toLocaleDateString("ka-GE") : "უცნობი"}</td>
                            <td>{document.name}</td>
                            <td>
                              {document.status === "rejected" ? "უარყოფილია" :
                               document.status === "approved" ? "დადასტურებულია" : "მოლოდინში"}
                            </td>
                          </tr>
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

export default HrPage;
