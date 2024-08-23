import React, { useState, useEffect } from 'react';
import { FaPlus, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Breadcrumbs,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

import { approveVacation, getApprovalVacations } from '../../services/admin/vacation';

const HeadPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [approvalList, setApprovalList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [chosenApproval, setChosenApproval] = useState(null);

  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        const page = parseInt(queryParams.get('page')) || 1;
        const res = await getApprovalVacations({ type: 'vocation', page });

        setApprovalList(res.data.approvalSteps);
        setTotalPages(res.data.pagination.total_pages);
        setCurrentPage(page);
      } catch(err) {
        console.error(err);
      }
    }

    fetchApprovals()
  },[location.search])

  const updateUrl = (page) => {
    navigate(`?page=${page}`); // Replace '/your-path/' with your actual route path
  };

  const openModal = (data) => {
    setModalIsOpen(true);
    setChosenApproval(data);
  }

  const closeModal = () => {
    setModalIsOpen(false);
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      updateUrl(currentPage - 1);
    }
  };

  const handleNextPage = async () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      updateUrl(currentPage + 1);

      try {
        const res = await getApprovalVacations({type: 'vocation', page: currentPage + 1});
        setApprovalList(res.data.approvalSteps);
        setTotalPages(res.data.pagination.total_pages);
      } catch(err) {
        console.error(err);
      }
    }
  };
 
  const vacationSubmit = async (e) => {
    e.preventDefault();


    try {
        const res = await approveVacation(chosenApproval.id, {status: e.target.status.value})

        window.location.reload()
    } catch (err) {
        console.error(err)
    }
  }

  return (
    <div className="page-content">
    <div className="container-fluid">
        <Breadcrumbs title="Admin" breadcrumbItem="Daily Report" />
    <div className="vacation-dashboard-container">
      <div className="container mx-auto my-8">
        <div className="overflow-x-auto max-h-[90vh]">
          <div>
            Filters
          </div>
            <table className="min-w-full bg-white">
                <thead className="bg-white text-[#018AD1]">
                    <tr>
                        <th className="py-2 px-4 border border-[#018AD1]">#</th>
                        <th className="py-2 px-4 border border-[#018AD1]">Type</th>
                        <th className="py-2 px-4 border border-[#018AD1]">Status</th>
                        <th className="py-2 px-4 border border-[#018AD1]">User</th>
                        <th className="py-2 px-4 border border-[#018AD1]">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {approvalList.map((app, index) => (
                        <tr key={app.id} className="text-center">
                            <td className="border px-4 py-2">{index + 1}</td>
                            <td className="border px-4 py-2">{app.model_type.includes("Vocation") && 'შვებულება'}{app.model_type.includes("BusinessTrip") && 'მივლინება'}{app.model_type.includes("Purchase") && "შიდა შესყიდვა"}</td>
                            <td className={`border px-4 py-2 capitalize ${app.status === 'approved' && 'text-[#00D097]'} ${app.status === 'pending' && 'text-[#15C0E6]'} ${app.status === 'rejected' && 'text-[#D7443A]'}`}>{app.status}</td>
                            <td className="border px-4 py-2 capitalize">{app.parent_user_data.name + ' ' + app.parent_user_data.sur_name} - {app.parent_user_data.email}</td>
                            <td className="border px-4 py-2">
                                <button className="text-[#0090e3] mr-2" onClick={() => openModal(app)} >
                                    <FaPlus />
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <Dialog
                    open={modalIsOpen}
                    onClose={closeModal}
                    aria-labelledby="modal-title"
                    aria-describedby="modal-description"
                    >
                {/* { chosenApproval?.model_type.includes('Vocation') &&  */}
                <>
                
                 <DialogTitle id="modal-title">{chosenApproval?.model_type.includes("Business") && "მივლინების"} {chosenApproval?.model_type.includes("Vocation") && "შვებულების"} {chosenApproval?.model_type.includes("Purchase") && "შიდა შესყიდვის"} მოთხოვნა</DialogTitle>
                    <DialogContent>
                    <DialogContentText id="modal-description">

                    <form className='w-96' onSubmit={vacationSubmit}>
                    {
                    chosenApproval?.model_type.includes('Vocation') &&
                        <>
                        <div className='vacation-form-wrapper'>
                            <label>სახელი და გვარი</label>
                            <input type="text" name="name_and_surname"  className='text-black' disabled value={chosenApproval?.parent_user_data.name + ' ' + chosenApproval?.parent_user_data.sur_name}/>
                        </div>
                        <div className='vacation-form-wrapper'>
                            <label>დაწყების თარიღი</label>
                            <input type="date" name="start_date" className='text-black' value={chosenApproval?.parent.start_date} disabled />
                        </div>
                        <div className='vacation-form-wrapper'>
                            <label>დასრულების თარიღი</label>
                            <input type="date" name="end_date" className='text-black' value={chosenApproval?.parent.end_date} disabled />
                        </div>
                        <div className='vacation-form-wrapper'>
                            <label className='text'>დასვენების დღე/ები:</label>
                            <div className='flex flex-col text-black'>
                                {
                                    chosenApproval?.parent.monday !== 'no' && <span>ორშაბათი</span>
                                }
                                {
                                    chosenApproval?.parent.tuesday !== 'no' && <span>სამშაბათი</span>
                                }
                                {
                                    chosenApproval?.parent.wednesday !== 'no' && <span>ოთხშაბათი</span>
                                }
                                {
                                    chosenApproval?.parent.thursday !== 'no' && <span>ხუთშაბათი</span>
                                }
                                {
                                    chosenApproval?.parent.friday !== 'no' && <span>პარასკევი</span>
                                }
                                {
                                    chosenApproval?.parent.saturday !== 'no' && <span>შაბათი</span>
                                }
                                {
                                    chosenApproval?.parent.sunday !== 'no' && <span>კვირა</span>
                                }
                                                            
                            </div>
                        </div>                        
                        <div className='text-black'>
                            შვებულების ტიპი: <span>{parent.type_of_vocations}</span>
                        </div>
                        </>
                        }

                        {chosenApproval?.model_type.includes('BusinessTrip') && (
                          chosenApproval.parent.trip_type === 'regional' ? (
                            <>
                                     <div className='vacation-form-wrapper'>
                                        <label>შემცვლელი პირის სახელი</label>
                                        <input type="text" name="subtitle_user_name" value={chosenApproval?.parent?.subtitle_user_name} />
                                    </div>
                                    <div className='vacation-form-wrapper'>
                                        <label>შემცვლელი პირის გვარი</label>
                                        <input type="text" name="subtitle_user_sur_name" value={chosenApproval?.parent?.subtitle_user_sur_name} />
                                    </div>
                                    <div className='vacation-form-wrapper'>
                                        <label>მივლინების ადგილი</label>
                                        <input type="text" name="place_of_trip" value={chosenApproval?.parent?.place_of_trip} />
                                    </div>
                                    <div className='vacation-form-wrapper'>
                                        <label>მივლინების მიზანი</label>
                                        <input type="text" name="purpose_of_trip" value={chosenApproval?.parent?.purpose_of_trip} />
                                    </div>
                                    <div className='vacation-form-wrapper'>
                                        <label>მივლინების ხარჯი</label>
                                        <input type="text" name="expense_vocation" value={chosenApproval?.parent?.expense_vocation} />
                                    </div>
                                    <div className='vacation-form-wrapper'>
                                        <label>ტრანსპორტი (საკუთარი ავტომობილის შემთხვევაში საწვავისთვის საჭირო თანხა)</label>
                                        <input type="text" name="expense_transport" value={chosenApproval?.parent?.expense_transport} />
                                    </div>
                                    <div className='vacation-form-wrapper'>
                                        <label>საცხოვრებელი</label>
                                        <input type="text" name="expense_living" value={chosenApproval?.parent?.expense_living} />
                                    </div>
                                    <div className='vacation-form-wrapper'>
                                        <label>დღიური კვება</label>
                                        <input type="text" name="expense_meal" value={chosenApproval?.parent?.expense_meal} />
                                    </div>
                                    <div className='vacation-form-wrapper'>
                                        <label>სრული ხარჯი</label>
                                        <input type="text" name="total_expense" value={chosenApproval?.parent?.total_expense} />
                                    </div>
                                    <div className='vacation-form-wrapper'>
                                        <label>დაწყების თარიღი</label>
                                        <input type="date" name="start_date" value={chosenApproval?.parent?.start_date} />
                                    </div>
                                    <div className='vacation-form-wrapper'>
                                        <label>დასრულების თარიღი</label>
                                        <input type="date" name="end_date" value={chosenApproval?.parent?.end_date} />
                                    </div>                               
                            </>
                        ) : (
                            <>
                                    <div className='vacation-form-wrapper'>
                                        <label>შემცვლელი პირის სახელი</label>
                                        <input type="text" name="subtitle_user_name" value={chosenApproval?.parent?.subtitle_user_name} />
                                    </div>
                                    <div className='vacation-form-wrapper'>
                                        <label>შემცვლელი პირის გვარი</label>
                                        <input type="text" name="subtitle_user_sur_name" value={chosenApproval?.parent?.subtitle_user_sur_name} />
                                    </div>
                                    <div className='vacation-form-wrapper'>
                                        <label>მივლინების ადგილი (კონკრეტულად, ადგილმონაცვლეობის შემთხვევაში ყველა ტერიტორიული ერთეულის ჩამონათვალით)</label>
                                        <input type="text" name="place_of_trip" value={chosenApproval?.parent?.place_of_trip} />
                                    </div>
                                    <div className='vacation-form-wrapper'>
                                        <label>მივლინების საფუძველი</label>
                                        <input type="text" name="business_trip_basis" value={chosenApproval?.parent?.business_trip_basis} />
                                    </div>
                                    <div className='vacation-form-wrapper'>
                                        <label>მივლინების მიზანი</label>
                                        <input type="text" name="purpose_of_trip" value={chosenApproval?.parent?.purpose_of_trip} />
                                    </div>
                                    <div className='vacation-form-wrapper'>
                                        <label>შესასრულებელი ფუნქციის/დავალების დეტალური აღწერა:</label>
                                        <input type="text" name="description" value={chosenApproval?.parent?.description} />
                                    </div>
                                    <div className='vacation-form-wrapper'>
                                        <label>მივლინების უზრუნველყოფის ღონისძიებები (დაფინანსება სრული, ნაწილობრივი, დაფინანსების გარეშე)</label>
                                        <input type="text" name="business_trip_arrangement" value={chosenApproval?.parent?.business_trip_arrangement} />
                                    </div>
                                    <div className='vacation-form-wrapper'>
                                        <label>მივლინების მოსალოდნელი შედეგი</label>
                                        <input type="text" name="expected_result_business_trip" value={chosenApproval?.parent?.expected_result_business_trip} />
                                    </div>
                                    {/* <div className='vacation-form-wrapper'>
                                        <label>მივლინების ფაქტობრივი შედეგი</label>
                                        <input type="text" name="actual_result" onChange={handleInputChange} value={chosenApproval.parent.actual_result} />
                                    </div> */}
                                    <div className='vacation-form-wrapper'>
                                        <label>დაწყების თარიღი</label>
                                        <input type="date" name="start_date" value={chosenApproval?.parent?.start_date} />
                                    </div>
                                    <div className='vacation-form-wrapper'>
                                        <label>დასრულების თარიღი</label>
                                        <input type="date" name="end_date" value={chosenApproval?.parent?.end_date} />
                                    </div>
                            </>
                        )
                         ) }

                          {chosenApproval?.model_type.includes('InternalPurchase') &&
                          <>
                <div className='vacation-form-wrapper'>
                  <label>ზოგადად აღწერეთ რა არის შესყიდვის ობიექტი?</label>
                  <input type="text" name="objective"  value={chosenApproval?.parent?.objective} />
                </div>
                <div className='vacation-form-wrapper'>
                  <label>რა ვადაში ითხოვთ შესყიდვის ობიექტის მიღებას?</label>
                  <input type="date" name="deadline"  value={chosenApproval?.parent?.deadline} />
                </div>
                <div className='vacation-form-wrapper'>
                  <label>იმ შემთხვევაში თუ შესყიდვის ობიექტის მიღებისთვის ითხოვთ მცირე ვადას, გთხოვთ, განმარტოთ რამ გამოიწვია ამგვარი ვითარების დადგომა და რატომ ვერ იქნებოდა ვითარება წინასწარ განსაზღვრული?</label>
                  <input type="text" name="short_period_reason"  value={chosenApproval?.parent?.short_period_reason} />
                </div>
                <div className='vacation-form-wrapper'>
                  <label>ხომ არ აღემატება მოთხოვნილი შესყიდვის ობიექტი იმ საჭიროებებს, რომელიც ხელს უშლის სამსახურეობრივი მოვალეობის შესრულებისთვის საჭირო შესყიდვის მოცულობას??</label>
                  <input type="text" name="requested_procurement_object_exceed"  value={chosenApproval?.parent?.requested_procurement_object_exceed} />
                </div>
                <div className='vacation-form-wrapper'>
                  <label>იქმნება თუ არა მარაგი და რა მიზნით?</label>
                  <input type="text" name="stock_purpose"  value={chosenApproval?.parent?.stock_purpose} />
                </div>
                <div className='vacation-form-wrapper'>
                  <label>მიწოდების ადგილი (მისამართი)</label>
                  <input type="text" name="delivery_address"  value={chosenApproval?.parent?.delivery_address} />
                </div>
                <div className='vacation-form-wrapper'>
                  <label>რით არის განპირობებული შესყიდვის საჭიროება?</label>
                  <input type="text" name="reason"  value={chosenApproval?.parent?.reason} />
                </div>
                {/* <div className='vacation-form-wrapper'>
                  <label>გთხოვთ, საჭიროების მიხედვით, დეტალურად აღწეროთ შესყიდვის ობიექტი</label>
                  <input type="text" name="objective"  value={chosenApproval?.parent?.brand_model} />
                </div> */}
                <div className='vacation-form-wrapper'>
                  <label>გთხოვთ, მიუთითოთ ელექტრონულ რესურსებში არსებული ბმული, სპეციფიურობის გათვალისწინებით წარმოადგინოთ ნიმუში, მიუთითოთ მარკა, მოდელი, ნიშანდება (არსებობის შემთხვევაში)</label>
                  <input type="text" name="brand_model"  value={chosenApproval?.parent?.brand_model} />
                </div>
                <div className='vacation-form-wrapper'>
                  <label>დასაშვებია თუ არა შესყიდვის ობიექტის ალტერნატივა? თუ დასაშვებია რა სახის შეიძლება იყოს ალტერნატივა? თუ არ არის დასაშვები ალტერნტივა გთხოვთ, წარმოადგინოთ განმარტება</label>
                  <input type="text" name="alternative"  value={chosenApproval?.parent?.alternative} />
                </div>
                <div className='vacation-form-wrapper'>
                  <label>გთხოვთ, მიუთითოთ ინფორმაცია მიმწოდებლის შესახებ, რომელიც მოთხოვნილ შესყიდვის ობიექტს მოგვაწვდის კონკურენტულ ფასში (არსებობის შემთხვევაში)</label>
                  <input type="text" name="competetive_price"  value={chosenApproval?.parent?.competetive_price} />
                </div>
                <div className='vacation-form-wrapper'>
                  <label>იგეგმება, თუ არა უახლოეს 1 თვეში ანალოგიური პროდუქციის შესყიდვა?</label>
                  <input type="text" name="planned_next_month"  value={chosenApproval?.parent?.planned_next_month} />
                </div>
                <div className='vacation-form-wrapper'>
                  <label>ვინ ანაზღაურებს ამ თანხას ? (შპს გორგია, მომწოდებელი, სხვა)</label>
                  <input type="text" name="who_pay_amount"  value={chosenApproval?.parent?.who_pay_amount} />
                </div>
                <div className='vacation-form-wrapper'>
                  <label>თანამშრომლის სახელი გვარი, რომელიც მარკეტში/საწყობში საბოლოოდ ჩაიბარებს ნივთს ან სერვისის მიღება (სავალდებულოა სს-ში დამატება)</label>
                  <input type="text" name="name_surname_of_employee"  value={chosenApproval?.parent?.name_surname_of_employee} />
                </div>
                </>
                          }
                        <div className='vacation-form-wrapper'>
                        <label>დასადასტურებლად აირჩიეთ</label>
                        <select name="status">
                            <option>აირჩიე პასუხი</option>
                            <option value="approved" className='text-black'>თანხმობა</option>
                            <option value="rejected" className='text-black'>უარყოფა</option>
                        </select>
                        </div>
                        <button type="submit" className='vacation-form-submit'>გაგზავნა</button>
                    </form>
                    </DialogContentText>
                            
                    </DialogContent>
            </>

                </Dialog>
                
            </div>
            <div className="flex justify-between my-4">
                    <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
                    >
                        <FaArrowLeft />
                    </button>
                    <span className='text-white text-lg'>Page {currentPage} of {totalPages}</span>
                    <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
                    >
                        <FaArrowRight />
                    </button>
                </div>
        </div>
    </div>
    </div>
    </div>
  );
};

export default HeadPage;
