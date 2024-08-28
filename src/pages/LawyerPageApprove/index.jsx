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

const LawyerPageApprove = () => {
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
                          <th>მომთხოვნი პირი</th>
                          <th>ხელშეკრულების სტილი</th>
                          <th>ხელშეკრულების მოქმედების ვადა</th>
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
                              <td>მომსახურების ხელშეკრულება</td>
                              <td>60 დღე</td>
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
                                      <li>შემსრულებლის სრული დასახელება: მერაბი ბაუჟაძე</li>
                                      <li>საიდენტიფიკაციო კოდი ან პირადი ნომერი: 61004065900</li>
                                      <li>იურიდიული მისამართი / ფაქტიური მისამართი: ანნა პოლიტკოვსკაია 3/31</li>
                                      <li>საბანკო რეკვიზიტები: GE18432796758174261268 </li>
                                      <li>დირექტორი ან წარმომადგენელი (მინდობილობა): მერაბი ბაუჟაძე</li>
                                      <li>საკონტაქტო ინფორმაცია (ტელ, ელ-ფოსტა): m.bauzhadze@gorgia.ge</li>
                                      <li>ხელშეკრულების მოქმედების ვადის ათვლის პერიოდი: 08/28/2024</li>
                                      <li>მომსახურების საგანი: ვებ-გვერდის დამზადება</li>
                                      <li>მომსახურების ფასი/გადახდის პირობები/გადახდის განსხვავებული პირობები: 9000₾</li>
                                      <li>გადახდის პირობები/გადახდის განსხვავებული პირობები: ყოველთვე 5000₾</li>
                                      <li>მომსახურების გაწევის ადგილი: თბილისი, დიდუბე</li>
                                      <li>ხელშეკრულების გაფორმების ინიციატორი და შესრულებაზე პასუხისმგებელი პირი: მერაბი ბაუჟაძე</li>
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
