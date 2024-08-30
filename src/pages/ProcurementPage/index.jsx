import React, { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  Col,
  Container,
  Form,
  Input,
  Label,
  Row,
  Button,
} from 'reactstrap';
import { useTranslation } from 'react-i18next';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { getPurchaseList, createPurchase } from '../../services/purchase';
import { getDepartments, getPurchaseDepartments } from '../../services/auth';
import { toast } from 'react-toastify';
import RequestCard from '../../components/Vacation/RequestCard';
import './index.css';

const ProcurementPage = () => {
  const { t } = useTranslation();
  const [purchases, setPurchases] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    department_purchase_id: '',
    objective: '',
    deadline: '',
    short_period_reason: '',
    requested_procurement_object_exceed: '',
    stock_purpose: '',
    delivery_address: '',
    brand_model: '',
    alternative: '',
    competetive_price: '',
    who_pay_amount: '',
    name_surname_of_employee: '',
    reason: '',
    planned_next_month: '',
  });

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await getPurchaseList();
        setPurchases(res.data.internal_purchases);
      } catch (err) {
        console.log(err);
      }
    };

    fetchRequests();

    const fetchDepartments = async () => {
      let departmentsArray = [];
      try {
        const res = await getDepartments();
        departmentsArray = [...departmentsArray, ...res.data.departments];
      } catch (err) {
        console.error(err);
      } finally {
        setDepartments(departmentsArray);
      }
    };

    const fetchPurchaseDepartments = async () => {
      let departmentsArray = [];
      try {
        const res = await getPurchaseDepartments();
        departmentsArray = [...departmentsArray, ...res.data.departments];
      } catch (err) {
        console.error(err);
      } finally {
        setDepartments((prevDepartments) => [...prevDepartments, ...departmentsArray]);
      }
    };

    fetchDepartments();
    fetchPurchaseDepartments();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const res = await createPurchase(formData);

      if (res) {
        toast.success('თქვენი მოთხოვნა წარმატებით გაიგზავნა!');
        setFormData({
          department_purchase_id: '',
          objective: '',
          deadline: '',
          short_period_reason: '',
          requested_procurement_object_exceed: '',
          stock_purpose: '',
          delivery_address: '',
          brand_model: '',
          alternative: '',
          competetive_price: '',
          who_pay_amount: '',
          name_surname_of_employee: '',
          reason: '',
          planned_next_month: '',
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Admin" breadcrumbItem="Daily Report" />

          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <h4>{t("internal purchasment")}</h4>
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col lg="6">
                        <div className="mb-3">
                          <Label for="department_purchase_id">დეპარტამენტი</Label>
                          <Input
                            type="select"
                            id="department_purchase_id"
                            name="department_purchase_id"
                            value={formData.department_purchase_id}
                            onChange={handleInputChange}
                          >
                            <option value="">აირჩიეთ დეპარტამენტი</option>
                            {departments.map((dep) => (
                              <option key={dep.id} value={dep.id}>
                                {dep.name}
                              </option>
                            ))}
                          </Input>
                        </div>
                      </Col>
                      <Col lg="6">
                        <div className="mb-3">
                          <Label for="objective">ზოგადად აღწერეთ რა არის შესყიდვის ობიექტი?</Label>
                          <Input
                            type="text"
                            id="objective"
                            name="objective"
                            value={formData.objective}
                            onChange={handleInputChange}
                          />
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <div className="mb-3">
                          <Label for="deadline">რა ვადაში ითხოვთ შესყიდვის ობიექტის მიღებას?</Label>
                          <Input
                            type="date"
                            id="deadline"
                            name="deadline"
                            value={formData.deadline}
                            onChange={handleInputChange}
                          />
                        </div>
                      </Col>
                      <Col lg="6">
                        <div className="mb-3">
                          <Label for="short_period_reason">
                            თუ შესყიდვის ობიექტის მიღებისთვის ითხოვთ მცირე ვადას, განმარტეთ მიზეზი:
                          </Label>
                          <Input
                            type="text"
                            id="short_period_reason"
                            name="short_period_reason"
                            value={formData.short_period_reason}
                            onChange={handleInputChange}
                          />
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <div className="mb-3">
                          <Label for="requested_procurement_object_exceed">
                            ხომ არ აღემატება მოთხოვნილი შესყიდვის ობიექტი საჭიროებებს?
                          </Label>
                          <Input
                            type="text"
                            id="requested_procurement_object_exceed"
                            name="requested_procurement_object_exceed"
                            value={formData.requested_procurement_object_exceed}
                            onChange={handleInputChange}
                          />
                        </div>
                      </Col>
                      <Col lg="6">
                        <div className="mb-3">
                          <Label for="stock_purpose">იქმნება თუ არა მარაგი და რა მიზნით?</Label>
                          <Input
                            type="text"
                            id="stock_purpose"
                            name="stock_purpose"
                            value={formData.stock_purpose}
                            onChange={handleInputChange}
                          />
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <div className="mb-3">
                          <Label for="delivery_address">მიწოდების ადგილი (მისამართი)</Label>
                          <Input
                            type="text"
                            id="delivery_address"
                            name="delivery_address"
                            value={formData.delivery_address}
                            onChange={handleInputChange}
                          />
                        </div>
                      </Col>
                      <Col lg="6">
                        <div className="mb-3">
                          <Label for="reason">რით არის განპირობებული შესყიდვის საჭიროება?</Label>
                          <Input
                            type="text"
                            id="reason"
                            name="reason"
                            value={formData.reason}
                            onChange={handleInputChange}
                          />
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <div className="mb-3">
                          <Label for="brand_model">
                            სპეციფიურობის გათვალისწინებით მიუთითეთ მარკა, მოდელი, ნიშანდება
                          </Label>
                          <Input
                            type="text"
                            id="brand_model"
                            name="brand_model"
                            value={formData.brand_model}
                            onChange={handleInputChange}
                          />
                        </div>
                      </Col>
                      <Col lg="6">
                        <div className="mb-3">
                          <Label for="alternative">
                            დასაშვებია თუ არა შესყიდვის ობიექტის ალტერნატივა?
                          </Label>
                          <Input
                            type="text"
                            id="alternative"
                            name="alternative"
                            value={formData.alternative}
                            onChange={handleInputChange}
                          />
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <div className="mb-3">
                          <Label for="competetive_price">
                            მიუთითეთ ინფორმაცია მიმწოდებლის შესახებ, კონკურენტული ფასი
                          </Label>
                          <Input
                            type="text"
                            id="competetive_price"
                            name="competetive_price"
                            value={formData.competetive_price}
                            onChange={handleInputChange}
                          />
                        </div>
                      </Col>
                      <Col lg="6">
                        <div className="mb-3">
                          <Label for="planned_next_month">
                            იგეგმება თუ არა უახლოეს 1 თვეში ანალოგიური პროდუქციის შესყიდვა?
                          </Label>
                          <Input
                            type="text"
                            id="planned_next_month"
                            name="planned_next_month"
                            value={formData.planned_next_month}
                            onChange={handleInputChange}
                          />
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <div className="mb-3">
                          <Label for="who_pay_amount">ვინ ანაზღაურებს ამ თანხას?</Label>
                          <Input
                            type="text"
                            id="who_pay_amount"
                            name="who_pay_amount"
                            value={formData.who_pay_amount}
                            onChange={handleInputChange}
                          />
                        </div>
                      </Col>
                      <Col lg="6">
                        <div className="mb-3">
                          <Label for="name_surname_of_employee">
                            თანამშრომლის სახელი გვარი, რომელიც მარკეტში/საწყობში ჩაიბარებს ნივთს
                          </Label>
                          <Input
                            type="text"
                            id="name_surname_of_employee"
                            name="name_surname_of_employee"
                            value={formData.name_surname_of_employee}
                            onChange={handleInputChange}
                          />
                        </div>
                      </Col>
                    </Row>
                    <Button type="submit" color="primary">
                      გაგზავნა
                    </Button>
                  </Form>

                  {/* Display the list of purchase requests */}
                  <div className="w-[80%] flex flex-col justify-center items-center">
                    {purchases.map((purchase, idx) => (
                      <RequestCard
                        key={idx}
                        type={t("internal_purchasment")}
                        location={purchase.delivery_address}
                        endDay={purchase.deadline}
                        status={purchase.status}
                      />
                    ))}
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

export default ProcurementPage;
