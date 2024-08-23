import React, { useState, useEffect } from 'react';
import RequestCard from '../../components/Vacation/RequestCard';
import Profile from '../../components/Profile/index';
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

import './index.css';
import Navigation from '../../components/Navigation';
import { createPurchase } from '../../services/vacation';
import { getApprovalVacations, getVacations } from '../../services/admin/vacation';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import store from '../../store';

const VacationPage = () => {
  const { t } = useTranslation()
  const [userData, setUserData] = useState({});

  useEffect(() => {
    if(store.getState().user && store.getState().user.data) {
      setUserData(store.getState().user.data )
    }
  }, [store.getState().user.data])
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [approvalList, setApprovalList] = useState([]);
  const [vacations, setVacations] = useState([]);
  const [formData, setFormData] = useState({
    // department: 'აიტი',
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

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);
  const holidays = [
    {name: 'ორშაბათი', value: 'monday'}, 
    {name: 'სამშაბათი', value: 'tuesday'}, 
    {name: 'ოთხშაბათი', value: "wednesday" }, 
    {name: 'ხუთშაბათი', value: 'thurdsay' }, 
    {name: 'პარასკევი', value: "friday"}, 
    {name: 'შაბათი', value: "saturday"}, 
    {name: 'კვირა', value: "sunday"}
  ];

  useEffect(() => {
    const fetchVacations = async () => {
      try {
        const res = await getVacations();

        setVacations(res.data.vocations);
      } catch(err) {
        console.error(err)
      }
    }
    
    const fetchApprovals = async () => {
      try {
        const res = await getApprovalVacations({type: 'vocation'});

        setApprovalList(res.data.approvalSteps);
      } catch(err) {
        console.error(err);
      }
    }

    fetchApprovals()
    fetchVacations()
  },[])

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    if (type === 'checkbox') {
      if (checked) {
          setFormData({...formData, [name]: value})
      } else {
        setFormData({...formData, [name]: ""})
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

      if(res) {
        console.log(res);
        toast.success('თქვენი მოთხოვნა წარმატებით გაიგზავნა!');
        closeModal();
      }
    
    } catch (err) {
      console.log(err)
    }
  }

  const calculateDuration = (startDate, endDate, restDays) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let totalDays = 0;

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dayOfWeek = d.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

        // Check if the current day is a rest day
        switch (dayOfWeek) {
            case 0: if (restDays.sunday !== 'yes') totalDays++; break;
            case 1: if (restDays.monday !== 'yes') totalDays++; break;
            case 2: if (restDays.tuesday !== 'yes') totalDays++; break;
            case 3: if (restDays.wednesday !== 'yes') totalDays++; break;
            case 4: if (restDays.thursday !== 'yes') totalDays++; break;
            case 5: if (restDays.friday !== 'yes') totalDays++; break;
            case 6: if (restDays.saturday !== 'yes') totalDays++; break;
        }
    }

    if(totalDays === 0) {
      return 1;
    }

    return totalDays;
};

  return (
    <div className="vacation-dashboard-container">
      <Dialog
          open={modalIsOpen}
          onClose={closeModal}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <DialogTitle id="modal-title">Vacation request</DialogTitle>
          <DialogContent>
            <DialogContentText id="modal-description">
              <form onSubmit={handleSubmit}>
                {/* <div className='vacation-form-wrapper'>
                  <label>დეპარტამენტი</label>
                  <input type="text" name="department" onChange={handleInputChange} value={formData.department} />
                </div> */}
                <div className='vacation-form-wrapper'>
                  <label>სახელი და გვარი</label>
                  <input type="text" name="name_and_surname" onChange={handleInputChange} value={formData.name_and_surname} className='text-black'/>
                </div>
                <div className='vacation-form-wrapper'>
                  <label>დაწყების თარიღი</label>
                  <input type="date" name="start_date" onChange={handleInputChange} value={formData.start_date} className='text-black' />
                </div>
                <div className='vacation-form-wrapper'>
                  <label>დასრულების თარიღი</label>
                  <input type="date" name="end_date" onChange={handleInputChange} value={formData.end_date} className='text-black' />
                </div>
                <div className='vacation-form-wrapper'>
                  <label>შვებულების ტიპი</label>
                  <select name="type_of_vocations" onChange={handleInputChange}>
                    <option>აირჩიე ტიპი</option>
                    <option value="paid" className='text-black'>ანაზღაურებადი</option>
                    <option value="unpaid" className='text-black'>ანაზღაურების გარეშე</option>
                    <option value="maternity" className='text-black'>უხელფასო შვებულება ორსულობის, მშობიარობის და ბავშვის მოვლის გამო</option>
                    <option value="administrative" className='text-black'>ადმინისტრაციული</option>
                  </select>
                </div>
                <div className='vacation-form-wrapper'>
                  <label>დასვენების დღე/ები</label>
                  {
                    holidays.map((holiday, index) => {
                      return (
                        <div className='vacation-checkbox-input' key={index}>
                          <input type="checkbox" name={holiday.value} value="yes" onChange={handleInputChange}/>
                          <label htmlFor="holiday">{holiday.name}</label>
                        </div>
                      )
                    })
                  }
                </div>
                <button type="submit" className='vacation-form-submit'>გაგზავნა</button>
              </form>
            </DialogContentText>
           
          </DialogContent>
          
        </Dialog>
        {/* <div className="user-info">
          <span>{t("welcome")}, {userData?.name}!</span>
        </div> */}
        <div className='middle-wrapper flex pl-10'>
          <main className="vacation-main-content grow">
            <div className='flex flex-col items-center'>
              <div className='vacation-main-header border-[3px] border-[#105D8D]  w-[100%]'>
                <h1 style={{ color: '#007dba' }} className='font-semibold text-xl'>{t("vacations")}</h1>
                <button className='vacation-request-button bg-[#FFE61C] text-[#009FE3]' onClick={openModal}>{t("request")}</button>
              </div>
              <div className='w-[80%] h-[600px] overflow-y-auto pt-2 flex flex-col items-center'>
                {
                  vacations.map((vacation, idx) => {
                    return <RequestCard 
                    key={idx}
                      type="შვებულება"
                      duration={calculateDuration(vacation.start_date, vacation.end_date, vacation) + ' დღე'}
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
  );
};

export default VacationPage;
