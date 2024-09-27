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
import { createTrip, getTripList } from '../../services/trip';
import { toast } from 'react-toastify';
import './index.css';
import SuccessPopup from 'components/SuccessPopup';

const BusinessPage = () => {
  // Meta title
  document.title = 'მივლინების მოთხოვნის ფორმა - Georgia LLC';

  const { t } = useTranslation();
  const [errors, setErrors] = useState({}); // State for validation errors
  const [list, setList] = useState([]);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)

  const [formData, setFormData] = useState({
    trip_type: 'regional',
    place_of_trip: '',
    expense_vocation: '',
    expense_transport: '',
    expense_living: '',
    expense_meal: '',
    total_expense: '',
    start_date: '',
    end_date: '',
    subtitle_user_name: '',
    subtitle_user_sur_name: '',
    business_trip_basis: '',
    purpose_of_trip: '',
    description: '',
    business_trip_arrangement: '',
    expected_result_business_trip: '',
  });

  useEffect(() => {
    const fetchList = async () => {
      try {
        const res = await getTripList();
        setList(res.data.business);
      } catch (err) {
        console.log(err);
      }
    };

    fetchList();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    validateField(name, value); 
  };

  const validateField = (field, value) => {
    let errorMsg = '';

    switch (field) {
      case 'place_of_trip':
        if (!value) errorMsg = 'მივლინების ადგილი აუცილებელია';
        break;
      case 'start_date':
        if (!value) errorMsg = 'დაწყების თარიღი აუცილებელია';
        break;
      case 'end_date':
        if (!value) errorMsg = 'დასრულების თარიღი აუცილებელია';
        break;
      case 'expense_vocation':
        if (!value || isNaN(value)) errorMsg = 'მივლინების ხარჯი უნდა იყოს ციფრი';
        break;
      case 'expense_transport':
        if (!value || isNaN(value)) errorMsg = 'ტრანსპორტი უნდა იყოს ციფრი';
        break;
      case 'expense_living':
        if (!value || isNaN(value)) errorMsg = 'საცხოვრებელი უნდა იყოს ციფრი';
        break;
      case 'expense_meal':
        if (!value || isNaN(value)) errorMsg = 'დღიური კვება უნდა იყოს ციფრი';
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      const res = await createTrip(formData);
      if (res) {
        setIsSuccessModalOpen(true)
        // setFormData({
        //   trip_type: 'regional',
        //   place_of_trip: '',
        //   expense_vocation: '',
        //   expense_transport: '',
        //   expense_living: '',
        //   expense_meal: '',
        //   total_expense: '',
        //   start_date: '',
        //   end_date: '',
        //   subtitle_user_name: '',
        //   subtitle_user_sur_name: '',
        //   business_trip_basis: '',
        //   purpose_of_trip: '',
        //   description: '',
        //   business_trip_arrangement: '',
        //   expected_result_business_trip: '',
        // })
      }
    } catch (err) {
      console.log(err);
    }
  };

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
      return 1;
    }
    return diffDays;
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="CRM" breadcrumbItem="მივლინების მოთხოვნის გვერდი" />
          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col lg="6">
                        <div className="mb-3">
                          <Label for="trip_type">მივლინების ტიპი</Label>
                          <Input
                            type="select"
                            name="trip_type"
                            id="trip_type"
                            value={formData.trip_type}
                            onChange={handleInputChange}
                          >
                            <option value="regional">მივლინება რეგიონში</option>
                            <option value="international">მივლინება საზღვარგარეთ</option>
                          </Input>
                        </div>
                      </Col>
                      <Col lg="6">
                        <div className="mb-3">
                          <Label for="subtitle_user_name">შემცვლელი პირის სახელი</Label>
                          <Input
                            type="text"
                            id="subtitle_user_name"
                            name="subtitle_user_name"
                            value={formData.subtitle_user_name}
                            onChange={handleInputChange}
                            placeholder="ჩაწერეთ შემცვლელი პირის სახელი..."
                          />
                          {errors.subtitle_user_name && (
                            <div className="text-danger">{errors.subtitle_user_name}</div>
                          )}
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <div className="mb-3">
                          <Label for="subtitle_user_sur_name">შემცვლელი პირის გვარი</Label>
                          <Input
                            type="text"
                            id="subtitle_user_sur_name"
                            name="subtitle_user_sur_name"
                            value={formData.subtitle_user_sur_name}
                            onChange={handleInputChange}
                            placeholder="ჩაწერეთ შემცვლელი პირის გვარი..."
                          />
                          {errors.subtitle_user_sur_name && (
                            <div className="text-danger">{errors.subtitle_user_sur_name}</div>
                          )}
                        </div>
                      </Col>
                      <Col lg="6">
                        <div className="mb-3">
                          <Label for="place_of_trip">მივლინების ადგილი</Label>
                          <Input
                            type="text"
                            id="place_of_trip"
                            name="place_of_trip"
                            value={formData.place_of_trip}
                            onChange={handleInputChange}
                            placeholder="ჩაწერეთ მივლინების ადგილი..."
                          />
                          {errors.place_of_trip && (
                            <div className="text-danger">{errors.place_of_trip}</div>
                          )}
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <div className="mb-3">
                          <Label for="purpose_of_trip">მივლინების მიზანი</Label>
                          <Input
                            type="textarea"
                            id="purpose_of_trip"
                            name="purpose_of_trip"
                            value={formData.purpose_of_trip}
                            onChange={handleInputChange}
                            placeholder="ჩაწერეთ მივლინების მიზანი..."
                          />
                          {errors.purpose_of_trip && (
                            <div className="text-danger">{errors.purpose_of_trip}</div>
                          )}
                        </div>
                      </Col>
                      <Col lg="6">
                        <div className="mb-3">
                          <Label for="expense_vocation">მივლინების ხარჯი</Label>
                          <Input
                            type="text"
                            id="expense_vocation"
                            name="expense_vocation"
                            value={formData.expense_vocation}
                            onChange={handleInputChange}
                            placeholder="ჩაწერეთ მივლინების ხარჯი..."
                          />
                          {errors.expense_vocation && (
                            <div className="text-danger">{errors.expense_vocation}</div>
                          )}
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <div className="mb-3">
                          <Label for="expense_transport">ტრანსპორტი (საკუთარი ავტომობილის შემთხვევაში საწვავისთვის საჭირო თანხა)</Label>
                          <Input
                            type="text"
                            id="expense_transport"
                            name="expense_transport"
                            value={formData.expense_transport}
                            onChange={handleInputChange}
                            placeholder="ჩაწერეთ ტრანსპორტის ხარჯი..."
                          />
                          {errors.expense_transport && (
                            <div className="text-danger">{errors.expense_transport}</div>
                          )}
                        </div>
                      </Col>
                      <Col lg="6">
                        <div className="mb-3">
                          <Label for="expense_living">საცხოვრებელი</Label>
                          <Input
                            type="text"
                            id="expense_living"
                            name="expense_living"
                            value={formData.expense_living}
                            onChange={handleInputChange}
                            placeholder="ჩაწერეთ საცხოვრებლის ხარჯი..."
                          />
                          {errors.expense_living && (
                            <div className="text-danger">{errors.expense_living}</div>
                          )}
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <div className="mb-3">
                          <Label for="expense_meal">დღიური კვება</Label>
                          <Input
                            type="text"
                            id="expense_meal"
                            name="expense_meal"
                            value={formData.expense_meal}
                            onChange={handleInputChange}
                            placeholder="ჩაწერეთ დღიური კვების ხარჯი..."
                          />
                          {errors.expense_meal && (
                            <div className="text-danger">{errors.expense_meal}</div>
                          )}
                        </div>
                      </Col>
                      <Col lg="6">
                        <div className="mb-3">
                          <Label for="total_expense">სრული ხარჯი</Label>
                          <Input
                            type="text"
                            id="total_expense"
                            name="total_expense"
                            value={formData.total_expense}
                            onChange={handleInputChange}
                            placeholder="ჩაწერეთ სრული ხარჯი..."
                          />
                          {errors.total_expense && (
                            <div className="text-danger">{errors.total_expense}</div>
                          )}
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <div className="mb-3">
                          <Label for="start_date">დაწყების თარიღი</Label>
                          <Input
                            type="date"
                            id="start_date"
                            name="start_date"
                            value={formData.start_date}
                            onChange={handleInputChange}
                          />
                          {errors.start_date && (
                            <div className="text-danger">{errors.start_date}</div>
                          )}
                        </div>
                      </Col>
                      <Col lg="6">
                        <div className="mb-3">
                          <Label for="end_date">დასრულების თარიღი</Label>
                          <Input
                            type="date"
                            id="end_date"
                            name="end_date"
                            value={formData.end_date}
                            onChange={handleInputChange}
                          />
                          {errors.end_date && (
                            <div className="text-danger">{errors.end_date}</div>
                          )}
                        </div>
                      </Col>
                    </Row>
                    <div style={{
                      width:"100%",
                      display:"flex",
                      justifyContent:"end"

                    }}>
                      <Button type="submit" color="primary">
                        {t('გაგზავნა')}
                      </Button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      {isSuccessModalOpen && (<SuccessPopup/>)}
    </React.Fragment>
  );
};

export default BusinessPage;
