import * as Yup from 'yup';

export const registerSchema = Yup.object().shape({
  username: Yup.string()
    .label('Username')
    .required('Username is required.'),
  email: Yup.string()
    .label('Email')
    .email('Invalid email.')
    .required('Email is required.'),
  password: Yup.string()
    .label('Password')
    .min(6, 'Password must be at least 6 characters long.')
    .required('Password is required.'),
  confirmPassword: Yup.string()
    .label('Confirm Password')
    .oneOf([Yup.ref('password'), null], 'Passwords do not match.')
    .required('Confirm password is required.'),
  agreeToTerms: Yup.boolean()
    .label('Agree to Terms')
    .test('is-true', 'You must agree to terms to continue', (value: boolean) => value === true)
});

export const loginSchema = Yup.object().shape({
  usernameOrEmail: Yup.string()
    .label('Username or email')
    .required('Username or email is required.'),
  password: Yup.string()
    .label('Password')
    .required('Password is required!')
});
