import React, {useEffect, useState} from 'react';
import {Scene, Stack, Router, Actions} from 'react-native-router-flux';

import Login from './Login';
import Signup from './SignUp';

import Settings from './screens/Settings';
import MainContainer from './screens/MainContainer';
import axios from 'axios';
import {baseUrl} from '../Database';
import {View, Text} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import LoadingScreen from './screens/LoadingScreen';

import AddContact from './screens/AddContact';
import FaqScreen from './screens/FaqScreen';
import ChatScreen from './screens/Chats';

const container = () => {
  console.log(
    axios.defaults.headers.common,
    'Is there any token in axios headers.....',
  );

  const [token_data, setTokenData] = useState();

  async function getValueFor(key) {
    let result = await EncryptedStorage.getItem(key);
    if (key == 'secure_token') {
      if (result == null) {
        console.log(result, 'Token result');
        setTimeout(() => {
          setTokenData('login');
        }, 3000);
      } else {
        setTokenData(result);
        axios.defaults.headers.common = {Authorization: `Token ${result}`};
      }
    }
    return result;
  }

  const [isphoneno, setIsPhoneno] = useState();
  useEffect(() => {
    getValueFor('secure_token');
    isPhonenoFunc();
  });
  getValueFor('secure_token');

  async function isPhonenoFunc() {
    let result = await EncryptedStorage.getItem('IsPhoneno');
    console.log('Result Phone no', result);
    if (result == null) {
      setIsPhoneno(false);
    } else {
      setIsPhoneno(true);
    }
  }

  axios.defaults.baseURL = baseUrl;
  if (token_data != null) {
    return (
      <Router>
        <Stack hideNavBar key="root">
          <Stack hideNavBar key="auth" type="reset">
            <Scene
              key="login"
              component={token_data == 'login' ? Login : MainContainer}
              initial={isphoneno == true}
            />
            <Scene
              key="addcontact"
              component={AddContact}
              initial={isphoneno == false}
            />
            <Scene key="register" component={Signup} />
            <Scene key="settings" component={Settings} />
            <Scene key="Faq" component={FaqScreen} />
          </Stack>
          <Stack key="main" hideNavBar type="reset">
            <Scene title="Home" key="home" component={MainContainer} initial />
            <Scene key="settings" component={Settings} />
            <Scene key="Faq" component={FaqScreen} />
          </Stack>
        </Stack>
      </Router>
    );
  } else {
    return <LoadingScreen />;
  }
};

export default container;
