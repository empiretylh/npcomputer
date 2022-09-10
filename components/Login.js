import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import axios from 'axios';
import {Actions} from 'react-native-router-flux';
import {COLOR, IMAGE, baseUrl} from '../Database';
import Icons from 'react-native-vector-icons/Ionicons';
import MsgModal from './MessageModal';

import EncryptedStorage from 'react-native-encrypted-storage';
import Loading from './screens/Loading';
import Text from './DefaultText';

import ReactNative from 'react-native';

// Import RNFetchBlob for the file download
import RNFetchBlob from 'rn-fetch-blob';

import {
  copyFileAssets,
  DocumentDirectoryPath,
  FileProtectionKeys,
} from 'react-native-fs';

import {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager,
} from 'react-native-fbsdk';

const TextInput = props => (
  <ReactNative.TextInput {...props} placeholderTextColor={COLOR.textmuted} />
);

const Login = ({navigation}) => {
  const [showpassword, setShowpassword] = useState(true);
  const [data, setData] = useState([]);
  const [msgshow, setMsgShow] = useState(false);
  const [isLoad, setIsLoad] = useState(false);
  const [fbinfo, setFbinfo] = useState([]);
  const [loginfo,setLinfo] = useState('');

  const OnMsgShow = () => setMsgShow(!msgshow);

  const OnTextChange = (e, name) => {
    const tempdata = {...data, [name]: e};

    setData(tempdata);

    console.log(data, tempdata);
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
    axios
      .post(`api/auth/login/`, data)

      .then(response => {
        const {token, username} = response.data;

        axios.defaults.headers.common = {Authorization: `Token ${token}`};
        saveData('secure_token', token);
        getValueFor('secure_token');

        console.log(token, response, username);
        setIsLoad(false);
        Actions.main();
      })
      .catch(error => {
        console.log(error);
        setIsLoad(false);
        OnMsgShow();
      });
  };

  const getResponseInfo = (error, result) => {
    if (error) {
      //Alert for the Error
      alert('Error fetching data: ' + error.toString());
    } else {
      //response alert
      console.log(JSON.stringify(result));

      const datas = {
        username: result.id,
        first_name: result.first_name,
        last_name: result.last_name,
        email: result.email,
      };
      setFbinfo(datas);

      console.log('Now Download Image');
      checkPermissionandDownloadImage(datas, result.picture.data.url);
    }
  };

  const LoginToServer = data => {
    console.log(data, 'We are loggin to server');
    setLinfo('Posting to Server ...');
    let formdata = new FormData();
    formdata.append('username', data.username);
    formdata.append('first_name', data.first_name);
    formdata.append('last_name', data.last_name);
    formdata.append('email', data.email);
    formdata.append('profileimage', data.profileimage),
      console.log(formdata, 'formdata');
    axios
      .post('api/auth/fblogin/', formdata, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => {
        const {token, username} = response.data;

        axios.defaults.headers.common = {Authorization: `Token ${token}`};
        saveData('secure_token', token);
        getValueFor('secure_token');

        console.log(token, response, username);
        setIsLoad(false);
        Actions.main();
      })
      .catch(err => {
        console.log(err);
      });
  };

  const LoginWithFacebook = () => {
    // Attempt a login using the Facebook login dialog asking for default permissions.

    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      login => {
        if (login.isCancelled) {
          console.log('Login cancelled');
        } else {
          AccessToken.getCurrentAccessToken().then(data => {
            console.log(data.accessToken.toString());
            setIsLoad(true);
            setLinfo('Fetching Data From Facebook ...');
            const processRequest = new GraphRequest(
              '/me?fields=name,first_name,last_name,picture.type(large),email',
              null,
              getResponseInfo,
            );
            // Start the graph request.
            new GraphRequestManager().addRequest(processRequest).start();
          });
        }
      },
      error => {
      
        console.log('Login fail with error: ' + error);
      },
    );
    console.log('Login With Facebook');
  };

  const checkPermissionandDownloadImage = async (data, url) => {
    // Function to check the platform
    // If iOS then start downloading
    // If Android then ask for permission

    if (Platform.OS === 'ios') {
      downloadImage(data, url);
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'App needs access to your storage to download Photos',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Once user grant the permission start downloading
          console.log('Storage Permission Granted.');
          downloadImage(data, url);
        } else {
          // If permission denied then show alert
          alert('Storage Permission Not Granted');
        }
      } catch (err) {
        // To handle permission related exception
        console.warn(err);
      }
    }
  };

  const downloadImage = (data, url) => {
    // Main function to download the image
    setLinfo('Downloading Pic..');
    // To add the time suffix in filename
    let date = new Date();
    // Image URL which we want to download
    let image_URL = url;
    // Getting the extention of the file

    // Get config and fs from RNFetchBlob
    // config: To pass the downloading related options
    // fs: Directory path where we want our image to download
    const {config, fs} = RNFetchBlob;
    let PictureDir = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        // Related to the Android only
        useDownloadManager: true,
        notification: true,
        path:
          PictureDir +
          '/image_/np/' +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          '.jpg',
        description: 'Image',
      },
    };
    config(options)
      .fetch('GET', image_URL)
      .then(res => {
        // Showing alert after successful downloading
        console.log('res -> ', JSON.stringify(res));
      
        const source = {
          uri: 'file://' + res.data.replace('file://'),
          name: getFileName(res.data),
          type: 'image/jpeg',
        };

        const d = {
          ...data,
          profileimage: source,
        };

        LoginToServer(d);

        
      });
  };

  const getFileName = filename => {
    // To get the file extension
    return filename.substr(filename.lastIndexOf('/') + 1, filename.length);
  };


  return (
    <KeyboardAvoidingView style={styles.container}>
      <Loading show={isLoad} infotext={loginfo} />
      <ScrollView style={{flex: 1}}>
        <View>
          <MsgModal show={msgshow} onClose={OnMsgShow} closetext={'OK'}>
            <View>
              <Text style={{fontSize: 15, fontWeight: '200'}}>
                Username or Password is incorrect.
              </Text>
            </View>
          </MsgModal>
          <View style={styles.logo}>
            <Image
              source={IMAGE.np}
              style={{
                width: 100,
                height: 100,
              }}
              resizeMode="contain"
            />
            <Text
              style={{
                fontSize: 25,
                fontWeight: 'bold',
                color: 'black',
              }}>
              NP Computer
            </Text>
            <Text>Digital Photo Printing Services & Computer</Text>
          </View>
          <View style={styles.form}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '500',
                marginTop: 15,
              }}>
              Username
            </Text>
            <TextInput
              style={{
                backgroundColor: '#C4C4C4',
                height: 50,
                borderRadius: 15,
                padding: 5,
                fontSize: 16,
              }}
              placeholder="Username"
              name="username"
              onChangeText={e => OnTextChange(e, 'username')}
            />
            <Text
              style={{
                fontSize: 18,
                fontWeight: '500',
                marginTop: 15,
              }}>
              Password
            </Text>

            <View
              style={{
                width: '100%',
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
                onChangeText={e => OnTextChange(e, 'password')}
              />
              <TouchableOpacity onPress={() => setShowpassword(!showpassword)}>
                <Icons
                  name={showpassword ? 'eye' : 'eye-off'}
                  style={styles.icon}
                  size={30}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => {
                handleRequest();
              }}>
              <View style={styles.button}>
                <Text
                  style={{
                    fontSize: 16,
                    color: 'white',
                    fontWeight: '500',
                  }}>
                  Login
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('register')}>
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
            <TouchableOpacity onPress={() => LoginWithFacebook()}>
              <View
                style={{
                  ...styles.button,
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 10,
                  backgroundColor: '#4267B2',
                }}>
                <Icons
                  name={'logo-facebook'}
                  size={30}
                  color={'#fff'}
                  style={{borderRadius: 50}}
                />
                <Text
                  style={{
                    fontSize: 16,
                    color: 'white',
                    fontWeight: '500',
                    marginLeft: 10,
                  }}>
                  Login with Facebook
                </Text>
              </View>
            </TouchableOpacity>
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
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.backgroundcolor,
  },
  logo: {
    justifyContent: 'center',
    alignItems: 'center',
    top: 80,
  },
  form: {
    flex: 1,
    marginTop: 90,
    margin: 10,
  },
  button: {
    backgroundColor: COLOR.blackbutton,
    padding: 20,
    marginTop: 20,
    borderRadius: 15,
    color: 'white',
    alignItems: 'center',
  },
  copyright: {
    position: 'absolute',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 5,
  },
  icon: {
    paddingRight: 20,
  },
});

export default Login;
