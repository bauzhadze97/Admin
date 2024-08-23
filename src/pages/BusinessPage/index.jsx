import React, { useEffect, useState } from 'react';
import RequestCard from '../../components/Vacation/RequestCard';
import Profile from '../../components/Profile';
import Navigation from '../../components/Navigation';
import {
  Breadcrumbs,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

import './index.css';
import { useSelector } from 'react-redux';
import { createTrip, getTripList } from '../../services/trip';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import store from '../../store'

const BusinessPage = () => {
  const { t } = useTranslation()
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [list, setList] = useState([]);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    if(store.getState().user && store.getState().user.data) {
      setUserData(store.getState().user.data )
    }
  }, [store.getState().user.data])

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
    expected_result_business_trip: ''
  });

  useEffect(() => {
    const fetchList = async () => {
      try {
        const res = await getTripList();

        setList(res.data.business);
      } catch(err) {
        console.log(err);
      }
    }

    fetchList();
  },[])

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    if (type === 'checkbox') {
      if (checked) {
        setFormData((prevData) => ({
          ...prevData,
          holiday: [...prevData.holiday, value],
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          holiday: prevData.holiday.filter((holiday) => holiday !== value),
        }));
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    if(diffDays === 0) {
      return 1;
    }
    return diffDays;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const res = await createTrip(formData);

      if(res) {
        toast.success("თქვენი მოთხოვნა წარმატებით გაიგზავნა!");
        window.location.reload();
        closeModal();
      }
    } catch (err) {
      console.log(err)
    }
  
  }
  console.log(formData)
  return (
    <div className="page-content">
            <div className="container-fluid">
                <Breadcrumbs title="Admin" breadcrumbItem="Daily Report" />
    <div className="vacation-dashboard-container">
      <Dialog
          open={modalIsOpen}
          onClose={closeModal}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <DialogTitle id="modal-title">Business Trip Request</DialogTitle>
          <DialogContent>
            <DialogContentText id="modal-description">
              <form onSubmit={handleSubmit}>
                <div className='vacation-form-wrapper'>
                  <label>მივლინების ტიპი</label>
                  <select name="trip_type" onChange={handleInputChange}>
                    <option value="regional" selected={formData.trip_type === 'regional'}>მივლინება რეგიონში</option>
                    <option value="international" selected={formData.trip_type === 'international'}>მივლინება საზღვარგარეთ</option>
                  </select>
                </div>
                {
                    formData.trip_type === 'regional' ? (
                        <>
                                 <div className='vacation-form-wrapper'>
                                    <label>შემცვლელი პირის სახელი</label>
                                    <input type="text" name="subtitle_user_name" onChange={handleInputChange} value={formData.subtitle_user_name} />
                                </div>
                                <div className='vacation-form-wrapper'>
                                    <label>შემცვლელი პირის გვარი</label>
                                    <input type="text" name="subtitle_user_sur_name" onChange={handleInputChange} value={formData.subtitle_user_sur_name} />
                                </div>
                                <div className='vacation-form-wrapper'>
                                    <label>მივლინების ადგილი</label>
                                    <input type="text" name="place_of_trip" onChange={handleInputChange} value={formData.place_of_trip} />
                                </div>
                                <div className='vacation-form-wrapper'>
                                    <label>მივლინების მიზანი</label>
                                    <textarea className="border border-black rounded-2xl p-1" name="purpose_of_trip" onChange={handleInputChange} id=""></textarea>
                                    {/* <input type="text" name="purpose_of_trip"  value={formData.purpose_of_trip} /> */}
                                </div>
                                <div className='vacation-form-wrapper'>
                                    <label>მივლინების ხარჯი</label>
                                    <input type="text" name="expense_vocation" onChange={handleInputChange} value={formData.expense_vocation} />
                                </div>
                                <div className='vacation-form-wrapper'>
                                    <label>ტრანსპორტი (საკუთარი ავტომობილის შემთხვევაში საწვავისთვის საჭირო თანხა)</label>
                                    <input type="text" name="expense_transport" onChange={handleInputChange} value={formData.expense_transport} />
                                </div>
                                <div className='vacation-form-wrapper'>
                                    <label>საცხოვრებელი</label>
                                    <input type="text" name="expense_living" onChange={handleInputChange} value={formData.expense_living} />
                                </div>
                                <div className='vacation-form-wrapper'>
                                    <label>დღიური კვება</label>
                                    <input type="text" name="expense_meal" onChange={handleInputChange} value={formData.expense_meal} />
                                </div>
                                <div className='vacation-form-wrapper'>
                                    <label>სრული ხარჯი</label>
                                    <input type="text" name="total_expense" onChange={handleInputChange} value={formData.total_expense} />
                                </div>
                                <div className='vacation-form-wrapper'>
                                    <label>დაწყების თარიღი</label>
                                    <input type="date" name="start_date" onChange={handleInputChange} value={formData.start_date} />
                                </div>
                                <div className='vacation-form-wrapper'>
                                    <label>დასრულების თარიღი</label>
                                    <input type="date" name="end_date" onChange={handleInputChange} value={formData.end_date} />
                                </div>                               
                        </>
                    ) : (
                        <>
                                <div className='vacation-form-wrapper'>
                                    <label>შემცვლელი პირის სახელი</label>
                                    <input type="text" name="subtitle_user_name" onChange={handleInputChange} value={formData.subtitle_user_name} />
                                </div>
                                <div className='vacation-form-wrapper'>
                                    <label>შემცვლელი პირის გვარი</label>
                                    <input type="text" name="subtitle_user_sur_name" onChange={handleInputChange} value={formData.subtitle_user_sur_name} />
                                </div>
                                <div className='vacation-form-wrapper'>
                                    <label>მივლინების ადგილი (კონკრეტულად, ადგილმონაცვლეობის შემთხვევაში ყველა ტერიტორიული ერთეულის ჩამონათვალით)</label>
                                    <input type="text" name="place_of_trip" onChange={handleInputChange} value={formData.place_of_trip} />
                                </div>
                                <div className='vacation-form-wrapper'>
                                    <label>მივლინების საფუძველი</label>
                                    <input type="text" name="business_trip_basis" onChange={handleInputChange} value={formData.business_trip_basis} />
                                </div>
                                <div className='vacation-form-wrapper'>
                                    <label>მივლინების მიზანი</label>
                                    <textarea className="border border-black rounded-2xl p-1" name="purpose_of_trip" onChange={handleInputChange} id=""></textarea>
                                </div>
                                <div className='vacation-form-wrapper'>
                                    <label>შესასრულებელი ფუნქციის/დავალების დეტალური აღწერა:</label>
                                    <input type="text" name="description" onChange={handleInputChange} value={formData.description} />
                                </div>
                                <div className='va cation-form-wrapper'>
                                    <label>მივლინების უზრუნველყოფის ღონისძიებები (დაფინანსება სრული, ნაწილობრივი, დაფინანსების გარეშე)</label>
                                    <input type="text" name="business_trip_arrangement" onChange={handleInputChange} value={formData.business_trip_arrangement} />
                                </div>
                                <div className='vacation-form-wrapper'>
                                    <label>მივლინების მოსალოდნელი შედეგი</label>
                                    <input type="text" name="expected_result_business_trip" onChange={handleInputChange} value={formData.expected_result_business_trip} />
                                </div>
                                {/* <div className='vacation-form-wrapper'>
                                    <label>მივლინების ფაქტობრივი შედეგი</label>
                                    <input type="text" name="actual_result" onChange={handleInputChange} value={formData.actual_result} />
                                </div> */}
                                <div className='vacation-form-wrapper'>
                                    <label>დაწყების თარიღი</label>
                                    <input type="date" name="start_date" onChange={handleInputChange} value={formData.start_date} />
                                </div>
                                <div className='vacation-form-wrapper'>
                                    <label>დასრულების თარიღი</label>
                                    <input type="date" name="end_date" onChange={handleInputChange} value={formData.end_date} />
                                </div>
                        </>
                    )
                    
                }
                
                <button type="submit" className='vacation-form-submit'>გაგზავნა</button>
              </form>
            </DialogContentText>
           
          </DialogContent>
          
        </Dialog>
        {/* <div className="user-info">
          <span>{t("welcome")}, {userData?.name}!</span>
        </div> */}
        <div className='middle-wrapper flex pl-10'>
          <div className='grow-0'>
            {/* <Profile /> */}
          </div>
          <main className="vacation-main-content grow">
            <div className='flex flex-col items-center'>
              <div className='vacation-main-header border-[3px] border-[#105D8D]  w-[100%]'>
                <h1 className='font-semibold text-xl'>{t("Busines Trip")}</h1>
                <button className="approve-button" onClick={openModal}>{t("request")}</button>
              </div>
              <div className='w-[80%] h-[600px] overflow-y-auto pt-2 flex flex-col items-center'>
                {
                  list.map((vacation, idx) => {
                    return <RequestCard 
                      key={idx}
                      type={t("business_trip")}
                      duration={calculateDuration(vacation.start_date, vacation.end_date) + ' დღე'}
                      startDay={vacation.start_date}
                      endDay={vacation.end_date}
                      status={vacation.status}
                    />
                  })
                }
              </div>
              
              </div>
            </main>
        </div>
    </div>
    </div>
    </div>
  );
};

export default BusinessPage;
