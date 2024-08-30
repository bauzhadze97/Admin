import React, { useState, useEffect } from 'react';
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
import { createPurchase } from '../../services/vacation';
import { getApprovalVacations, getVacations } from '../../services/admin/vacation';
import { toast } from 'react-toastify';
import './index.css';

const VacationPage = () => {
  const { t } = useTranslation();
  const [userData, setUserData] = useState({});
  const [approvalList, setApprovalList] = useState([]);
  const [vacations, setVacations] = useState([]);
  const [formData, setFormData] = useState({
    name_and_surname: 'საბა დუმბაძე',
    start_date: '',
    end_date: '',
    type_of_vocations: '',
    reason: 'no need',
    monday: '',
    tuesday: '',
    wednesday: '',
    thursday: '',
    friday: '',
    saturday: '',
    sunday: '',
  });

  const holidays = [
    { name: 'ორშაბათი', value: 'monday' },
    { name: 'სამშაბათი', value: 'tuesday' },
    { name: 'ოთხშაბათი', value: 'wednesday' },
    { name: 'ხუთშაბათი', value: 'thursday' },
    { name: 'პარასკევი', value: 'friday' },
    { name: 'შაბათი', value: 'saturday' },
    { name: 'კვირა', value: 'sunday' },
  ];

  useEffect(() => {
    const fetchVacations = async () => {
      try {
        const res = await getVacations();
        setVacations(res.data.vocations);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchApprovals = async () => {
      try {
        const res = await getApprovalVacations({ type: 'vocation' });
        setApprovalList(res.data.approvalSteps);
      } catch (err) {
        console.error(err);
      }
    };

    fetchApprovals();
    fetchVacations();
  }, []);

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    if (type === 'checkbox') {
      if (checked) {
        setFormData({ ...formData, [name]: value });
      } else {
        setFormData({ ...formData, [name]: '' });
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const res = await createPurchase(formData);
      if (res) {
        toast.success('თქვენი მოთხოვნა წარმატებით გაიგზავნა!');
        // Clear form after submission
        setFormData({
          name_and_surname: 'საბა დუმბაძე',
          start_date: '',
          end_date: '',
          type_of_vocations: '',
          reason: 'no need',
          monday: '',
          tuesday: '',
          wednesday: '',
          thursday: '',
          friday: '',
          saturday: '',
          sunday: '',
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const calculateDuration = (startDate, endDate, restDays) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let totalDays = 0;

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dayOfWeek = d.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

      // Check if the current day is a rest day
      switch (dayOfWeek) {
        case 0:
          if (restDays.sunday !== 'yes') totalDays++;
          break;
        case 1:
          if (restDays.monday !== 'yes') totalDays++;
          break;
        case 2:
          if (restDays.tuesday !== 'yes') totalDays++;
          break;
        case 3:
          if (restDays.wednesday !== 'yes') totalDays++;
          break;
        case 4:
          if (restDays.thursday !== 'yes') totalDays++;
          break;
        case 5:
          if (restDays.friday !== 'yes') totalDays++;
          break;
        case 6:
          if (restDays.saturday !== 'yes') totalDays++;
          break;
        default:
          break;
      }
    }

    if (totalDays === 0) {
      return 1;
    }

    return totalDays;
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Admin" breadcrumbItem="Vacation Request" />

          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col lg="6">
                        <div className="mb-3">
                          <Label for="name_and_surname">სახელი და გვარი</Label>
                          <Input
                            type="text"
                            id="name_and_surname"
                            name="name_and_surname"
                            value={formData.name_and_surname}
                            onChange={handleInputChange}
                            placeholder="ჩაწერეთ თქვენი სახელი და გვარი..."
                          />
                        </div>
                      </Col>
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
                        </div>
                      </Col>
                    </Row>
                    <Row>
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
                        </div>
                      </Col>
                      <Col lg="6">
                        <div className="mb-3">
                          <Label for="type_of_vocations">შვებულების ტიპი</Label>
                          <Input
                            type="select"
                            id="type_of_vocations"
                            name="type_of_vocations"
                            value={formData.type_of_vocations}
                            onChange={handleInputChange}
                          >
                            <option value="">აირჩიე ტიპი</option>
                            <option value="paid">ანაზღაურებადი</option>
                            <option value="unpaid">ანაზღაურების გარეშე</option>
                            <option value="maternity">უხელფასო შვებულება ორსულობის, მშობიარობის და ბავშვის მოვლის გამო</option>
                            <option value="administrative">ადმინისტრაციული</option>
                          </Input>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="12">
                        <div className="mb-3">
                          <Label>დასვენების დღე/ები</Label>
                          <div className="d-flex flex-wrap">
                            {holidays.map((holiday, index) => (
                              <div className="form-check form-check-inline" key={index}>
                                <Input
                                  type="checkbox"
                                  id={holiday.value}
                                  name={holiday.value}
                                  value="yes"
                                  onChange={handleInputChange}
                                  className="form-check-input"
                                />
                                <Label className="form-check-label" for={holiday.value}>
                                  {holiday.name}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <Button type="submit" color="primary">
                      გაგზავნა
                    </Button>
                  </Form>

                  {/* Display the list of vacation requests */}
                  {/* <div className="w-[80%] h-[600px] overflow-y-auto pt-2 flex flex-col items-center">
                    {vacations.map((vacation, idx) => (
                      <RequestCard
                        key={idx}
                        type="შვებულება"
                        duration={calculateDuration(vacation.start_date, vacation.end_date, vacation) + ' დღე'}
                        startDay={vacation.start_date}
                        endDay={vacation.end_date}
                        status={vacation.status}
                      />
                    ))}
                  </div> */}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default VacationPage;
