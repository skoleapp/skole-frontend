import { Dispatch } from 'redux';
import { AuthParams } from './interfaces';
import { LOGIN } from './types';

interface Response {
  user: string;
  token: string;
}

export const login = (params: AuthParams) => async (dispatch: Dispatch): Promise<Response> => {
  console.log(params);

  dispatch({ type: LOGIN });

  //   TODO: Consume Skole API like below

  //   const apiInstance = new SkoleApi();

  //   const payload = { ...params }

  //   try {
  //     const res = await apiInstance.updatePet(payload);
  //     console.log(res);
  //   } catch (err) {
  //     console.log(err);
  //   }

  // This is just a mock
  return new Promise<Response>(resolve =>
    resolve({
      user: 'test',
      token: 'test'
    })
  );
};
