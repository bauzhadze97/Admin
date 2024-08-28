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
import { createAgreement } from "services/agreement";

const LawyerPage = () => {
  // Meta title
  document.title = "ხელშეკრულების მოთხოვნის ფორმა - Georgia LLC";

  const [activeTab, setactiveTab] = useState(1);
  const [passedSteps, setPassedSteps] = useState([1]);
  const [errors, setErrors] = useState({}); // State for validation errors

  // State for form inputs
  const [formData, setFormData] = useState({
    user_id: "",
    performer_name: "",
    id_code_or_personal_number: "",
    legal_or_actual_address: "",
    bank_account_details: "",
    representative_name: "",
    contact_info: "",
    contract_start_period: new Date().toISOString().split('T')[0],
    service_description: "",
    service_price: "",
    payment_terms: "",
    service_location: "",
    contract_duration: "",
    contract_responsible_person: "",
  });

  // Handle input changes and validate on each change
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));

    validateField(id, value); // Validate the field on each change
  };

  // Function to validate a specific field
  const validateField = (field, value) => {
    let errorMsg = "";

    switch (field) {
      case "performer_name":
        if (!value) errorMsg = "შემსრულებლის სრული დასახელება აუცილებელია";
        break;
      case "id_code_or_personal_number":
        if (!value) errorMsg = "საიდენტიფიკაციო კოდი ან პირადი ნომერი აუცილებელია";
        break;
      case "legal_or_actual_address":
        if (!value) errorMsg = "იურიდიული მისამართი / ფაქტიური მისამართი აუცილებელია";
        break;
      case "bank_account_details":
        if (!value) errorMsg = "საბანკო რეკვიზიტები აუცილებელია";
        break;
      case "contact_info":
        if (!value) errorMsg = "საკონტაქტო ინფორმაცია (ტელ, ელ-ფოსტა) აუცილებელია";
        break;
      case "contract_start_period":
        if (!value) errorMsg = "ხელშეკრულების მოქმედების ვადის ათვლის პერიოდი აუცილებელია";
        break;
      case "service_description":
        if (!value) errorMsg = "მომსახურების საგანი აუცილებელია";
        break;
      case "service_price":
        if (!value || isNaN(value)) errorMsg = "მომსახურების ფასი უნდა იყოს ციფრი";
        break;
      case "payment_terms":
        if (!value) errorMsg = "გადახდის პირობები/გადახდის განსხვავებული პირობები აუცილებელია";
        break;
      case "service_location":
        if (!value) errorMsg = "მომსახურების გაწევის ადგილი აუცილებელია";
        break;
      case "contract_duration":
        if (!value) errorMsg = "ხელშეკრულების მოქმედების ვადა აუცილებელია";
        break;
      case "contract_responsible_person":
        if (!value) errorMsg = "ხელშეკრულების გაფორმების ინიციატორი და შესრულებაზე პასუხისმგებელი პირი აუცილებელია";
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: errorMsg,
    }));
  };

  // Function to validate all form data before submission
  const validateForm = () => {
    const newErrors = {};

    Object.keys(formData).forEach((field) => {
      validateField(field, formData[field]);
    });

    return Object.keys(newErrors).length === 0;
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const response = await createAgreement(formData);

      setFormData({
        user_id: "",
        performer_name: "",
        id_code_or_personal_number: "",
        legal_or_actual_address: "",
        bank_account_details: "",
        representative_name: "",
        contact_info: "",
        contract_start_period: new Date().toISOString().split('T')[0],
        service_description: "",
        service_price: "",
        payment_terms: "",
        service_location: "",
        contract_duration: "",
        contract_responsible_person: "",
      });

      setactiveTab(3);
      setPassedSteps((prevSteps) => [...prevSteps, 3]);
      setErrors({}); // Clear errors after successful submission
    } catch (error) {
      console.error("Error creating agreement:", error);
      alert("Error creating agreement. Please try again.");
    }
  };

  // Modified toggleTab function
  function toggleTab(tab) {
    if (activeTab !== tab) {
      if (tab === 3 && activeTab === 2) {
        handleSubmit();
      } else {
        var modifiedSteps = [...passedSteps, tab];
        if (tab >= 1 && tab <= 3) {
          setactiveTab(tab);
          setPassedSteps(modifiedSteps);
        }
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
                                  <Label for="performer_name">
                                    შემსრულებლის სრული დასახელება
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="performer_name"
                                    value={formData.performer_name}
                                    onChange={handleInputChange}
                                    placeholder="ჩაწერეთ შემსრულებლის სრული დასახელება..."
                                  />
                                  {errors.performer_name && (
                                    <div className="text-danger mt-1">{errors.performer_name}</div>
                                  )}
                                </div>
                              </Col>
                              <Col lg="6">
                                <div className="mb-3">
                                  <Label for="id_code_or_personal_number">
                                    საიდენტიფიკაციო კოდი ან პირადი ნომერი
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="id_code_or_personal_number"
                                    value={formData.id_code_or_personal_number}
                                    onChange={handleInputChange}
                                    placeholder="ჩაწერეთ საიდენტიფიკაციო კოდი ან პირადი ნომერი ..."
                                  />
                                  {errors.id_code_or_personal_number && (
                                    <div className="text-danger mt-1">{errors.id_code_or_personal_number}</div>
                                  )}
                                </div>
                              </Col>
                            </Row>

                            <Row>
                              <Col lg="6">
                                <div className="mb-3">
                                  <Label for="legal_or_actual_address">
                                    იურიდიული მისამართი / ფაქტიური მისამართი
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="legal_or_actual_address"
                                    value={formData.legal_or_actual_address}
                                    onChange={handleInputChange}
                                    placeholder="ჩაწერეთ იურიდიული მისამართი/ფაქტიური მისამართი ..."
                                  />
                                  {errors.legal_or_actual_address && (
                                    <div className="text-danger mt-1">{errors.legal_or_actual_address}</div>
                                  )}
                                </div>
                              </Col>
                              <Col lg="6">
                                <div className="mb-3">
                                  <Label for="bank_account_details">
                                    საბანკო რეკვიზიტები
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="bank_account_details"
                                    value={formData.bank_account_details}
                                    onChange={handleInputChange}
                                    placeholder="ჩაწერეთ საბანკო რეკვიზიტები..."
                                  />
                                  {errors.bank_account_details && (
                                    <div className="text-danger mt-1">{errors.bank_account_details}</div>
                                  )}
                                </div>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg="6">
                                <div className="mb-3">
                                  <Label for="representative_name">
                                    დირექტორი ან წარმომადგენელი (მინდობილობა)
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="representative_name"
                                    value={formData.representative_name}
                                    onChange={handleInputChange}
                                    placeholder="დირექტორი ან წარმომადგენელი (მინდობილობა) ..."
                                  />
                                  {errors.representative_name && (
                                    <div className="text-danger mt-1">{errors.representative_name}</div>
                                  )}
                                </div>
                              </Col>
                              <Col lg="6">
                                <div className="mb-3">
                                  <Label for="contact_info">
                                    საკონტაქტო ინფორმაცია (ტელ, ელ-ფოსტა)
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="contact_info"
                                    value={formData.contact_info}
                                    onChange={handleInputChange}
                                    placeholder="საკონტაქტო ინფორმაცია (ტელ, ელ-ფოსტა)..."
                                  />
                                  {errors.contact_info && (
                                    <div className="text-danger mt-1">{errors.contact_info}</div>
                                  )}
                                </div>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg="12">
                                <div className="mb-3">
                                  <Label for="contract_start_period">
                                    ხელშეკრულების მოქმედების ვადის ათვლის პერიოდი
                                  </Label>
                                  <input
                                    type="date"
                                    id="contract_start_period"
                                    className="form-control"
                                    value={formData.contract_start_period}
                                    onChange={handleInputChange}
                                  />
                                  {errors.contract_start_period && (
                                    <div className="text-danger mt-1">{errors.contract_start_period}</div>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Form>
                        </TabPane>
                        <TabPane tabId={2}>
                          <Form>
                            <Row>
                              <Col lg="6">
                                <div className="mb-3">
                                  <Label for="service_description">
                                    მომსახურების საგანი
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="service_description"
                                    value={formData.service_description}
                                    onChange={handleInputChange}
                                    placeholder="ჩაწერეთ მომსახურების საგანი."
                                  />
                                  {errors.service_description && (
                                    <div className="text-danger mt-1">{errors.service_description}</div>
                                  )}
                                </div>
                              </Col>
                              <Col lg="6">
                                <div className="mb-3">
                                  <Label for="service_price">
                                    მომსახურების ფასი
                                  </Label>
                                  <Input
                                    type="number"
                                    className="form-control"
                                    id="service_price"
                                    value={formData.service_price}
                                    onChange={handleInputChange}
                                    placeholder="ჩაწერეთ მომსახურების ფასი..."
                                  />
                                  {errors.service_price && (
                                    <div className="text-danger mt-1">{errors.service_price}</div>
                                  )}
                                </div>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg="6">
                                <div className="mb-3">
                                  <Label for="payment_terms">
                                    გადახდის პირობები/გადახდის განსხვავებული პირობები
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="payment_terms"
                                    value={formData.payment_terms}
                                    onChange={handleInputChange}
                                    placeholder="ჩაწერეთ გადახდის პირობები/გადახდის განსხვავებული პირობები..."
                                  />
                                  {errors.payment_terms && (
                                    <div className="text-danger mt-1">{errors.payment_terms}</div>
                                  )}
                                </div>
                              </Col>
                              <Col lg="6">
                                <div className="mb-3">
                                  <Label for="service_location">
                                    მომსახურების გაწევის ადგილი
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="service_location"
                                    value={formData.service_location}
                                    onChange={handleInputChange}
                                    placeholder="ჩაწერეთ მომსახურების გაწევის ადგილი..."
                                  />
                                  {errors.service_location && (
                                    <div className="text-danger mt-1">{errors.service_location}</div>
                                  )}
                                </div>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg="6">
                                <div className="mb-3">
                                  <Label for="contract_duration">
                                    ხელშეკრულების მოქმედების ვადა
                                  </Label>
                                  <Input
                                    type="date"
                                    className="form-control"
                                    id="contract_duration"
                                    value={formData.contract_duration}
                                    onChange={handleInputChange}
                                  />
                                  {errors.contract_duration && (
                                    <div className="text-danger mt-1">{errors.contract_duration}</div>
                                  )}
                                </div>
                              </Col>
                              <Col lg="6">
                                <div className="mb-3">
                                  <Label for="contract_responsible_person">
                                    ხელშეკრულების გაფორმების ინიციატორი და შესრულებაზე პასუხისმგებელი პირი
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="contract_responsible_person"
                                    value={formData.contract_responsible_person}
                                    onChange={handleInputChange}
                                    placeholder="ჩაწერეთ ხელშეკრულების გაფორმების ინიციატორი და შესრულებაზე პასუხისმგებელი პირი..."
                                  />
                                  {errors.contract_responsible_person && (
                                    <div className="text-danger mt-1">{errors.contract_responsible_person}</div>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Form>
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
                                    Review and confirm your agreement details before submission.
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
