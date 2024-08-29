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
} from "reactstrap";

import Breadcrumbs from "../../components/Common/Breadcrumb";
import { getDepartmentAgreements, updateAgreementStatus } from "services/agreement";

const LawyerPageApprove = () => {
  document.title = "ვიზირება | Gorgia LLC";

  const [expandedRows, setExpandedRows] = useState([]);
  const [agreements, setAgreements] = useState([]);

  const toggleRow = (index) => {
    const isRowExpanded = expandedRows.includes(index);
    if (isRowExpanded) {
      setExpandedRows(expandedRows.filter((rowIndex) => rowIndex !== index));
    } else {
      setExpandedRows([...expandedRows, index]);
    }
  };

  const fetchAgreements = async () => {
    try {
      const response = await getDepartmentAgreements();
      setAgreements(response.data.data);
    } catch (err) {
      console.error("Error fetching agreements:", err);
    }
  };

  useEffect(() => {
    fetchAgreements();
  }, []);


  const handleUpdateStatus = async (agreementId, status) => {
    try {
      await updateAgreementStatus(agreementId, status);
        setAgreements((prevAgreements) => 
        prevAgreements.map((agreement) => 
          agreement.id === agreementId ? { ...agreement, status } : agreement
        )
      );
    } catch (err) {
      console.error("Error updating agreement status:", err);
    }
  };

  console.log(agreements);
  

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="ხელშეკრულებები" breadcrumbItem="ვიზირება" />

          <Row>
            <Col xl={12}>
              <Card>
                <CardBody>
                  <CardTitle className="h4">
                    ხელშეკრულებების ვიზირების გვერდი
                  </CardTitle>
                  <CardSubtitle className="card-title-desc">
                    ვიზირების დადასტურების გვერდი ქვევით ნაჩვენებია მხოლოდ მიმდინარე
                    მოთხოვნილი ვიზირებები
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
                          <React.Fragment key={agreement.id}>
                            <tr
                              className="table-warning"
                              onClick={() => toggleRow(index)}
                              style={{ cursor: "pointer" }}
                            >
                              <th scope="row">{index + 1}</th>
                              <td>{agreement.performer_name}</td>
                              <td>{agreement.service_description}</td>
                              <td>{agreement.contract_duration} დღე</td>
                              <td>
                                {agreement.status === 'rejected' ? (
                                  <Button color="danger" disabled>
                                    <i className="bx bx-block font-size-10 align-right me-2"></i>{" "}
                                    უარყოფილია
                                  </Button>
                                ) : agreement.status === 'approved' ? (
                                  <Button color="success" disabled>
                                    <i className="bx bx-check-double font-size-10 align-left me-2"></i>{" "}
                                    დადასტურებულია
                                  </Button>
                                ) : (
                                  <>
                                    <Button
                                      type="button"
                                      color="success"
                                      style={{ marginRight: "10px" }}
                                      onClick={() => handleUpdateStatus(agreement.id, 'approved')}
                                    >
                                      <i className="bx bx-check-double font-size-10 align-left me-2"></i>{" "}
                                      დადასტურება
                                    </Button>
                                    <Button
                                      type="button"
                                      color="danger"
                                      onClick={() => handleUpdateStatus(agreement.id, 'rejected')}
                                    >
                                      <i className="bx bx-block font-size-10 align-right me-2"></i>{" "}
                                      უარყოფა
                                    </Button>
                                  </>
                                )}
                              </td>
                            </tr>
                            {expandedRows.includes(index) && (
                              <tr>
                                <td colSpan="5">
                                  <div className="p-3">
                                    {/* Detailed data fields go here */}
                                    <p>დეტალური ინფორმაცია</p>
                                    <ul>
                                      <li>შემსრულებლის სრული დასახელება: {agreement.performer_name}</li>
                                      <li>საიდენტიფიკაციო კოდი ან პირადი ნომერი: {agreement.id_code_or_personal_number}</li>
                                      <li>იურიდიული მისამართი / ფაქტიური მისამართი: {agreement.legal_or_actual_address}</li>
                                      <li>საბანკო რეკვიზიტები: {agreement.bank_account_details}</li>
                                      <li>დირექტორი ან წარმომადგენელი (მინდობილობა): {agreement.representative_name}</li>
                                      <li>საკონტაქტო ინფორმაცია (ტელ, ელ-ფოსტა): {agreement.contact_info}</li>
                                      <li>ხელშეკრულების მოქმედების ვადის ათვლის პერიოდი: {agreement.contract_start_period}</li>
                                      <li>მომსახურების საგანი: {agreement.service_description}</li>
                                      <li>მომსახურების ფასი/გადახდის პირობები/გადახდის განსხვავებული პირობები: {agreement.service_price}</li>
                                      <li>გადახდის პირობები/გადახდის განსხვავებული პირობები: {agreement.payment_terms}</li>
                                      <li>მომსახურების გაწევის ადგილი: {agreement.service_location}</li>
                                      <li>ხელშეკრულების გაფორმების ინიციატორი და შესრულებაზე პასუხისმგებელი პირი: {agreement.contract_responsible_person}</li>
                                    </ul>
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

export default LawyerPageApprove;
