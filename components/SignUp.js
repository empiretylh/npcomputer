import React, {useState} from 'react';
import {
  View,
  KeyboardAvoidingView,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {COLOR, IMAGE} from '../Database';
import Icons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import MsgModal from './MessageModal';

import {Actions} from 'react-native-router-flux';
import {
  validateEmail,
  validatePhoneNumber,
  validateUsername,
} from './screens/Validation';

import EncryptedStorage from 'react-native-encrypted-storage';
import Loading from './screens/Loading';

import ReactNative from 'react-native';
const TextInput = (props)=> <ReactNative.TextInput {...props} placeholderTextColor={COLOR.textmuted}/>
const Signup = ({navigation}) => {
  const [showpassword, setShowpassword] = useState(true);
  const [data, setData] = useState([]);
  const [isload, setIsLoad] = useState(false);
  const [isregister, setIsRegister] = useState(true);

  const [msgshow, setMsgShow] = useState(false);
  const [usernametext, setUsernametext] = useState(
    'Do not space between the letters',
  );
  const [utc, setutc] = useState('black');
  const OnMsgShow = () => {
    setMsgShow(!msgshow);
  };

  const [b_u, setB_u] = useState(false);

  let t_u;
  const CheckUserName = user => {
    const u = validateUsername(user);
    let c;
    if (user !== t_u) {
      
      t_u = user;
      axios
        .post('/api/checkuser/', {user: user})
        .then(res => {
          console.log(res.data);
          c = res.data;
          console.log(c == 0, 'black');
          setB_u(c == 0);
          if (c == 1) {
            setUsernametext('The username is already exists try another');
            setutc('red');
          }else{
            setUsernametext("Don't space between the letters and please use numbers.");
            setutc('orange')
          }
        })
        .catch(err => console.log(err));
    }
    return b_u && u;
  };

  const OnTextChange = (e, name) => {
    if (name === 'email') {
      validateEmail(e);
    }
    if (name === 'phoneno') {
      validatePhoneNumber(e);
    }

    const tempdata = {...data, [name]: e};

    setData(tempdata);

    console.log(data, 'blackblack');
    if (
      tempdata.first_name &&
      tempdata.last_name &&
      CheckUserName(tempdata.username) &&
      validateEmail(tempdata.email) &&
      validatePhoneNumber(tempdata.phoneno) &&
      confirmPassswordValidate(tempdata.confirm_password)
    ) {
      setIsRegister(false);
    }
  };

  const confirmPassswordValidate = text => {
    if (text) {
      if (text == data.password) {
        return true;
      } else {
        return false;
      }
    }
  };
  async function saveData(key, value) {
    await EncryptedStorage.setItem(key, value);
  }

  async function getValueFor(key) {
    let result = await EncryptedStorage.getItem(key);
    console.log(result, 'Token result');
  }

  const handleRequest = () => {
    setIsLoad(true);
    console.log('requesting...');
    axios
      .post(`/api/auth/register/`, data)

      .then(response => {
        const {token, user} = response.data;
        setIsLoad(false);

        axios.defaults.headers.common = {Authorization: `Token ${token}`};
        saveData('secure_token', token);
        getValueFor('secure_token');

        Actions.main();

        console.log(response);
      })
      .catch(error => {
        console.log(error);
        setIsLoad(false);
      });
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <Loading show={isload} />
      <MsgModal show={msgshow} onClose={OnMsgShow} closetext={'OK'}>
        <View>
          <Text style={{fontSize: 15, fontWeight: '200'}}>Error</Text>
        </View>
      </MsgModal>
      <ScrollView>
        <View
          style={{
            flexDirection: 'row',
            margin: 5,
            alignItems: 'center',
          }}>
          <Image
            source={IMAGE.np}
            style={{width: 50, height: 50}}
            resizeMode="contain"
          />
          <Text
            style={{
              fontSize: 25,
              fontFamily: '500',
              marginLeft: 15,
              color: 'black',
            }}>
            Sign Up
          </Text>
        </View>
        <View>
          <View style={styles.form}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-around',
              }}>
              <View style={{width: '45%'}}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '500',
                    color: 'black',
                  }}>
                  First Name
                </Text>
                <TextInput
                  style={styles.textinput}
                  placeholder="First Name"
                  name="firstname"
                  onChangeText={e => OnTextChange(e, 'first_name')}
                />
              </View>
              <View style={{width: '45%'}}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '500',
                    color: 'black',
                  }}>
                  Last Name
                </Text>
                <TextInput
                  style={styles.textinput}
                  name="lastname"
                  onChangeText={e => OnTextChange(e, 'last_name')}
                  placeholder="Last Name"
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'space-around',
              }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '500',
                  color: 'black',
                }}>
                Username
              </Text>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#C4C4C4',
                  borderRadius: 15,
                }}>
                <TextInput
                  style={styles.icontextinput}
                  onChangeText={e => OnTextChange(e, 'username')}
                  name="username"
                  placeholder="yourname2022"
                  autoComplete="username"
                />

                <Icons
                  name={
                    CheckUserName(data.username)
                      ? 'checkmark-circle'
                      : 'close-circle'
                  }
                  color={CheckUserName(data.username) ? '#00ff59' : '#f70a0a'}
                  style={styles.icon}
                  size={30}
                />
              </View>
              <Text style={{color: utc}}>{usernametext}</Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '500',
                  marginTop: 15,
                  color: 'black',
                }}>
                Email
              </Text>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#C4C4C4',
                  borderRadius: 15,
                }}>
                <TextInput
                  style={styles.icontextinput}
                  onChangeText={e => OnTextChange(e, 'email')}
                  name="value"
                  placeholder="yourname@gmail.com"
                  autocomplete="email"
                />

                <Icons
                  name={
                    validateEmail(data.email)
                      ? 'checkmark-circle'
                      : 'close-circle'
                  }
                  color={validateEmail(data.email) ? '#00ff59' : '#f70a0a'}
                  style={styles.icon}
                  size={30}
                />
              </View>

              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '500',
                  marginTop: 15,
                  color: 'black',
                }}>
                Phone Number
              </Text>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#C4C4C4',
                  borderRadius: 15,
                }}>
                <TextInput
                  style={styles.icontextinput}
                  onChangeText={e => OnTextChange(e, 'phoneno')}
                  name="phonenumber"
                  placeholder="09xxxxxxxxx"
                  keyboardType="numeric"
                />

                <Icons
                  name={
                    validatePhoneNumber(data.phoneno)
                      ? 'checkmark-circle'
                      : 'close-circle'
                  }
                  color={
                    validatePhoneNumber(data.phoneno) ? '#00ff59' : '#f70a0a'
                  }
                  style={styles.icon}
                  size={30}
                />
              </View>

              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '500',
                  marginTop: 15,
                  color: 'black',
                }}>
                Password
              </Text>

              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#C4C4C4',
                  borderRadius: 15,
                }}>
                <TextInput
                  style={{
                    flex: 1,
                    backgroundColor: '#C4C4C4',
                    height: 50,
                    borderRadius: 15,
                    padding: 5,
                    paddingRight: 20,
                    fontSize: 16,
                  }}
                  secureTextEntry={showpassword}
                  placeholder="Password"
                  name="password"
                  onChangeText={e => {
                    OnTextChange(e, 'password');
                  }}
                />
                <TouchableOpacity
                  onPress={() => setShowpassword(!showpassword)}>
                  <Icons
                    name={showpassword ? 'eye' : 'eye-off'}
                    style={styles.icon}
                    size={30}
                  />
                </TouchableOpacity>
              </View>

              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '500',
                  marginTop: 15,
                  color: 'black',
                }}>
                Confirm Password
              </Text>

              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#C4C4C4',
                  borderRadius: 15,
                }}>
                <TextInput
                  style={{
                    flex: 1,
                    backgroundColor: '#C4C4C4',
                    height: 50,
                    borderRadius: 15,
                    padding: 5,
                    paddingRight: 20,
                    fontSize: 16,
                  }}
                  secureTextEntry={showpassword}
                  placeholder="Re-type password"
                  onChangeText={e => {
                    OnTextChange(e, 'confirm_password');
                  }}
                />
                <Icons
                  name={
                    confirmPassswordValidate(data.confirm_password)
                      ? 'checkmark-circle'
                      : 'close-circle'
                  }
                  color={
                    confirmPassswordValidate(data.confirm_password)
                      ? '#00ff59'
                      : '#f70a0a'
                  }
                  style={styles.icon}
                  size={30}
                />
              </View>

              <TouchableOpacity
                onPress={() => handleRequest()}
                disabled={isregister}>
                <View style={styles.button}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: 'white',
                      fontWeight: '500',
                    }}>
                    Create Account
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={{alignItems: 'center', padding: 3}}>
          <Text
            style={{
              fontSize: 15,
              fontWeight: '500',
              color: COLOR.textmuted,
            }}>
            NP Computer © 2021-2022
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: COLOR.windowWidth * 100,

    backgroundColor: COLOR.backgroundcolor,
  },
  form: {
    flex: 1,

    margin: 10,
  },
  textinput: {
    backgroundColor: '#C4C4C4',
    height: 50,
    borderRadius: 15,
    padding: 5,
    fontSize: 16,
  },
  button: {
    backgroundColor: COLOR.blackbutton,
    padding: 20,
    marginTop: 20,
    borderRadius: 15,
    color: 'white',
    alignItems: 'center',
  },
  icon: {
    paddingRight: 20,
  },
  icontextinput: {
    flex: 1,
    backgroundColor: '#C4C4C4',
    height: 50,
    borderRadius: 15,
    padding: 5,
    paddingRight: 20,
    fontSize: 16,
  },
});

export default Signup;
