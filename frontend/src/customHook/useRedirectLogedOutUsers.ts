import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { RootState } from '../Redux/Features/store';
import ActiveUser from './getLoggedInUser';

export const useRedirectLoggedInUser = () => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const loading = useSelector((state: RootState) => state.auth.isLoading);
  const {user }= ActiveUser();

  // Track toast display status to avoid duplicates
  const [toastShown, setToastShown] = useState({
    sessionExpired: false,
    welcomeBack: false,
  });

  useEffect(() => {
    if (!loading) {
      if (!isLoggedIn) {
        if (!toastShown.sessionExpired) {
          // toast.info("Session expired, please log in.");
          setToastShown({ sessionExpired: true, welcomeBack: false });
        }
        navigate('/');
      } else if (user && !toastShown.welcomeBack) {
        toast.info(`Welcome back, ${user.name}`);
        setToastShown({ sessionExpired: false, welcomeBack: true });
        navigate('/dashboard');
      }
    }
  }, [isLoggedIn, loading, user, navigate, toastShown]);
};
