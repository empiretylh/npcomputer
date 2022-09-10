/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, version} from 'react';
import {
  View,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Linking,
  PermissionsAndroid,
} from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'react-native-image-picker';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import {
  copyFileAssets,
  DocumentDirectoryPath,
  FileProtectionKeys,
} from 'react-native-fs';
import RNFS from 'react-native-fs';
import {zip} from 'react-native-zip-archive';
import {I, C} from '../Database';
import Icons from 'react-native-vector-icons/Ionicons';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import ImageZoom from 'react-native-image-pan-zoom';
import Text from '../DefaultText';
import {isEdit} from '../../Database';
import * as Progress from 'react-native-progress';
import MessageModal, {MessageModalNormal} from '../MessageModal';
import WifiManager from 'react-native-wifi-reborn';
import {saveData, getValueFor} from '../Storage';

import EncryptedStorage from 'react-native-encrypted-storage';

const Stack = createNativeStackNavigator();
let picid = 0;

String.prototype.replaceAllTxt = function replaceAll(search, replace) {
  return this.split(search).join(replace);
};
const Chat = ({navigation, route}) => {
  const {profiledata} = route.params;
  const [showcm, setShowCm] = useState(false);
  const [local_url, setLocalUrl] = useState();
  const [iswc, setwc] = useState(false);

  const SendDataView = ({navigation, route}) => {
    const [show, setShow] = useState(false);
    const {data, type} = route.params;
    const [pic, setPic] = useState(data);

    const [text, setText] = React.useState();
    const token = '5499662958:AAEAoWy0khLJMf238ZwvvEoBV1FKfaVF6S0';
    const chatid = '-618629809';
    const [issend, setIsSend] = useState(false);
    const [u_show, setU_show] = useState(false);
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'null',
    };
    useEffect(() => {
      setShow(true);
      isEdit.ChangeEdit = true;
      isEdit.setData = pic;
      isEdit.setType = type;
      const headers = {
        'Content-Type': 'application/json',
        Authorization: 'null',
      };
      axios
        .get(local_url + '/api/transferable/', {headers: headers})
        .then(res => {
          setwc(true);
        })
        .catch(err => setwc(false));
    }, []);

    const RemovePic = pic_uri => {
      const temppic = pic.filter(p => p.uri != pic_uri);
      setPic(temppic);
    };

    const PictureItem = ({item}) => {
      return (
        <View style={{margin: 0.5}}>
          <TouchableOpacity onPress={() => console.log('press')}>
            <Image
              source={{uri: item.uri}}
              style={{
                width: C.windowWidth * 32.3,
                height: C.windowWidth * 32.3,
              }}
              resizeMode="cover"
              resizeMethod={'resize'}
            />
          </TouchableOpacity>
          <View style={{position: 'absolute', right: 2}}>
            <TouchableOpacity onPress={() => RemovePic(item.uri)}>
              <Icons name={'close-circle'} size={30} color={'#ff0000'} />
            </TouchableOpacity>
          </View>
        </View>
      );
    };

    const AddPic = pic_uri => {
      // const temppic = pic.filter(p => p != pic_uri);

      const tempic = pic.concat(pic_uri);
      const uniquePic = tempic.filter(function (item, pos) {
        return tempic.indexOf(item) == pos;
      });
      setPic(uniquePic);
    };

    const RenderPicture = () => {
      return (
        <FlatList
          contentContainerStyle={{
            width: '100%',
            margin: 5,
            justifyContent: 'space-around',
          }}
          data={pic}
          renderItem={PictureItem}
          keyExtractor={item => {
            picid += 1;
            return picid;
          }}
          numColumns={3}
          removeClippedSubviews={true} // Unmount components when outside of window
          initialNumToRender={2} // Reduce initial render amount
          maxToRenderPerBatch={1} // Reduce number in each render batch
          updateCellsBatchingPeriod={100} // Increase time between renders
          windowSize={7} // Reduce the window size
        />
      );
    };

    const launchImageLibrary = () => {
      // ...}
      let options = {
        mediaType: 'image',
        doneTitle: 'Done',
        maxSelectedAssets: iswc ? 150 : 30,
      };
      MultipleImagePicker.openPicker(options).then(res => {
        let photoarray = [];
        let photouri = [];
        res.map(source => {
          const photo = {
            uri: 'file://' + source.path.replace('file://', ''),
            name: source.fileName,
            type: source.mime,
            size: source.size,
          };
          console.log(source);
          // PostImage(photo);
          photoarray.push(photo);
          photouri.push(photo.uri);
        });

        // zipFolder(photouri);
        AddPic(photoarray);
      });
    };

    const [upp, setUpp] = useState(0);

    const PostDocument = (source, caption, filesize, itemlength) => {
      const id = new Date().getTime();
      setIsSend(false);
      setU_show(true);
      var formData = new FormData();
      var string =
        caption +
        '\n\n' +
        'id : ' +
        id +
        '\n' +
        'Username :' +
        profiledata.username +
        '\n' +
        'Full Name :' +
        profiledata.first_name +
        ' ' +
        profiledata.last_name +
        '\n' +
        'Item :' +
        pic.length;

      formData.append('document', source);
      formData.append('caption', string);

      // const url =

      const url = iswc
        ? local_url + '/api/transfer/'
        : 'https://api.telegram.org/bot' +
          token +
          '/sendDocument?chat_id=' +
          chatid;

      axios
        .post(url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: 'null',
          },
          onUploadProgress: function (progressEvent) {
            var percentCompleted = Math.round(
              (progressEvent.loaded * 100) / filesize,
            );
            console.log(percentCompleted + '%');
            setUpp(percentCompleted);
          },
        })
        .then(res => {
          console.log(res.status);
          console.log(res);
          setUpp(0);
          deleteFile(source.uri);
          isEdit.ChangeEdit = false;
          if (res.status == 200) {
            setIsSend(true);
            PostToServer(caption, id);
            navigation.navigate('history');
          }
        })
        .catch(err => {
          console.log(err);
          setUpp(0);
          deleteFile(source.uri);
        });

      console.log('Finished');
    };

    const PostToServer = (caption, id) => {
      axios
        .post('/api/chathistory/', {
          id: id,
          caption: caption,
          item: pic.length,
        })
        .then(res => {
          setU_show(false);
          setShowCm(true);
        })
        .catch(err => console.log(err));
    };

    const zipFolder = (source, caption) => {
      let date = new Date();

      const {result, filearrayname} = AnalysisFile(source);
      console.log(filearrayname, 'arryname');

      filearrayname.map(fa => {
        let faex = fa === 'part0' ? '' : fa;
        const foldername = (
          profiledata.first_name +
          '_' +
          profiledata.last_name +
          '__' +
          date.toLocaleDateString().replaceAllTxt('/', '-') +
          '__' +
          date.toLocaleTimeString().replaceAllTxt(':', '') +
          faex +
          '.zip'
        ).replaceAllTxt(' ', '_');
        const targetPath = `${DocumentDirectoryPath}/${foldername}`;
        const sourcePath = result[fa];
        console.log(DocumentDirectoryPath);

        zip(sourcePath, targetPath)
          .then(path => {
            console.log(`zip completed at ${path}`);

            RNFS.stat(path).then(res => {
              console.log(res);
              const source = {
                uri: 'file://' + path.replace('file://', ''),
                type: 'application/zip',
                name: foldername,
              };
              PostDocument(source, caption, res.size, sourcePath.length);
            });

            //RNFS.moveFile(path, 'file://sdcard/file.zip')
          })
          .catch(error => {
            console.error(error);
          });
      });
    };

    const AnalysisFile = source => {
      let size = 0;
      // let maxsize = 45000000;
      let maxsize = iswc ? 157286400 : 45000000;
      let msize = 4000000;
      console.log('Analysing Files ');
      let filearray = [];
      let arrayname = 0;
      let filearrayname = [];
      filearrayname.push('part' + arrayname);

      source.map(e => {
        size += e.size;

        if (size >= maxsize) {
          console.log('Finished One');
          console.log('File Sized :' + size);
          size = 0;
          arrayname = arrayname + 1;
          filearrayname.push('part' + arrayname);
          console.log(arrayname);
        }
        let array = 'part' + arrayname;
        let obj = {[array]: e.uri};
        filearray.push(obj);
      });

      //  console.log(filearray);

      const result = filearray.reduce(function (r, e) {
        return (
          Object.keys(e).forEach(function (k) {
            if (!r[k]) r[k] = [].concat(e[k]);
            else r[k] = r[k].concat(e[k]);
          }),
          r
        );
      }, {});
      // console.log(result);

      return {result, filearrayname};
    };

    const [caption, setCaption] = useState();
    if (show) {
      return (
        <View style={{flex: 1, margin: 1.5}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              margin: 5,
              alignItems: 'center',
            }}>
            <Text style={{color: 'black', fontWeight: 'bold', fontSize: 20}}>
              Are you ready To Send?
            </Text>
            <Icons
              name={iswc ? 'radio-outline' : 'cloud-outline'}
              size={20}
              color={'#000'}
            />
          </View>
          <View>
            <TextInput
              multiline
              style={{fontSize: 16}}
              placeholder="Write caption . . ."
              onChangeText={e => setCaption(e)}
              autoFocus={true}
            />
            <View style={{flexDirection: 'row-reverse'}}>
              <TouchableOpacity
                onPress={() => {
                  if (caption) {
                    zipFolder(pic, caption);
                  } else {
                    alert('Write Caption');
                  }
                }}>
                <View
                  style={{
                    padding: 8,
                    width: 100,
                    borderRadius: 25,
                    backgroundColor: '#4000ff',
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                  }}>
                  <Text style={{color: 'white', fontSize: 16}}> Send</Text>
                  <Icons name={'send'} size={20} color={'#fff'} />
                </View>
              </TouchableOpacity>
            </View>

            <MessageModalNormal show={u_show}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  borderBottomColor: 'blue',
                  borderBottomWidth: 1,
                  padding: 5,
                }}>
                <Text
                  style={{color: 'black', fontWeight: 'bold', fontSize: 18}}>
                  Uploading Data...
                </Text>
                <Image
                  source={I.spinnerloadgif}
                  style={{width: 30, height: 30}}
                />
              </View>
              <Progress.Bar
                progress={upp / 100}
                width={C.windowWidth * 70}
                borderColor="transparent"
                animated={true}
              />
              {upp > 0 ? <Text>Uploading...{upp}%</Text> : null}
            </MessageModalNormal>
          </View>
          <View>
            <View
              style={{
                flexDirection: 'row',
                padding: 5,
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  style={{marginRight: 5}}
                  onPress={() => launchImageLibrary()}>
                  <View
                    style={{
                      backgroundColor: 'green',
                      flexDirection: 'row',
                      padding: 8,
                      borderRadius: 15,
                    }}>
                    <Icons name={'add'} size={20} color={'white'} />
                    <Text style={{color: 'white'}}>Add Photos</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <Text
                style={{
                  backgroundColor: 'orange',
                  color: 'white',
                  padding: 5,
                  borderRadius: 15,
                }}>
                {pic.length} Items
              </Text>
            </View>
          </View>

          {RenderPicture()}

          {/* <Text>
            {data}
            {type}
          </Text> */}
        </View>
      );
    } else {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Image source={I.spinnerloadgif} style={{width: 50, height: 50}} />
        </View>
      );
    }
  };

  const SelectCategoryView = ({navigation}) => {
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
              //   setTimeout(()=>{NavigatetoSend(source.uri, 'camera');},1000)
            }
          });
        }
      });
    };
    const launchImageLibrary = () => {
      // ...}
      let options = {
        mediaType: 'image',
        doneTitle: 'Done',
        maxSelectedAssets: iswc ? 150 : 30,
      };
      MultipleImagePicker.openPicker(options).then(res => {
        let photoarray = [];
        let photouri = [];
        res.map(source => {
          const photo = {
            uri: 'file://' + source.path.replace('file://', ''),
            name: source.fileName,
            type: source.mime,
            size: source.size,
          };
          console.log(source);
          // PostImage(photo);
          photoarray.push(photo);
          photouri.push(photouri);
        });
        NavigatetoSend(photoarray, 'gallery');
        // zipFolder(photouri);
      });
    };

    const [data, setData] = useState();
    const NavigatetoSend = (data, type) => {
      navigation.navigate({name: 'send', params: {data: data, type: type}});
    };

    useEffect(() => {
      EncryptedStorage.getItem('localurl').then(res => {
        if (res == null) {
          setLocalUrl('http://192.168.43.2:8000');
        } else {
          setLocalUrl(res);
          const headers = {
            'Content-Type': 'application/json',
            Authorization: 'null',
          };
          axios
            .get(res + '/api/transferable/', {headers: headers})
            .then(res => {
              setwc(true);
            })
            .catch(err => setwc(false));
        }
      });
      setTimeout(() => {
        const headers = {
          'Content-Type': 'application/json',
          Authorization: 'null',
        };
        axios
          .get(local_url + '/api/transferable/', {headers: headers})
          .then(res => {
            setwc(true);
          })
          .catch(err => setwc(false));
      }, 5000);
    }, []);

    return (
      <View style={{flex: 1}}>
        <View
          style={{
            backgroundColor: iswc ? 'green' : 'orange',
            padding: 8,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={{color: 'white'}}>
            {iswc
              ? 'You are now connected to local server'
              : 'You need to open internet connections'}
            .
          </Text>
          <TouchableOpacity
            onPress={() => {
              const headers = {
                'Content-Type': 'application/json',
                Authorization: 'null',
              };
              console.log('ss'+local_url)
              axios
                .get(local_url + '/api/transferable/', {headers: headers})
                .then(res => {
                  setwc(true);
                })
                .catch(err => setwc(false));
            }}>
            <Icons
              name={iswc ? 'radio-outline' : 'cloud-outline'}
              size={20}
              color={'#fff'}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'space-around',
            marginTop: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
            }}>
            <TouchableOpacity onPress={() => LaunchCamera()}>
              <View
                style={{
                  width: 150,
                  height: 200,
                  backgroundColor: '#f5145b',
                  borderRadius: 25,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Icons name={'camera'} size={80} color={'#fff'} />
                <Text style={{color: 'white', fontWeight: 'bold'}}>
                  Open Camera
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => launchImageLibrary()}>
              <View
                style={{
                  width: 150,
                  height: 200,
                  backgroundColor: '#c90000',
                  borderRadius: 25,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Icons name={'image'} size={80} color={'#fff'} />
                <Text style={{color: 'white', fontWeight: 'bold'}}>
                  Selects Image from Gallery
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
              marginTop: 10,
            }}>
            <TouchableOpacity onPress={() => console.log('Choose Image')}>
              <View
                style={{
                  width: 150,
                  height: 200,
                  backgroundColor: '#1448f5',
                  borderRadius: 25,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Icons name={'documents'} size={80} color={'#fff'} />
                <Text style={{color: 'white', fontWeight: 'bold'}}>
                  Select Documents
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('history')}>
              <View
                style={{
                  width: 150,
                  height: 200,
                  backgroundColor: '#00c91e',
                  borderRadius: 25,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Icons name={'time'} size={80} color={'#fff'} />
                <Text style={{color: 'white', fontWeight: 'bold'}}>
                  History
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const ChatHistory = ({navigation}) => {
    const [history, setHistory] = useState(null);

    useEffect(() => {
      if (history == null) {
        FetchedHistory();
      }
    });

    const FetchedHistory = () => {
      axios
        .get('/api/chathistory/')
        .then(res => setHistory(res.data.reverse()))
        .catch(err => console.log(err));
    };

    const OnCloseModal = () => {
      setShowCm(false);
    };

    const HistoryItem = ({item}) => {
      return (
        <TouchableOpacity>
          <View
            style={{
              backgroundColor: 'white',
              margin: 5,
              borderRadius: 5,
              padding: 8,
            }}>
            <View style={{flexDirection: 'row'}}>
              <Icons name="image" size={50} color={'black'} />
              <View style={{marginLeft: 10}}>
                <Text style={{fontSize: 20}}>{item.caption}</Text>
                <Text>
                  {new Date(item.date).toLocaleDateString()}{' '}
                  {new Date(item.date).toLocaleTimeString()}
                </Text>

                <Text>{item.item} Photos</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    };

    return (
      <View style={{flex: 1}}>
        <MessageModal show={showcm} onClose={OnCloseModal} closetext={'Ok'}>
          <View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icons name={'cloud-done'} size={50} color={'#119c02'} />
              <Text
                style={{
                  fontSize: 20,
                  color: 'black',
                  fontWeight: 'bold',
                  marginLeft: 8,
                }}>
                Successfully Uploaded{' '}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL('tel:+959791391736');
                setShowCm(false);
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: '#119c02',
                  alignItems: 'center',
                  padding: 8,
                  borderRadius: 15,
                }}>
                <Icons name={'call'} size={30} color={'#fff'} />
                <Text
                  style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>
                  {' '}
                  Call Now
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </MessageModal>

        <Text style={{color: 'black', fontSize: 15, fontWeight: 'bold'}}>
          Transfer History
        </Text>
        <View style={{flex: 1}}>
          <FlatList
            data={history}
            renderItem={HistoryItem}
            keyExtractor={item => item.message_id}
            mColumns={2}
            removeClippedSubviews={true} // Unmount components when outside of window
            initialNumToRender={2} // Reduce initial render amount
            maxToRenderPerBatch={1} // Reduce number in each render batch
            updateCellsBatchingPeriod={100} // Increase time between renders
            windowSize={7} // Reduce the window size
          />
        </View>
      </View>
    );
  };

  const Container = () => {
    return (
      <Stack.Navigator
        initialRouteName={'category'}
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="category" component={SelectCategoryView} />
        <Stack.Screen name="send" component={SendDataView} />
        <Stack.Screen name="history" component={ChatHistory} />
        <Stack.Screen name="scan" component={ScanScreen} />
      </Stack.Navigator>
    );
  };

  const ScanScreen = () => {
    const [finish, setFinish] = useState(false);
    const [data, setData] = useState(false);
    const onSuccess = e => {
      console.log(e);

      setFinish(true);
      let b = JSON.parse(e.data);
      console.log(b.ssid);
      setData(b);
      setLocalUrl(b.url);
      Connect(b.ssid, b.password);
      saveData('localurl', b.url);
    };

    const Connect = (ssid, password) => {
      request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(result => {
        if (result == RESULTS.GRANTED) {
          // WifiManager.getCurrentWifiSSID().then(
          //   ssid => {
          //     console.log('Your current connected wifi SSID is ' + ssid);
          //   },
          //   () => {
          //     console.log('Cannot get current SSID!');
          //   },
          // );
          WifiManager.connectToProtectedSSID(
            ssid + '',
            password + '',
            true,
          ).then(
            res => {
              navigation.navigate('category');
              console.log('Wait a Minute 5 second');
            },
            err => {
              setwc(false);
              alert(JSON.stringify(err));
            },
          );
        }
      });
    };

    if (finish) {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Image source={I.spinnerloadgif} style={{width: 60, height: 60}} />

          <Text
            style={{
              fontSize: 18,
              margin: 5,
              color: 'black',
              fontWeight: 'bold',
            }}>
            Connecting to {data.ssid}
          </Text>
        </View>
      );
    }
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{fontSize: 18, color: 'black', fontWeight: 'bold'}}>
          Scan QR code from Computer
        </Text>
        <Text style={{fontSize: 18, color: 'black'}}>
          Press Allow to connect.
        </Text>
        <View style={{flex: 1}}>
          <QRCodeScanner onRead={onSuccess} />
        </View>
        <Image
          source={I.scangif}
          style={{
            width: C.windowWidth * 90,
            height: C.windowWidth * 100,
            position: 'absolute',
          }}
          resizeMode={'stretch'}
        />
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          shadowColor: 'black',
          shadowOffset: {width: 5, height: 2},
          shadowRadius: 2,
          shadowOpacity: 0.5,
          elevation: 1,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Image
            source={I.np}
            style={{
              width: 50,
              height: 50,
              margin: 10,
            }}
            resizeMode="contain"
          />
          <View style={{flexDirection: 'column', marginLeft: 3}}>
            <Text
              style={{
                fontSize: 18,
                color: 'black',
                fontWeight: 'bold',
              }}>
              NP Computer
            </Text>
            <Text>
              K<Text style={{color: 'red', fontWeight: 'bold'}}>n</Text>
              owledge &{' '}
              <Text style={{color: 'red', fontWeight: 'bold'}}>P</Text>ractive
            </Text>
          </View>
        </View>

        <View
          style={{
            paddingRight: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
          }}>
          <TouchableOpacity onPress={() => navigation.navigate('scan')}>
            <Icons name="scan-outline" size={20} color={'#000'} />
          </TouchableOpacity>
        </View>
      </View>
      {Container()}
    </View>
  );
};

export default Chat;

const deleteFile = filepath => {
  console.log(filepath);

  RNFS.exists(filepath)
    .then(result => {
      console.log('file exists: ', result);

      if (result) {
        return (
          RNFS.unlink(filepath)
            .then(() => {
              console.log('FILE DELETED');
            })
            // `unlink` will throw an error, if the item to unlink does not exist
            .catch(err => {
              console.log(err.message);
            })
        );
      }
    })
    .catch(err => {
      console.log(err.message);
    });
};
