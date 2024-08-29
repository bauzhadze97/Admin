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

// Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { getDepartmentAgreements } from "services/agreement";

const HrPageApprove = () => {
  // Meta title
  document.title = "ვიზირება | Gorgia LLC";

  // State to manage expanded rows
  const [expandedRows, setExpandedRows] = useState([]);
  const [agreements, setAgreements] = useState([]);

  // Toggle row function
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
      // setError(err.response?.data?.message || "Error fetching agreements");
    }
  };

  useEffect(() => {
    fetchAgreements();
  }, [])

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="HR" breadcrumbItem="ვიზირების გვერდი" />

          <Row>
            <Col xl={12}>
              <Card>
                <CardBody>
                  <CardTitle className="h4">
                    ცნობების ვიზირების გვერდი
                  </CardTitle>
                  <CardSubtitle className="card-title-desc">
                    ვიზირების დადასტურების გვერდი ქვევით ნაჩვენებია მხოლოდ მიმდინარე
                    მოთხოვნილი ცნობები
                  </CardSubtitle>

                  <div className="table-responsive">
                    <Table className="table mb-0">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>მომთხოვნი პირი</th>
                          <th>მოთხოვნილი ფორმის სტილი</th>
                          <th>სამსახურის დაწყების თარიღი</th>
                          <th>ვიზირება</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[1, 2, 3].map((index) => (
                          <React.Fragment key={index}>
                            <tr
                              className="table-warning"
                              onClick={() => toggleRow(index)}
                              style={{ cursor: "pointer" }}
                            >
                              <th scope="row">{index}</th>
                              <td>მერაბი ბაუჟაძე</td>
                              <td>უხელფასო ცნობა სამსახურის შესახებ</td>
                              <td>29 აგვისტო 2024 წელი</td>
                              <td>
                                <Button
                                  type="button"
                                  color="success"
                                  style={{ marginRight: "10px" }}
                                >
                                  <i className="bx bx-check-double font-size-10 align-left me-2"></i>{" "}
                                  დადასტურება
                                </Button>
                                <Button type="button" color="danger">
                                  <i className="bx bx-block font-size-10 align-right me-2"></i>{" "}
                                  უარყოფა
                                </Button>
                              </td>
                            </tr>
                            {expandedRows.includes(index) && (
                              <tr>
                                <td colSpan="5">
                                  <div className="p-3">
                                    {/* Detailed data fields go here */}
                                    <p>დეტალური ინფორმაცია</p>
                                    <ul>
                                      <li>მიმდინარე პოზიცია: ვებ-დეველოპერი</li>
                                      <li>საიდენტიფიკაციო კოდი ან პირადი ნომერი: 61004065900</li>
                                      <li>იურიდიული მისამართი / ფაქტიური მისამართი: ანნა პოლიტკოვსკაია 3/31</li>
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

export default HrPageApprove;
