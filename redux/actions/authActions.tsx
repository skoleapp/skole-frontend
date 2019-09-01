import Router from 'next/router';
import axios from 'axios';
//import { AUTHENTICATE, USER } from '../types';
import { API } from '../../config';

declare interface FormParams {
  username: string;
  email: string;
  password: string;
}

// register user
export const register = ({ username, email, password }: FormParams, type: string): void => {
  if (type !== 'register') {
    throw new Error('Wrong API call!');
  }
  //console.log(`${API}/${type}`, { username, email, password });

  console.log('test');
  axios
    .post(`http://localhost:8000/api/user`, {
      username,
      email,
      password
    })
    .then(response => {
      console.log(response);
      Router.push('/signin');
      //console.log(response.data.meta.message);
    })
    .catch(err => {
      console.log(err);
    });
};

// gets token from the api and stores it in the redux store and in cookie
export const authenticate = ({ email, password }: FormParams, type: string): any => {
  if (type !== 'login') {
    throw new Error('Wrong API call!');
  }
  axios
    .post(`${API}/${type}`, { email, password })
    .then(response => {
      console.log(response);
      //Router.push('/users');
      /*         dispatch({
          type: AUTHENTICATE,
          payload: response.data.data.user.token
        }); */
    })
    .catch(error => {
      console.log(error);
    });
};

export const getUser = ({ token }: { token: string }, type: string) => {
  console.log(token);
  axios
    .get(`${API}/${type}`, {
      headers: {
        Authorization: 'bearer ' + token
      }
    })
    /*       .then(response => {
        dispatch({ type: USER, payload: response.data.data.user });
      }) */
    .catch(error => {
      console.log(error);
    });
};

export default {
  register,
  authenticate,
  getUser
};
