import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Image, Linking} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import IonsIcon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

import HomeScreen from './Home';
import CourseScreen from './Course';
import ProductScreen from './Product';
import ProfileScreen from './Profile';
import NotPermision from './NotPermision';
import LoadingScreen from './LoadingScreen';
import {getValueFor, deleteItem} from '../Storage';
import {Actions} from 'react-native-router-flux';
import {appversion} from '../../Database';
import {ConfirmMessageModal} from '../MessageModal';
import NetInfo from '@react-native-community/netinfo';
import ChatScreen from './Chats';
import Icon from 'react-native-vector-icons/Ionicons';
import {I, C} from '../Database';
import {isEdit} from '../../Database';
// Screen names

const homeName = 'Home';
const courseName = 'Course';
const productName = 'Product';
const profileName = 'Profile';
const chatName = 'Transfer Photo';

const Tab = createBottomTabNavigator();

const styles = StyleSheet.create({
  appbar: {
    padding: 5,
    backgroundColor: '#f2f4f7',
    flex: 1,
    flexDirection: 'row',
    flexGrow: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
  },
});

const unsubscribe = NetInfo.addEventListener(state => {
  console.log('Connection type', state.type);
  console.log('Is connected?', state.isConnected);
});

export default function MainContainer() {
  const [courseData, setCourseData] = React.useState(null);

  const [proudctData, setProductData] = React.useState(null);

  const [profiledata, Setprofiledata] = useState(null);

  const [updateData, setupdateData] = useState();
  const [isupdate, setIsupdate] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [i, setIState] = useState(false);

  useEffect(() => {
    // Unsubscribe
    // FetchData();

    // while (!is_loaded) {
    //   FetchData();
    //   console.log(!is_loaded);
    // }
    // while (true) {
    //
    // }
    NetInfo.fetch().then(state => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
      setIState(state.isConnected);
      if (state.isConnected) {
        FetchData();
      } else {
        alert('No Internet Connection, Please Check your Internet Connection');
      }
    });
  });

  const FetchData = () => {
    setTimeout(() => {
      if (profiledata === null) {
        FetchProfileData();
        FetchVersion();
      }
      if (courseData === null) {
        FetchCourseData();
      }
      if (proudctData === null) {
        FetchProductData();
      }
    }, 1000);
  };
  const OnClose = () => setUpdateModal(false);
  const onConfirm = () => {
    console.log(updateData.url);
    Linking.openURL(updateData.url);
  };

  const FetchVersion = async () => {
    axios
      .get('/api/version/')
      .then(res => {
        console.log(res.data.version);
        setupdateData(res.data);
        if (res.data.version == appversion) {
          setIsupdate(false);
        } else {
          setIsupdate(true);
          setUpdateModal(true);
        }
        console.log(res, 'Version');
      })
      .catch(err => {
        console.log(err.response);
      });
  };

  const FetchProfileData = async () => {
    axios
      .get('/api/profile/')
      .then(res => {
        Setprofiledata(res.data);
      })
      .catch(err => {
        if (err.response.status == 401) {
          deleteToken();
        }
        if (err.message == 'Network Error') {
          if (i) {
            FetchData();
          } else {
            alert(
              'No Internet Connection, Please Check your Internet Connection',
            );
          }
        }
      });
  };

  const FetchCourseData = async () => {
    axios
      .get('/api/course/')
      .then(res => {
        console.log(res.data, 'Course Data ');
        setCourseData(res.data);
      })
      .catch(err => {
        console.log(err);
        if (err.response.status == 401) {
          deleteToken();
        }
      });
  };

  const FetchProductData = async () => {
    axios
      .get('/api/product/')
      .then(res => {
        setProductData(res.data);
      })
      .catch(err => {
        console.log(err);
        if (err.response.status == 401) {
          console.log('Status Deleted');
          deleteToken();
          Actions.login();
        }
      });
  };

  const deleteToken = () => {
    if (getValueFor('secure_token')) {
      deleteItem('secure_token');
    }
  };

  if (profiledata && proudctData && courseData) {
    return (
      <NavigationContainer>
        <ConfirmMessageModal
          show={updateModal}
          closetext={'Close'}
          confirmtext={'Update'}
          onClose={OnClose}
          onConfirm={onConfirm}>
          <Text style={{color: 'black'}}>
            This App Version is out of date. Please update new version.
          </Text>
        </ConfirmMessageModal>
        <Tab.Navigator
          initialRouteName={homeName}
          screenOptions={({route}) => ({
            tabBarIcon: ({focused, color, size}) => {
              let iconName;
              let rn = route.name;

              if (rn === homeName) {
                iconName = focused ? 'home' : 'home-outline';
              } else if (rn === courseName) {
                iconName = focused ? 'book' : 'book-outline';
              } else if (rn === productName) {
                iconName = focused ? 'cart' : 'cart-outline';
              } else if (rn === profileName) {
                iconName = focused ? 'person-circle' : 'person-circle-outline';
              }
              return <IonsIcon name={iconName} size={size} color={color} />;
            },
            headerShown: false,
            tabBarShowLabel: true,
            tabBarActiveTintColor: 'red',
            tabBarInactiveTintColor: 'black',
          })}>
          <Tab.Screen
            name={homeName}
            component={HomeScreen}
            initialParams={{
              p_d: profiledata,
              pd_d: proudctData,
              c_d: courseData,
            }}
          />

          <Tab.Screen
            name={productName}
            component={ProductScreen}
            initialParams={{
              nav: 'ProductReal',
              proudctData: proudctData,
            }}
          />

          <Tab.Screen
            name={chatName}
            component={ChatScreen}
            initialParams={{
              profiledata: profiledata,
            }}
            options={{
              unmountOnBlur: false,
              tabBarIcon: ({focused}) => (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 50,
                    borderColor: focused ? 'red' : '#ff0090',
                    borderWidth: 2,
                    backgroundColor: 'white',
                    bottom: 5,
                    width: 50,
                    height: 50,
                  }}>
                  <Image
                    source={focused ? I.send : I.send2}
                    style={{width: 33, height: 33}}
                    resizeMode="contain"
                  />
                </View>
              ),
            }}
          />

          <Tab.Screen
            name={courseName}
            component={CourseScreen}
            initialParams={{cdata: courseData}}
          />
          <Tab.Screen
            name={profileName}
            component={ProfileScreen}
            initialParams={{profiledata: profiledata, courseData: courseData}}
          />
        </Tab.Navigator>
      </NavigationContainer>
    );
  } else {
    return <LoadingScreen />;
  }
}
