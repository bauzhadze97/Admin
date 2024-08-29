import React, { useEffect, useState } from "react";
import { Table, Button, Row, Col, Card, CardBody, CardTitle, CardSubtitle } from "reactstrap";

// Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { getDepartmentAgreements } from "services/agreement"; // Import your service function

const LawyerPageArchive = () => {
  // Meta title
  document.title = "ვიზირება | Gorgia LLC";

  const [agreements, setAgreements] = useState([]);

  // Fetch the agreements from the API
  const fetchAgreements = async () => {
    try {
      const response = await getDepartmentAgreements(); // Adjust this to your specific API call
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
          <Breadcrumbs title="ხელშეკრულებები" breadcrumbItem="არქივი" />

          <Row>
            <Col xl={12}>
              <Card>
                <CardBody>
                  <CardTitle className="h4">ხელშეკრულებების არქივი </CardTitle>
                  <CardSubtitle className="card-title-desc">
                    ქვევით ნაჩვენებია უკვე დადასტურებული ან უარყოფილი მოთხოვნილი ხელშეკრულებები
                  </CardSubtitle>

                  <div className="table-responsive">
                    <Table className="table mb-0">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>შემსრულებელი</th>
                          <th>მომსახურების აღწერა</th>
                          <th>ხელშეკრულების ვადა</th>
                          <th>ვიზირება</th>
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

export default LawyerPageArchive;
