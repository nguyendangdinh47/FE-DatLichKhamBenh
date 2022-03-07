import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import { unwrapResult } from '@reduxjs/toolkit';
import React from 'react';
import { Card } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { toast } from 'react-toastify';
import LoginForm from '../Login/form';
import { login } from '../userSlice';

Login.propTypes = {
  // closeDialog: PropTypes.func,
};

const useStyles = makeStyles((theme) => ({
  paper: {
    // marginTop: theme.spacing(8),
    // display: 'flex',
    // flexDirection: 'column',
    // alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Login() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const handleSubmit = async (values) => {
    try {
      const data = unwrapResult(await dispatch(login(values)));
      toast.success('Đăng nhập thành công !');
      if (data.typeAccountId == 1) return history.push('/');
      if (data.typeAccountId == 2) return history.push('/doctor/patient-detail');
      if (data.typeAccountId == 3) return history.push('/admin');
      // history.push('/');
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Card className="mb-5 mt-4 py-5">
        <div className="d-flex flex-row align-items-center justify-content-center">
          <div className="">
            <img
              src={require('../../../static/section/login.png').default}
              style={{ maxWidth: 450, width: '100%' }}
              alt="Fail"
            />
          </div>
          <div className="w-50">
            <LoginForm onSubmit={handleSubmit} />
          </div>
        </div>
      </Card>
    </Container>
  );
}
