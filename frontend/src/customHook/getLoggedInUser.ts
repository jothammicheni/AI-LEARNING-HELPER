import { useState, useEffect } from 'react';
import axios from 'axios';
import { User } from '../interfaces/Types';

const BACKEND_URL = 'http://localhost:5007';
const API_URL = `${BACKEND_URL}/users/`;



const ActiveUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(API_URL + 'getLoggedInUser', {
          withCredentials: true,
        });
        setUser(response.data.user);
      } catch (error) {
        setError('Failed to fetch user');
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    getUser();
    
  }, []);

  return { user, loading, error };

};

export default ActiveUser;
