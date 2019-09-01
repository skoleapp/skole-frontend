import Router from 'next/router';
import axios from 'axios';
import { AUTHENTICATE } from '../types';
import { AnyAction } from 'redux';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import { API } from '../../config';

interface FormParams {
  username?: string;
  email: string;
  password: string;
}

const authenticate = (
  { email, password }: FormParams,
  type: string
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  if (type !== 'login') {
    throw new Error('Wrong API call!');
  }
  console.log(email, password);
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    axios
      .post(`${API}/${type}`, { email, password })
      .then(response => {
        console.log(response);

        //setCookie('token', response.data.data.user.token);
        Router.push('/account');
        dispatch({ type: AUTHENTICATE, payload: 'token-1337' });
      })
      .catch(err => {
        console.log(err);
      });
  };
};

// register user
const register = ({ username, email, password }: FormParams, type: string): void => {
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
    })
    .catch(err => {
      console.log(err);
    });
};

export default {
  register,
  authenticate
};
