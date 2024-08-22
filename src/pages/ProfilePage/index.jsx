import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { changePassword, updateUser } from '../../services/user';
import useFetchUser from '../../hooks/useFetchUser';
import { getDepartments } from '../../services/admin/department';
import { getDepartments as getDeps, getPurchaseDepartments } from '../../services/auth';
import { useTranslation } from 'react-i18next';
import store from '../../store';
import { Breadcrumbs } from '@mui/material';
import './index.css'; // Make sure the relevant styles are in this file

const ProfilePage = () => {
  const { t } = useTranslation();
  useFetchUser();
  const [userData, setUserData] = useState({});

  useEffect(() => {
    if (store.getState().user && store.getState().user.data) {
      setUserData(store.getState().user.data);
    }
  }, [store.getState().user.data]);

  const [departments, setDepartments] = useState([]);

  const [passForm, setPassForm] = useState({
    old_password: '',
    password: '',
    confirm_password: '',
  });

  const [passError, setPassError] = useState({
    old_password: '',
    password: '',
    confirm_password: '',
  });

  const [profileForm, setProfileForm] = useState({
    name: '',
    sur_name: '',
    position: '',
    department: '',
    location: '',
    working_start_date: '',
    date_of_birth: '',
    email: '',
    mobile_number: '',
    password: '',
  });

  const [profileError, setProfileError] = useState({
    position: '',
    department: '',
    location: '',
    working_start_date: '',
    date_of_birth: '',
    email: '',
    mobile_number: '',
    password: '',
  });

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        await getDepartments();
      } catch (err) {
        console.error(err);
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (Object.keys(userData).length > 0) {
      setProfileForm({
        name: userData?.name || '',
        sur_name: userData?.sur_name || '',
        position: userData?.position || '',
        department: userData?.department?.name || '',
        location: userData?.location || '',
        working_start_date: userData?.working_start_date || '',
        date_of_birth: userData?.date_of_birth || '',
        email: userData?.email || '',
        mobile_number: userData?.mobile_number || '',
        password: '',
      });
    }
  }, [userData]);

  const handleChangePass = (e) => {
    const { name, value } = e.target;
    setPassForm({
      ...passForm,
      [name]: value,
    });
  };

  const handleChangeProfile = (e) => {
    const { name, value } = e.target;
    setProfileForm({
      ...profileForm,
      [name]: value,
    });
  };

  const submitPassForm = async (e) => {
    e.preventDefault();

    try {
      setPassError({
        old_password: '',
        password: '',
        confirm_password: '',
      });
      const res = await changePassword(passForm);
      if (res.data.status === 401) {
        setPassError({ old_password: res.data.message });
      } else {
        toast.success(res.data.message);
      }
    } catch (err) {
      for (const [key, value] of Object.entries(err.response.data)) {
        setPassError({ ...passError, [key]: value[0] });
        toast.error(value[0]);
      }
    }
  };

  const submitProfileForm = async (e) => {
    e.preventDefault();

    try {
      const res = await updateUser(profileForm);
      if (res.data.status === 401) {
        setPassError({ old_password: res.data.message });
      } else {
        toast.success(res.data.message);
        setProfileError({
          position: '',
          department: '',
          location: '',
          working_start_date: '',
          date_of_birth: '',
          email: '',
          mobile_number: '',
          password: '',
        });
      }
    } catch (err) {
      for (const [key, value] of Object.entries(err.response.data)) {
        setProfileError({ ...profileError, [key]: value[0] });
        toast.error(value[0]);
      }
    }
  };

  useEffect(() => {
    let departmentsArray = [];
    const fetchDepartments = async () => {
      try {
        const res = await getDeps();

        departmentsArray = [...departmentsArray, ...res.data.departments];
      } catch (err) {
        console.error(err);
      } finally {
        setDepartments(departmentsArray);
      }
    };

    const fetchPurchaseDepartments = async () => {
      try {
        const res = await getPurchaseDepartments();

        departmentsArray = [...departmentsArray, ...res.data.departments];
      } catch (err) {
        console.error(err);
      } finally {
        setDepartments(departmentsArray);
      }
    };

    fetchDepartments();
    fetchPurchaseDepartments();
  }, []);

  return (
    <div className="profile-dashboard-container">
      <div className="profile-main-content">
        <div className="profile">
          <main className="profile-content">
            <div className="profile grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="profile-section">
                <div className="section-header mb-6">
                  <h2>{t("Profile")}</h2>
                </div>
                <form onSubmit={submitProfileForm}>
                  <div className="form-row">
                    <div className="profile-form-wrapper">
                      <label>{t("position")}</label>
                      <input
                        type="text"
                        name="position"
                        onChange={handleChangeProfile}
                        value={profileForm.position}
                      />
                      <p className="error-text">{profileError?.position}</p>
                    </div>

                    <div className="profile-form-wrapper">
                      <label>{t("department")}</label>
                      <select
                        name="department_id"
                        onChange={handleChangeProfile}
                      >
                        {departments.map((dep) => (
                          <option
                            key={dep.id}
                            selected={dep.id === userData?.department_id}
                            value={dep.id}
                          >
                            {dep?.name}
                          </option>
                        ))}
                      </select>
                      <p className="error-text">{profileError?.department}</p>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="profile-form-wrapper">
                      <label>{t("location")}</label>
                      <input
                        type="text"
                        name="location"
                        onChange={handleChangeProfile}
                        value={profileForm.location}
                      />
                      <p className="error-text">{profileError?.location}</p>
                    </div>

                    <div className="profile-form-wrapper">
                      <label>{t("work start date")}</label>
                      <input
                        type="date"
                        name="working_start_date"
                        onChange={handleChangeProfile}
                        value={profileForm.working_start_date}
                      />
                      <p className="error-text">{profileError?.working_start_date}</p>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="profile-form-wrapper">
                      <label>{t("birth date")}</label>
                      <input
                        type="date"
                        name="date_of_birth"
                        onChange={handleChangeProfile}
                        value={profileForm.date_of_birth}
                      />
                      <p className="error-text">{profileError?.date_of_birth}</p>
                    </div>

                    <div className="profile-form-wrapper">
                      <label>{t("email")}</label>
                      <input
                        type="email"
                        name="email"
                        onChange={handleChangeProfile}
                        value={profileForm.email}
                      />
                      <p className="error-text">{profileError?.email}</p>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="profile-form-wrapper">
                      <label>{t("mobile number")}</label>
                      <input
                        type="text"
                        name="mobile_number"
                        onChange={handleChangeProfile}
                        value={profileForm.mobile_number}
                      />
                      <p className="error-text">{profileError?.mobile_number}</p>
                    </div>

                    <div className="profile-form-wrapper">
                      <label>{t("password")}</label>
                      <input
                        type="password"
                        name="password"
                        onChange={handleChangeProfile}
                        value={profileForm.password}
                        placeholder={t('confirm current password')}
                      />
                      <p className="error-text">{profileError?.password}</p>
                    </div>
                  </div>

                  <button className="save-button">
                    {t('save')}
                  </button>
                </form>
              </div>

              <div className="profile-section">
                <div className="section-header mb-6">
                  <h2>{t("Change Your Password")}</h2>
                </div>
                <form onSubmit={submitPassForm}>
                  <div className="form-row">
                    <div className="profile-form-wrapper">
                      <label>{t("old password")}</label>
                      <input
                        type="password"
                        name="old_password"
                        onChange={handleChangePass}
                      />
                      <p className="error-text">{passError?.old_password}</p>
                    </div>

                    <div className="profile-form-wrapper">
                      <label>{t("new password")}</label>
                      <input
                        type="password"
                        name="password"
                        onChange={handleChangePass}
                      />
                      <p className="error-text">{passError?.password}</p>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="profile-form-wrapper">
                      <label>{t("repeat new password")}</label>
                      <input
                        type="password"
                        name="confirm_password"
                        onChange={handleChangePass}
                      />
                      <p className="error-text">{passError?.confirm_password}</p>
                    </div>
                  </div>

                  <button className="save-button">
                    {t('change')}
                  </button>
                </form>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
