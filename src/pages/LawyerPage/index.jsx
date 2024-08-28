import React, { useState } from "react";

import {
  Card,
  CardBody,
  Col,
  Container,
  Form,
  Input,
  Label,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";

import classnames from "classnames";
import { Link } from "react-router-dom";

// Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

const LawyerPage = () => {
  // Meta title
  document.title = "ხელშეკრულების მოთხოვნის ფორმა - Georgia LLC";

  const [activeTab, setactiveTab] = useState(1);
  const [passedSteps, setPassedSteps] = useState([1]);

  function toggleTab(tab) {
    if (activeTab !== tab) {
      var modifiedSteps = [...passedSteps, tab];
      if (tab >= 1 && tab <= 3) { // Adjusted to have only 3 tabs
        setactiveTab(tab);
        setPassedSteps(modifiedSteps);
      }
    }
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs
            title="იურიდიული დეპარტამენტი"
            breadcrumbItem="ხელშეკრულების მოთხოვნის ფორმა"
          />

          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <h4 className="card-title mb-4">
                    განაცხადი მომსახურების ხელშეკრულების გასაფორმებლად
                  </h4>
                  <div className="wizard clearfix">
                    <div className="steps clearfix">
                      <ul>
                        <NavItem
                          className={classnames({ current: activeTab === 1 })}
                        >
                          <NavLink
                            className={classnames({ current: activeTab === 1 })}
                            onClick={() => {
                              setactiveTab(1);
                            }}
                            disabled={!(passedSteps || []).includes(1)}
                          >
                            <span className="number">1.</span> ინფორმაცია
                          </NavLink>
                        </NavItem>
                        <NavItem
                          className={classnames({ current: activeTab === 2 })}
                        >
                          <NavLink
                            className={classnames({ active: activeTab === 2 })}
                            onClick={() => {
                              setactiveTab(2);
                            }}
                            disabled={!(passedSteps || []).includes(2)}
                          >
                            <span className="number">2.</span> ხელშეკრულების საგანი და პირობები
                          </NavLink>
                        </NavItem>
                        <NavItem
                          className={classnames({ current: activeTab === 3 })}
                        >
                          <NavLink
                            className={classnames({ active: activeTab === 3 })}
                            onClick={() => {
                              setactiveTab(3);
                            }}
                            disabled={!(passedSteps || []).includes(3)}
                          >
                            <span className="number">3.</span> უშუალო ხელმძღვანელი
                          </NavLink>
                        </NavItem>
                      </ul>
                    </div>
                    <div className="content clearfix">
                      <TabContent activeTab={activeTab} className="body">
                        <TabPane tabId={1}>
                          <Form>
                            <Row>
                              <Col lg="6">
                                <div className="mb-3">
                                  <Label for="basicpill-firstname-input1">
                                    შემსრულებლის სრული დასახელება
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="basicpill-firstname-input1"
                                    placeholder="ჩაწერეთ შემსრულებლის სრული დასახელება..."
                                  />
                                </div>
                              </Col>
                              <Col lg="6">
                                <div className="mb-3">
                                  <Label for="basicpill-lastname-input2">
                                    საიდენტიფიკაციო კოდი ან პირადი ნომერი
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="basicpill-lastname-input2"
                                    placeholder="ჩაწერეთ საიდენტიფიკაციო კოდი ან პირადი ნომერი ..."
                                  />
                                </div>
                              </Col>
                            </Row>

                            <Row>
                              <Col lg="6">
                                <div className="mb-3">
                                  <Label for="basicpill-phoneno-input3">
                                    იურიდიული მისამართი / ფაქტიური მისამართი
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="basicpill-phoneno-input3"
                                    placeholder="ჩაწერეთ იურიდიული მისამართი/ფაქტიური მისამართი ..."
                                  />
                                </div>
                              </Col>
                              <Col lg="6">
                                <div className="mb-3">
                                  <Label for="basicpill-email-input4">
                                    საბანკო რეკვიზიტები
                                  </Label>
                                  <Input
                                    type="email"
                                    className="form-control"
                                    id="basicpill-email-input4"
                                    placeholder="ჩაწერეთ საბანკო რეკვიზიტები..."
                                  />
                                </div>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg="6">
                                <div className="mb-3">
                                  <Label for="basicpill-phoneno-input3">
                                    დირექტორი ან წარმომადგენელი (მინდობილობა)
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="basicpill-phoneno-input3"
                                    placeholder="დირექტორი ან წარმომადგენელი (მინდობილობა) ..."
                                  />
                                </div>
                              </Col>
                              <Col lg="6">
                                <div className="mb-3">
                                  <Label for="basicpill-email-input4">
                                    საკონტაქტო ინფორმაცია (ტელ, ელ-ფოსტა)
                                  </Label>
                                  <Input
                                    type="email"
                                    className="form-control"
                                    id="basicpill-email-input4"
                                    placeholder="საკონტაქტო ინფორმაცია (ტელ, ელ-ფოსტა)..."
                                  />
                                </div>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg="12">
                                <div className="mb-3">
                                  <Label for="basicpill-date-input1">
                                    ხელშეკრულების მოქმედების ვადის ათვლის პერიოდი
                                  </Label>
                                  <input
                                    type="date"
                                    id="basicpill-date-input1"
                                    className="form-control"
                                    defaultValue={new Date().toISOString().split('T')[0]}
                                  />
                                </div>
                              </Col>
                            </Row>
                          </Form>
                        </TabPane>
                        <TabPane tabId={2}>
                          <div>
                            <Form>
                              <Row>
                                <Col lg="6">
                                  <div className="mb-3">
                                    <Label for="basicpill-pancard-input5">
                                      მომსახურების საგანი
                                    </Label>
                                    <Input
                                      type="text"
                                      className="form-control"
                                      id="basicpill-pancard-input5"
                                      placeholder="ჩაწერეთ მომსახურების საგანი."
                                    />
                                  </div>
                                </Col>

                                <Col lg="6">
                                  <div className="mb-3">
                                    <Label for="basicpill-vatno-input6">
                                      მომსახურების ფასი/გადახდის პირობები/გადახდის განსხვავებული პირობები
                                    </Label>
                                    <Input
                                      type="text"
                                      className="form-control"
                                      id="basicpill-vatno-input6"
                                      placeholder="ჩაწერეთ მომსახურების ფასი/გადახდის პირობები/გადახდის განსხვავებული პირობები..."
                                    />
                                  </div>
                                </Col>
                              </Row>
                              <Row>
                                <Col lg="6">
                                  <div className="mb-3">
                                    <Label for="basicpill-cstno-input7">
                                      გადახდის პირობები/გადახდის განსხვავებული პირობები
                                    </Label>
                                    <Input
                                      type="text"
                                      className="form-control"
                                      id="basicpill-cstno-input7"
                                      placeholder="ჩაწერეთ გადახდის პირობები/გადახდის განსხვავებული პირობები..."
                                    />
                                  </div>
                                </Col>

                                <Col lg="6">
                                  <div className="mb-3">
                                    <Label for="basicpill-servicetax-input8">
                                      მომსახურების გაწევის ადგილი
                                    </Label>
                                    <Input
                                      type="text"
                                      className="form-control"
                                      id="basicpill-servicetax-input8"
                                      placeholder="ჩაწერეთ მომსახურების გაწევის ადგილი..."
                                    />
                                  </div>
                                </Col>
                              </Row>
                              <Row>
                                <Col lg="6">
                                  <div className="mb-3">
                                    <Label for="basicpill-companyuin-input9">
                                      ხელშეკრულების მოქმედების ვადა
                                    </Label>
                                    <Input
                                      type="text"
                                      className="form-control"
                                      id="basicpill-companyuin-input9"
                                      placeholder="ჩაწერეთ ხელშეკრულების მოქმედების ვადა..."
                                    />
                                  </div>
                                </Col>

                                <Col lg="6">
                                  <div className="mb-3">
                                    <Label for="basicpill-declaration-input10">
                                      ხელშეკრულების გაფორმების ინიციატორი და შესრულებაზე პასუხისმგებელი პირი
                                    </Label>
                                    <Input
                                      type="text"
                                      className="form-control"
                                      id="basicpill-Declaration-input10"
                                      placeholder="ჩაწერეთ ხელშეკრულების გაფორმების ინიციატორი და შესრულებაზე პასუხისმგებელი პირი..."
                                    />
                                  </div>
                                </Col>
                              </Row>
                            </Form>
                          </div>
                        </TabPane>
                        <TabPane tabId={3}>
                          <div className="row justify-content-center">
                            <Col lg="6">
                              <div className="text-center">
                                <div className="mb-4">
                                  <i className="mdi mdi-check-circle-outline text-success display-4" />
                                </div>
                                <div>
                                  <h5>Confirm Detail</h5>
                                  <p className="text-muted">
                                    If several languages coalesce, the grammar
                                    of the resulting
                                  </p>
                                </div>
                              </div>
                            </Col>
                          </div>
                        </TabPane>
                      </TabContent>
                    </div>
                    <div className="actions clearfix">
                      <ul>
                        <li
                          className={
                            activeTab === 1 ? "previous disabled" : "previous"
                          }
                        >
                          <Link
                            to="#"
                            onClick={() => {
                              toggleTab(activeTab - 1);
                            }}
                          >
                            წინა გვერდი
                          </Link>
                        </li>
                        <li
                          className={activeTab === 3 ? "next disabled" : "next"}
                        >
                          <Link
                            to="#"
                            onClick={() => {
                              toggleTab(activeTab + 1);
                            }}
                          >
                            შემდეგი გვერდი
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default LawyerPage;
