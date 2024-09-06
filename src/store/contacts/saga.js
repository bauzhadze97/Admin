import { call, put, takeEvery } from "redux-saga/effects"

// Contact Redux States
import { GET_CONTACTS, GET_CONTACT_PROFILE, ADD_NEW_CONTACT, DELETE_CONTACT, UPDATE_CONTACT } from "./actionTypes"

import {
  getContactsSuccess,
  getContactsFail,
  getContactProfileSuccess,
  getContactProfileFail,
  addContactFail,
  addContactSuccess,
  updateContactSuccess,
  updateContactFail,
  deleteContactSuccess,
  deleteContactFail,
} from "./actions"

// Include Both Helper Files with needed methods
import { getContacts, getContactProfile, addNewContact, updateContact, deleteContact } from "../../helpers/fakebackend_helper"

// toast notifications
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// Fetch all contacts
function* fetchContacts() {
  try {
    const response = yield call(getContacts)
    yield put(getContactsSuccess(response))
  } catch (error) {
    yield put(getContactsFail(error))
  }
}

// Fetch contact profile
function* fetchContactProfile() {
  try {
    const response = yield call(getContactProfile)
    yield put(getContactProfileSuccess(response))
  } catch (error) {
    yield put(getContactProfileFail(error))
  }
}

// Update a contact
function* onUpdateContact({ payload: contact }) {
  try {
    const response = yield call(updateContact, contact)
    yield put(updateContactSuccess(response))
    toast.success("Contact Updated Successfully", { autoClose: 2000 });
  } catch (error) {
    yield put(updateContactFail(error))
    toast.error("Contact Update Failed", { autoClose: 2000 });
  }
}

// Delete a contact
function* onDeleteContact({ payload: contact }) {
  try {
    const response = yield call(deleteContact, contact)
    yield put(deleteContactSuccess(response))
    toast.success("Contact Deleted Successfully", { autoClose: 2000 });
  } catch (error) {
    yield put(deleteContactFail(error))
    toast.error("Contact Deletion Failed", { autoClose: 2000 });
  }
}

// Add a new contact
function* onAddNewContact({ payload: contact }) {
  try {
    const response = yield call(addNewContact, contact)
    yield put(addContactSuccess(response))
    toast.success("Contact Added Successfully", { autoClose: 2000 });
  } catch (error) {
    yield put(addContactFail(error))
    toast.error("Contact Addition Failed", { autoClose: 2000 });
  }
}

function* contactsSaga() {
  yield takeEvery(GET_CONTACTS, fetchContacts)
  yield takeEvery(GET_CONTACT_PROFILE, fetchContactProfile)
  yield takeEvery(ADD_NEW_CONTACT, onAddNewContact)
  yield takeEvery(UPDATE_CONTACT, onUpdateContact)
  yield takeEvery(DELETE_CONTACT, onDeleteContact)
}

export default contactsSaga;
