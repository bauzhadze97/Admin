import React from 'react';
import { useEffect, useState } from "react"
import { assignHead, createDepartment, deleteDepartment, getDepartments, getUsers, deleteUser } from "../../services/admin/department";
import { FaTrash, FaPlus } from "react-icons/fa";
import { Link, useNavigate  } from "react-router-dom";
import {
    Breadcrumbs,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
  } from '@mui/material';
  import { toast } from 'react-toastify';
import { useTranslation } from "react-i18next";

export default function AdminPage() {
    const { t } = useTranslation();
    const queryParams = new URLSearchParams(location.search);
    const initialActiveSide = queryParams.get('activeSide') || 'departments';
    const navigate = useNavigate();

    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [activeSide, setActiveSide] = useState(initialActiveSide);
    const [departments, setDepartments] = useState([]);
    const [chosenDepartment, setChosenDepartment] = useState(null);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState(users);
    const [searchedUsers, setSearchedUsers] = useState(users);
    const [srchTerm, setSrchTerm] = useState('');
    const handleSearchChange = (event) => {
        const searchTerm = event.target.value.toLowerCase();
        setSearchTerm(searchTerm);
    
        const filteredUsers = users.filter(user =>
          user.name.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm)
        );
        setFilteredUsers(filteredUsers);
      };

      const handleSearchUser = (event) => {
        const searchTerm = event.target.value.toLowerCase();
        setSrchTerm(searchTerm)

        const filteredUsers = users.filter(user =>
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm)
          );
          setSearchedUsers(filteredUsers);
      }

    useEffect(() => {
        const fecthDepartments = async () => {
            try {
                const res = await getDepartments();
                setDepartments(res.data.departments)
            } catch (err) {
                console.log(err)
            }
        };

        const fetchUsers = async () => {
            try {
                const res = await getUsers();
                setUsers(res.data.users)
                setFilteredUsers(res.data.users)
                setSearchedUsers(res.data.users);
            } catch (err) {
                console.log(err)
            }
        }

        fecthDepartments()
        fetchUsers();
    }, [])

    const addDepartment = async (e) => {
        e.preventDefault();

        try {
            const res = await createDepartment({
                name: e.target.name.value,
                type: e.target.type.value,
                status: 'active'
            })
            if(res) {
                window.location.reload();
            }
        } catch (err) {
            console.log(err)
        }
    }

    const confirmDelete = async (depId, name) => {
        if (window.confirm(`ნამდვილად გსურს წაშალო ${name}?`)) {
            try {
                const res = await deleteDepartment({id: depId});
                console.log(res);
                if(res) {
                    window.location.reload()
                }
            } catch(err) {
                console.log(err)
            }
        }
      };

      const handleDeleteUser = async (user) => {
        if (window.confirm(`ნამდვილად გსურს წაშალო ${user.name + ' ' + user.sur_name}?`)) {
            try {
                const res = await deleteUser(user.id);
                if(res) {
                    window.location.reload()
                }
            } catch(err) {
                console.log(err)
            }
        }
      }

      const closeModal = () => {
        setModalIsOpen(false)
        setChosenDepartment(null);
      }

      const openModal = (department) => {
        setChosenDepartment(department);

        setModalIsOpen(true)
      }
      
      const assignHeadSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await assignHead({
                user_id: e.target.user_id.value,
                department_id: e.target.department_id.value
            })

            if(res) {
                toast.success("წარმატებით მიენიჭა");
                closeModal();
                window.location.reload();
            }
        } catch(err) {
            console.log(err);
        }
      }

      const handleSideChange = (side) => {
        setActiveSide(side);
        navigate(`?activeSide=${side}`);
    };
<<<<<<< HEAD
=======

   
>>>>>>> 5a3e0cf3c9a36fa82ce8a575296a2ec4913f3d31
    return (
        <div className="page-content">
            <div className="container-fluid">
                <Breadcrumbs title="Admin" breadcrumbItem="Daily Report" />
                <div className="flex">
        <div className="flex flex-col bg-[#d1e1e8] bg-opacity-[.8] h-[100vh] text-[#fff] p-8">
            <Link to={'https://crm.gorgia.ge/profile'} className="p-2 bg-[#2bc0ff] text-center rounded-lg w-[160px] mb-3 animate-link">crm.gorgia.ge</Link>
            <button className={`p-2 ${activeSide === 'departments' ? 'bg-[#018AD1]' : 'bg-[#2bc0ff]' } animate-link  rounded-lg w-[160px] mb-3`} onClick={() => handleSideChange('departments')}>დეპარტამენტები</button>
            <button className={`p-2 ${activeSide === 'users' ? 'bg-[#018AD1]' : 'bg-[#2bc0ff]' } animate-link  rounded-lg w-[160px] mb-3`} onClick={() => handleSideChange('users')}>მომხმარებლები</button>
        </div>

        <div className="bg-[#e1f0f7] bg-opacity-[.6] w-[100%]">
            {
                activeSide === 'departments' && (
                    <div className="p-8 flex justify-around">
                        <div>
                            <h1 className="font-semibold text-xl ">{t("for_now_there_are")} {departments.length} {t("departments")}.</h1>
                            <div className="container mx-auto my-8">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full bg-white">
                                    <thead className="bg-[#018AD1] text-white">
                                        <tr>
                                        <th className="py-2 px-4">#</th>
                                        <th className="py-2 px-4">{t("department_name")}</th>
                                        <th className="py-2 px-4">{t("department_head")}</th>
                                        <th className="py-2 px-4">{t("action")}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {departments.map((dep, index) => (
                                        <tr key={dep.id} className="text-center">
                                            <td className="border px-4 py-2">{index + 1}</td>
                                            <td className="border px-4 py-2">{dep.name}</td>
                                            <td className="border px-4 py-2">{dep.head?.name}</td>
                                            <td className="border px-4 py-2">
                                            <button className="text-[#0090e3] mr-2" onClick={() => openModal(dep)}>
                                                <FaPlus />
                                            </button>
                                            <button
                                                onClick={() => confirmDelete(dep.id, dep.name)}
                                                className="text-[#990500]"
                                            >
                                                <FaTrash />
                                            </button>
                                            </td>
                                        </tr>
                                        ))}
                                    </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <Dialog
                            open={modalIsOpen}
                            onClose={closeModal}
                            aria-labelledby="modal-title"
                            aria-describedby="modal-description"
                            >
                            <DialogTitle id="modal-title" className="text-center">{t("approve_a_head_to")} {chosenDepartment?.name}</DialogTitle>
                            <DialogContent>
                                <DialogContentText id="modal-description">
                                <form onSubmit={assignHeadSubmit}>
                                    <div className='vacation-form-wrapper'>
                                        <label>{t("user")}</label>
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                            name="search"
                                            placeholder="მარტივად ასარჩევად გაფილტრე სახელით/მეილით"
                                            className="border border-gray-300 rounded px-3 py-2 mb-2 w-[430px]"
                                        />
                                        <input type="hidden" name="department_id" value={chosenDepartment?.id} />
                                        <select name="user_id">
                                            <option>{t("choose_head")}</option>
                                            {filteredUsers.map((user) => (
                                            <option key={user.email} value={user.id}>
                                                {user.name} - {user.email}
                                            </option>
                                            ))}
                                        </select>
                                    </div>  
                                    <button type="submit" className='vacation-form-submit'>{t("add")}</button>
                                </form>
                                </DialogContentText>
                            
                            </DialogContent>
                            
                            </Dialog>

                        <form className="border border-[#536c8c] p-2 rounded-md" onSubmit={addDepartment}>
                            <h3 className="text-xl text-center">{t("add_department")}</h3>
                            <div className="flex flex-col mb-2">
                                <label className="mb-1 text-md">{t("department_name")}:</label>
                                <input type="text" name="name" className="bg-[#536c8c] p-2 placeholder:text-black rounded-md bg-opacity-20 text-black" placeholder={t("enter_name")} />
                            </div>
                            <label className="mr-2">{t("is_it_purchase_department")}</label>
                            <select className=" w-32 p-2 mb-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300" name="type">
                            <option value="department">
                                    {t("no")}
                                </option>
                                <option value="purchase_head">
                                    {t("yes")}
                                </option>
                            </select>
                            <button type="submit" className="bg-[#018AD1] w-[100%] transition-all ease-in-out delay-50 text-[#fff] hover:bg-[#2bc0ff] py-2 mt-2 rounded-md">{t("add")}</button>
                        </form>
                    </div>
                )
            }

            {
                activeSide === 'users' && (
                    <div className="container mx-auto my-8">
                        <div className="overflow-x-auto max-h-[80vh]">
                            <input  value={srchTerm} onChange={handleSearchUser} type="text" name="search" placeholder={t("search_by_name_and_surname_or_email")} className="rounded border border-[#018AD1] w-[100%] mb-2 p-4 text-lg text-black" />
                            <table className="min-w-full bg-white">
                            <thead className="bg-[#018AD1] text-white">
                                <tr>
                                <th className="w-1/6 py-2 px-4">{t('name')}</th>
                                <th className="w-1/6 py-2 px-4">{t("surname")}</th>
                                <th className="w-1/6 py-2 px-4">{t("email")}</th>
                                <th className="w-1/6 py-2 px-4">{t("mobile")}</th>
                                <th className="w-1/6 py-2 px-4">{t("department")}</th>
                                <th className="w-1/6 py-2 px-4">{t("position")}</th>
                                <th className="w-1/6 py-2 px-4">{t("location")}</th>
                                <th className="w-1/6 py-2 px-4">{t("role")}</th>
                                <th className="w-1/6 py-2 px-4">{t("action")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {searchedUsers.map(user => (
                                <tr key={user?.id} className="text-center">
                                    <td className="border px-4 py-2">{user?.name}</td>
                                    <td className="border px-4 py-2">{user?.sur_name}</td>
                                    <td className="border px-4 py-2">{user?.email}</td>
                                    <td className="border px-4 py-2">{user?.mobile_number}</td>
                                    <td className="border px-4 py-2">{user?.department ? user?.department?.name : 'N/A'}</td>
                                    <td className="border px-4 py-2">{user?.position}</td>
                                    <td className="border px-4 py-2">{user?.location}</td>
                                    <td className="border px-4 py-2">{user?.type}</td>
                                    <td className="border px-4 py-2">
                                        <button className="text-[#990500]" onClick={() => handleDeleteUser(user)}>
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                            </table>
                        </div>
                    </div>
                )
            }
        </div>
    </div>
                
            </div>
        </div>
    );

}