import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
    fetchUserStart,
    fetchUserSuccess,
    fetchUserFailure,
} from '../store/user/actions'
import { fetchUser } from '../services/user';
import store from "../store";

const useFetchUser = () => {
    const dispatch = useDispatch();
    const [state, setState] = useState(() => store.getState().user);

    useEffect(() => {
      const callFetchUser = async () => {
        dispatch(fetchUserStart());
        try {
          const response = await fetchUser();
          dispatch(fetchUserSuccess(response.data));
        } catch (error) {
          dispatch(fetchUserFailure(error.message));
        }
  
        // Update the local state with the latest state from the store
        setState(store.getState().user);
      };
  
      callFetchUser();
  
      // Subscribe to store updates
      const unsubscribe = store.subscribe(() => {
        setState(store.getState().user);
      });
  
      // Cleanup subscription on unmount
      return () => unsubscribe();
    }, [dispatch]);
  
    return state; // Return the state containing data, loading, and error
  };
  
  export default useFetchUser;
  