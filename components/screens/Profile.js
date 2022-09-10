import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Modal,
  Image,
  TouchableOpacity,
 
  TouchableWithoutFeedback,
} from 'react-native';
import axios from 'axios';
import Icons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'react-native-image-picker';
import {I, C} from '../Database';

import FormData from 'form-data';
import Loading from './Loading';
import {requestCameraPermission} from './Permisions';
import Text from '../DefaultText';

import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import ReactNative from 'react-native';
const TextInput = (props)=> <ReactNative.TextInput {...props} placeholderTextColor={C.textmuted}/>

const Icon = props => <Icons {...props} color={'#000'} />;

const Profile = ({navigation, route}) => {
  const {profiledata, courseData} = route.params;

  const [pdata, setPddata] = useState(profiledata);
  const [showmodal, setShowModal] = useState(false);
  const [showeditmodal, setShowEditModal] = useState(false);
  const [editdata, setEditData] = useState(null);

  const [imagedata, setImageData] = useState([]);
  const [isPostSuccess, setIspostsuccess] = useState();

  const [isLoad, setIsLoad] = useState(false);

  const PostImage = source => {
    let data = new FormData();
    setIsLoad(true);
    data.append('image', source);
    console.log(source);
    console.log(data);
    axios
      .post('/api/profile/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(res => {
        setIsLoad(false);
        setPddata(res.data);
      })
      .catch(err => {
        console.log(err);
        setIsLoad(false);
      });
  };

  const LaunchCamera = () => {
    request(PERMISSIONS.ANDROID.CAMERA).then(result => {
      if (result == RESULTS.GRANTED) {
        console.log('launching cameraa');
        let options = {
          storageOptions: {
            skipBackup: true,
            path: 'images',
          },
        };

        ImagePicker.launchCamera(options, res => {
          console.log('Response = ', res);
          if (res.didCancel) {
            console.log('User cancelled image picker');
          } else if (res.error) {
            console.log('ImagePicker Error: ', res.error);
          } else if (res.customButton) {
            console.log('User tapped custom button: ', res.customButton);
            alert(res.customButton);
          } else {
            const source = {
              uri: res.assets[0].uri,
              name: res.assets[0].fileName,
              type: res.assets[0].type,
            };

            console.log(source, 'The ending...');
            PostImage(source);
          }
        });
      }
    });
  };
  const launchImageLibrary = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.launchImageLibrary(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        const source = {
          uri: response.assets[0].uri,
          name: response.assets[0].fileName,
          type: response.assets[0].type,
        };

        console.log(source, 'The ending...');
        PostImage(source);
      }
    });
  };

  const RenderChooseImageModal = props => {
    return (
      <Modal {...props} animationType="slide" transparent={true}>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            width: C.windowWidth * 100,
            height: C.windowHeight * 100,
            backgroundColor: 'transparent',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: '80%',

              backgroundColor: 'white',
              borderRadius: 15,
              padding: 10,
              shadowColor: 'black',
              shadowOffset: {width: 2, height: 3},
              shadowRadius: 5,
              shadowOpacity: 0.4,
            }}>
            <Text style={{fontSize: 20, fontWeight: '600', padding: 10}}>
              Change Profile Picture
            </Text>
            <TouchableOpacity
              style={styles.chooseimagebutton}
              onPress={() => {
                console.log('Take a photo');
                LaunchCamera();
                setShowModal(false);
              }}>
              <Icon name={'camera-outline'} size={25} />
              <Text style={{fontSize: 18, marginLeft: 5, fontWeight: '500'}}>
                Take a Photo
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.chooseimagebutton}
              onPress={() => {
                console.log('Choose Image From Gallery');
                launchImageLibrary();
                setShowModal(false);
              }}>
              <Icon name={'image-outline'} size={25} />
              <Text style={{fontSize: 18, marginLeft: 5, fontWeight: '500'}}>
                Choose Image
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.chooseimagebutton_cancel}
              onPress={() => setShowModal(false)}>
              <Text style={{fontSize: 18, marginLeft: 5, fontWeight: '500'}}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const OnEditApply = d => {
    const data = {};
    data[d.title] = d.value;
    console.log(d);
    setIsLoad(true);
    axios
      .post('/api/profile/', data)
      .then(res => {
        setPddata(res.data);
        setIsLoad(false);
      })
      .catch(err => {
        console.log(err);
        setIsLoad(true);
      });
  };

  const RenderEditModal = props => {
    const [editd, seteditd] = useState(null);
    const onEditData = (e, name) => {
      const tempdata = {...editd, [name]: e};
      console.log(tempdata);
      seteditd(tempdata);
      console.log(e, name);
    };

    useEffect(() => {
      if (editd === null) {
        seteditd(editdata);
      }
    }, []);

    return (
      <Modal {...props} animationType="slide" transparent={true}>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            width: C.windowWidth * 100,
            height: C.windowHeight * 100,
            backgroundColor: 'transparent',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: '80%',

              backgroundColor: 'white',
              borderRadius: 15,
              padding: 10,
              shadowColor: 'black',
              shadowOffset: {width: 2, height: 3},
              shadowRadius: 5,
              shadowOpacity: 0.4,
            }}>
            <Text style={{fontSize: 20, fontWeight: '600', padding: 10}}>
              Change {editd ? editd.title : ''}
            </Text>
            <View>
              <TextInput
                style={{
                  backgroundColor: C.textfield,
                  height: editd && editd.title == 'Purpose' ? 100 : 40,
                  borderRadius: 15,
                  paddingTop: editd && editd.title == 'Purpose' ? 6 : 0,
                  paddingLeft: 6,
                  paddingRight: 5,
                  fontSize: 16,
                }}
                defaultValue={editd ? editd.value : ''}
                multiline={editd && editd.title == 'Purpose' ? true : false}
                onChangeText={text => onEditData(text, 'value')}
              />
            </View>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                style={styles.chooseimagebutton_cancel}
                onPress={() => setShowEditModal(false)}>
                <Text style={{fontSize: 18, padding: 10, fontWeight: '500'}}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.chooseimagebutton_cancel}
                onPress={() => {
                  setShowEditModal(false);
                  console.log(editd.value);
                  OnEditApply(editd);
                }}>
                <Text style={{fontSize: 18, padding: 10, fontWeight: '500'}}>
                  Apply
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  console.log(route);

  let rdco;

  const randomcolor = () => {
    let maxVal = 0xffffff; // 16777215
    let randomNumber = Math.random() * maxVal;
    randomNumber = Math.floor(randomNumber);
    randomNumber = randomNumber.toString(16);
    let randColor = randomNumber.padStart(6, 0);
    console.log(randColor.toUpperCase());
    rdco = `#${randColor.toUpperCase()}`;
    return `#${randColor.toUpperCase()}`;
  };

  const bwcolor = color => {
    if (color.includes('F')) {
      return 'white';
    } else {
      return 'black';
    }
  };

  function invertColor(hex) {
    if (hex.indexOf('#') === 0) {
      hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
      throw new Error('Invalid HEX color.');
    }
    // invert color components
    var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
      g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
      b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
    // pad each with zeros and return
    return '#' + padZero(r) + padZero(g) + padZero(b);
  }

  function padZero(str, len) {
    len = len || 2;
    var zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
  }

  return (
    <View style={styles.contianer}>
      <RenderChooseImageModal visible={showmodal} />
      <Loading show={isLoad} />
      <RenderEditModal visible={showeditmodal} />
      <ScrollView style={styles.contianer}>
        <View style={styles.profileimage}>
          <View
            style={{
              position: 'absolute',
              flexDirection: 'column',

              alignItems: 'center',
              bottom: '-50%',
            }}>
            <View style={{}}>
              <Image
                source={
                  pdata.profileimage
                    ? {
                        uri: axios.defaults.baseURL + pdata.profileimage,
                      }
                    : I.profile
                }
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 100,
                  borderColor: 'white',
                  borderWidth: 3,
                }}
                resizeMode="cover"
              />
              <TouchableOpacity onPress={() => setShowModal(true)}>
                <Icon
                  name="camera"
                  style={{
                    position: 'absolute',
                    right: -5,
                    bottom: 0,
                    backgroundColor: 'white',
                    borderRadius: 100,
                    padding: 5,
                  }}
                  size={20}
                />
              </TouchableOpacity>
            </View>
            <Text
              style={{
                fontSize: 25,
                fontWeight: '700',
                color: 'black',
              }}>
              {pdata.first_name + ' ' + pdata.last_name}
            </Text>
            <Text>{pdata.username}</Text>
          </View>
        </View>
        <View
          style={{
            position: 'relative',
            margin: 10,
            padding: 10,
            backgroundColor: 'white',
            borderRadius: 15,
          }}>
          {pdata.is_student ? (
            <View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon name="book-outline" size={30} color={'balck'} />
                <Text
                  style={{
                    marginLeft: 5,
                    fontSize: 15,
                    color: 'black',
                    fontWeight: '600',
                  }}>
                  Course
                </Text>
              </View>
              <View style={{flexDirection: 'column'}}>
                {courseData['courseuserget'].map((data, id) => (
                  <Text
                    key={id}
                    style={{
                      padding: 10,
                      backgroundColor: randomcolor(),
                      color: 'white',

                      marginBottom: 5,
                      borderRadius: 15,
                      fontSize: 15,
                      fontWeight: '600',
                      textShadowColor: 'black',
                      textShadowOffset: {width: 3, height: 2.5},
                      textShadowRadius: 2,
                    }}>
                    {id + 1} {data.course_name}
                  </Text>
                ))}
              </View>
            </View>
          ) : (
            <View></View>
          )}
          <View style={{marginTop: 10}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon name="person-outline" size={30} />
              <Text
                style={{
                  marginLeft: 5,
                  fontSize: 15,
                  color: 'black',
                  fontWeight: '600',
                }}>
                About
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'space-around',
              }}>
              {/*Email */}
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  padding: 10,
                  backgroundColor: 'white',
                  shadowColor: 'black',
                  shadowOffset: {width: 1, height: 2},
                  shadowRadius: 3,
                  shadowOpacity: 0.4,
                  borderRadius: 15,
                  alignItems: 'center',
                  marginBottom: 10,
                }}
                onPress={() => {
                  setEditData({title: 'Email', value: pdata.email});
                  setShowEditModal(true);
                }}>
                <Icon name="mail-outline" size={25} style={{marginRight: 10}} />
                <Text style={{fontSize: 15, color: 'black'}}>
                  {pdata.email}
                </Text>
              </TouchableOpacity>
              {/*Phone no */}
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  padding: 10,
                  backgroundColor: 'white',
                  shadowColor: 'black',
                  shadowOffset: {width: 1, height: 2},
                  shadowRadius: 3,
                  shadowOpacity: 0.4,
                  borderRadius: 15,
                  alignItems: 'center',
                  marginBottom: 10,
                }}
                onPress={() => {
                  setEditData({title: 'Phone Number', value: pdata.phoneno});
                  setShowEditModal(true);
                }}>
                <Icon name="call-outline" size={25} style={{marginRight: 10}} />

                <Text style={{fontSize: 15, color: 'black'}}>
                  {pdata.phoneno}
                </Text>
              </TouchableOpacity>
              {/*Email */}
              <TouchableOpacity
                style={{
                  flexDirection: 'column',
                  padding: 10,
                  backgroundColor: 'white',
                  shadowColor: 'black',
                  shadowOffset: {width: 1, height: 2},
                  shadowRadius: 3,
                  shadowOpacity: 0.4,
                  borderRadius: 15,

                  marginBottom: 10,
                }}
                onPress={() => {
                  setEditData({title: 'Purpose', value: pdata.studentpurpose});
                  setShowEditModal(true);
                }}>
                <Icon
                  name="information-circle-outline"
                  size={25}
                  style={{marginRight: 10}}
                />
                <Text style={{fontSize: 15, color: 'black'}}>
                  {pdata.studentpurpose}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  contianer: {
    flex: 1,
  },
  profileimage: {
    justifyContent: 'center',
    alignItems: 'center',
    width: C.windowWidth * 100,
    height: 150,
    backgroundColor: '#212529',
    marginBottom: '20%',
  },
  backgroundcover: {},
  chooseimagebutton: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    margin: 5,
    borderRadius: 15,
  },
  chooseimagebutton_cancel: {
    padding: 10,

    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    margin: 5,
    borderRadius: 15,
  },
});

export default Profile;
