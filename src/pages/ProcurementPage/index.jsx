import React, { useEffect, useState } from 'react';
import RequestCard from '../../components/Vacation/RequestCard';
import Navigation from '../../components/Navigation';
import {
  Breadcrumbs,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

import './index.css';
import { getPurchaseList, createPurchase } from '../../services/purchase';
import { getDepartments, getPurchaseDepartments } from '../../services/auth';
import { useTranslation } from 'react-i18next';

const ProcurementPage = () => {
  const { t } = useTranslation()
  const [modalIsOpen, setModalIsOpen] = useState(false);
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

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await getPurchaseList()
        setPurchases(res.data.internal_purchases);
      } catch (err) {
        console.log(err);
      }
    }

    fetchRequests();

    let departmentsArray = [];
    const fetchDeparmtents = async () => {
      try {
        const res = await getDepartments();
        
        departmentsArray = [...departmentsArray, ...res.data.departments]
      } catch (err) {
        console.error(err);
      } finally {
        setDepartments(departmentsArray)
      }
    }

    const fetchPurchaseDepartments = async () => {
      try {
        const res = await getPurchaseDepartments();
       
        departmentsArray = [...departmentsArray, ...res.data.departments]
      } catch (err) {
        console.error(err);
      } finally {
        setDepartments(departmentsArray)
      }    
    }

    fetchDeparmtents();
    fetchPurchaseDepartments()
  }, [])

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

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays;
  };

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
          <DialogTitle id="modal-title">შესყიდვის მოთხოვნა</DialogTitle>
          <DialogContent>
            <DialogContentText id="modal-description">
              <form onSubmit={handleSubmit}>               
                <div className='vacation-form-wrapper'>
                  <label>დეპარტამენტი</label>
                  <select name="department_purchase_id" onChange={handleInputChange}>
                    {
                      departments.map((dep) => {
                        return <option key={dep.id} value={dep.id}>{dep.name}</option>
                      })
                    }
                  </select>
                </div>
                <div className='vacation-form-wrapper'>
                  <label>ზოგადად აღწერეთ რა არის შესყიდვის ობიექტი?</label>
                  <input type="text" name="objective" onChange={handleInputChange} value={formData.objective} />
                </div>
                <div className='vacation-form-wrapper'>
                  <label>რა ვადაში ითხოვთ შესყიდვის ობიექტის მიღებას?</label>
                  <input type="date" name="deadline" onChange={handleInputChange} value={formData.deadline} />
                </div>
                <div className='vacation-form-wrapper'>
                  <label>იმ შემთხვევაში თუ შესყიდვის ობიექტის მიღებისთვის ითხოვთ მცირე ვადას, გთხოვთ, განმარტოთ რამ გამოიწვია ამგვარი ვითარების დადგომა და რატომ ვერ იქნებოდა ვითარება წინასწარ განსაზღვრული?</label>
                  <input type="text" name="short_period_reason" onChange={handleInputChange} value={formData.short_period_reason} />
                </div>
                <div className='vacation-form-wrapper'>
                  <label>ხომ არ აღემატება მოთხოვნილი შესყიდვის ობიექტი იმ საჭიროებებს, რომელიც ხელს უშლის სამსახურეობრივი მოვალეობის შესრულებისთვის საჭირო შესყიდვის მოცულობას??</label>
                  <input type="text" name="requested_procurement_object_exceed" onChange={handleInputChange} value={formData.requested_procurement_object_exceed} />
                </div>
                <div className='vacation-form-wrapper'>
                  <label>იქმნება თუ არა მარაგი და რა მიზნით?</label>
                  <input type="text" name="stock_purpose" onChange={handleInputChange} value={formData.stock_purpose} />
                </div>
                <div className='vacation-form-wrapper'>
                  <label>მიწოდების ადგილი (მისამართი)</label>
                  <input type="text" name="delivery_address" onChange={handleInputChange} value={formData.delivery_address} />
                </div>
                <div className='vacation-form-wrapper'>
                  <label>რით არის განპირობებული შესყიდვის საჭიროება?</label>
                  <input type="text" name="reason" onChange={handleInputChange} value={formData.reason} />
                </div>
                {/* <div className='vacation-form-wrapper'>
                  <label>გთხოვთ, საჭიროების მიხედვით, დეტალურად აღწეროთ შესყიდვის ობიექტი</label>
                  <input type="text" name="objective" onChange={handleInputChange} value={formData.brand_model} />
                </div> */}
                <div className='vacation-form-wrapper'>
                  <label>გთხოვთ, მიუთითოთ ელექტრონულ რესურსებში არსებული ბმული, სპეციფიურობის გათვალისწინებით წარმოადგინოთ ნიმუში, მიუთითოთ მარკა, მოდელი, ნიშანდება (არსებობის შემთხვევაში)</label>
                  <input type="text" name="brand_model" onChange={handleInputChange} value={formData.brand_model} />
                </div>
                <div className='vacation-form-wrapper'>
                  <label>დასაშვებია თუ არა შესყიდვის ობიექტის ალტერნატივა? თუ დასაშვებია რა სახის შეიძლება იყოს ალტერნატივა? თუ არ არის დასაშვები ალტერნტივა გთხოვთ, წარმოადგინოთ განმარტება</label>
                  <input type="text" name="alternative" onChange={handleInputChange} value={formData.alternative} />
                </div>
                <div className='vacation-form-wrapper'>
                  <label>გთხოვთ, მიუთითოთ ინფორმაცია მიმწოდებლის შესახებ, რომელიც მოთხოვნილ შესყიდვის ობიექტს მოგვაწვდის კონკურენტულ ფასში (არსებობის შემთხვევაში)</label>
                  <input type="text" name="competetive_price" onChange={handleInputChange} value={formData.competetive_price} />
                </div>
                <div className='vacation-form-wrapper'>
                  <label>იგეგმება, თუ არა უახლოეს 1 თვეში ანალოგიური პროდუქციის შესყიდვა?</label>
                  <input type="text" name="planned_next_month" onChange={handleInputChange} value={formData.planned_next_month} />
                </div>
                <div className='vacation-form-wrapper'>
                  <label>ვინ ანაზღაურებს ამ თანხას ? (შპს გორგია, მომწოდებელი, სხვა)</label>
                  <input type="text" name="who_pay_amount" onChange={handleInputChange} value={formData.who_pay_amount} />
                </div>
                <div className='vacation-form-wrapper'>
                  <label>თანამშრომლის სახელი გვარი, რომელიც მარკეტში/საწყობში საბოლოოდ ჩაიბარებს ნივთს ან სერვისის მიღება (სავალდებულოა სს-ში დამატება)</label>
                  <input type="text" name="name_surname_of_employee" onChange={handleInputChange} value={formData.name_surname_of_employee} />
                </div>
                <button type="submit" className='vacation-form-submit'>გაგზავნა</button>
              </form>
            </DialogContentText>
           
          </DialogContent>
          
        </Dialog>
        <div className='middle-wrapper flex pl-10'>
          <main className="vacation-main-content grow">
            <div className='flex flex-col items-center'>
              <div className='vacation-main-header border-[3px] border-[#105D8D]  w-[100%]'>
                <h1 >{t("internal purchasment")}</h1>
                <button className='vacation-request-button bg-[#FFE61C] text-[#009FE3]' onClick={openModal}>{t("request")}</button>
              </div>
              <div className='w-[80%] flex flex-col justify-center items-center'>
              {
                  purchases.map((purchase, idx) => {
                    return <RequestCard 
                      key={idx}
                      type={t("internal_purchasment")}
                      location={purchase.delivery_address}
                      endDay={purchase.deadline}
                      status={purchase.status}
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

export default ProcurementPage;
