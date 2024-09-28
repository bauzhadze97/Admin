import React, { useEffect, useState } from "react";
import { Table, Button, Row, Col, Card, CardBody, CardTitle, CardSubtitle } from "reactstrap";

// Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { getUserAgreemnets } from "services/agreement";

const UserAgreements = () => {
  // Meta title
  document.title = "ხელშეკრულებები | Gorgia LLC";

  const [agreements, setAgreements] = useState([]);

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
                          <tr key={agreement.id} className={getRowClass(agreement.status)}>
                            <th scope="row">{index + 1}</th>
                            <td>{agreement.performer_name}</td>
                            <td>{agreement.service_description}</td>
                            <td>{agreement.contract_duration} დღე</td>
                            <td>
                              {agreement.status === "rejected" ? "უარყოფილია" :
                               agreement.status === "approved" ? "დადასტურებულია" : "მოლოდინში"}
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

export default UserAgreements;
