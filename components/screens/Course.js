import React, {useState, useEffect} from 'react';
import {
  View,
  
  TouchableOpacity,
  
  Image,
  StyleSheet,
  ScrollView,
  Modal,
  useWindowDimensions,
  RefreshControl,
} from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import {I, C} from '../Database';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import axios from 'axios';
import RenderHtml, {useNormalizedUrl} from 'react-native-render-html';
import Text from '../DefaultText';
import Loading from './Loading';

import ReactNative from 'react-native';
const TextInput = (props)=> <ReactNative.TextInput {...props} placeholderTextColor={C.textmuted}/>

var ScrollableTabView = require('react-native-scrollable-tab-view');

const Stack = createNativeStackNavigator();

const Container = ({navigation, route}) => {
  return (
    <Stack.Navigator
      initialRouteName="CourseView"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="CourseView"
        component={Course}
        initialParams={route.params}
      />
      <Stack.Screen name="Spe_Course" component={Spe_Course} />
      <Stack.Screen name="Spe_Lesson" component={Spe_Lesson} />
    </Stack.Navigator>
  );
};

const Spe_Course = ({navigation, route}) => {
  const [lessondata, setLessonData] = useState(null);
  const {coursename} = route.params;

  useEffect(() => {
    if (lessondata == null) {
      axios
        .post('/api/course/lesson/', {coursename: coursename}, {timeout: 500})
        .then(res => {
          console.log(res.data);
          setLessonData(res.data);
        })
        .catch(err => console.log(err));
    }
  }, []);

  if (lessondata == null) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text> Loading Course ..</Text>
      </View>
    );
  }
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          margin: 5,
          marginBottom: 10,
          alignItems: 'center',
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icons
            name="arrow-back-outline"
            size={20}
            color={'#000'}
            style={{padding: 10, marginRight: 10}}
          />
        </TouchableOpacity><View>
        <Text style={{fontSize: 20, color:'black',fontWeight: '500'}}>{coursename}</Text>
        </View>
      </View>
      <ScrollView>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          {lessondata
            ? lessondata.map((data, id) => (
                <TouchableOpacity
                  key={id}
                  style={{
                    width: '95%',
                    padding: 20,
                    backgroundColor: C.blackbutton,
                    borderRadius: 15,
                    margin: 5,
                  }}
                  onPress={() =>
                    navigation.navigate({
                      name: 'Spe_Lesson',
                      params: {lessondata: data, title: data.title},
                    })
                  }>
                  <Text style={{color: 'white'}}>{data.title}</Text>
                </TouchableOpacity>
              ))
            : ''}
        </View>
      </ScrollView>
    </View>
  );
};

const Spe_Lesson = ({navigation, route}) => {
  const {lessondata, title} = route.params;
  const [onelessondata, setOnelessondata] = useState(null);
  const {width} = useWindowDimensions();
  console.log(lessondata['content']);

  useEffect(() => {
    if (onelessondata == null) {
      setOnelessondata(lessondata);
    }
  });

  return (
    <View style={{flex: 1}}>
      <View
        style={{
          top: 0,
          flexDirection: 'row',
          margin: 5,
          marginBottom: 10,
          alignItems: 'center',
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icons
            name="arrow-back-outline"
            size={20}
            color={'#000'}
            style={{padding: 5}}
          />
        </TouchableOpacity>
        <View style={{flex:1}}>
          <Text style={{fontSize: 18, color: 'black', fontWeight: '500'}}>
            {title}
          </Text>
        </View>
      </View>

      {onelessondata == null ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text> Loading..</Text>
        </View>
      ) : (
        <View style={{flex: 1}}>
          <ScrollView style={{padding: 10}}>
            <RenderHtml
              contentWidth={width}
              source={{html: onelessondata['content']}}
              domVisitors={{
                onElement: e => {
                  
                  if(e.name =='p'){
                    console.log(e);
                    e.attribs['style']='color:black';console.log(e.name);
                  }
                  if (e.name == 'img') {
                    const firststring = e.attribs['src'];
                    if (!firststring.includes('http')) {
                      e.attribs['src'] = axios.defaults.baseURL + firststring;
                      e.attribs['style'] = 'width : 100%';
                      console.log(e.attribs['src']);
                    }
                  }
                },
              }}
            />
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const Course = ({navigation, route}) => {
  const [searchtext, setSearchText] = useState();

  const {cdata} = route.params;
  const {gdata, setGdata} = useState(cdata);
  const [data, setData] = useState(cdata);
  const [isLoad, setIsLoad] = useState(false);
  function SearchProduct(text) {
    console.log(text);
  }
  const Container = () => {
    return (
      <Stack.Navigator
        initialRouteName="Course_C"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen
          name="Course_C"
          component={CourseC}
          initialParams={{cdata: data}}
        />
        <Stack.Screen
          name="U_Course"
          component={UsersCourse}
          initalParams={{cdata: data}}
        />
      </Stack.Navigator>
    );
  };
  const UsersCourse = ({navigation, route}) => {
    const {cdata} = route.params;
    console.log('Usercc', cdata);
    const [data, setData] = useState(cdata);
    const [isLoad, setIsLoad] = useState(false);

    const [isRefresh, setIsRefresh] = useState(false);

    const FetchCourseData = () => {
      axios
        .get('/api/course/')
        .then(res => {
          console.log(res.data);
          setData(res.data);
        })
        .catch(err => console.log(err));
    };

    const onRefresh = () => {
      FetchCourseData();
      setIsRefresh(false);
    };

    return (
      <View style={{flex: 1}}>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            backgroundColor: 'transparent',
            marginBottom: 10,
          }}>
          <TouchableOpacity
            style={styles.tabbarbutton}
            onPress={() =>
              navigation.navigate({name: 'Course_C', params: {cdata: data}})
            }>
            <Text>Course</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tabbarbutton_select}
            onPress={() =>
              navigation.navigate({name: 'U_Course', params: {cdata: data}})
            }>
            <Text>My Course</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          style={{postion: 'absolute'}}
          refreshControl={
            <RefreshControl refreshing={isRefresh} onRefresh={onRefresh} />
          }>
          <View style={{margin: 5}}>
            {data ? (
              data['courseuserget'].map((item, id) => (
                <View
                  key={id}
                  style={{
                    width: '98%',
                    margin: 5,
                    borderRadius: 15,
                    backgroundColor: 'white',
                    shadowColor: 'black',
                    shadowRadius: 3,
                    shadowOpacity: 0.4,
                  }}>
                  <Image
                    source={{uri: axios.defaults.baseURL + item.coverimage}}
                    style={{
                      width: C.windowWidth * 100,
                      height: 200,
                      borderTopLeftRadius: 15,
                      borderTopRightRadius: 15,
                    }}
                    resizeMode={'cover'}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      padding: 5,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <View>
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: '700',
                          color: 'black',
                        }}>
                        {item.course_name}
                      </Text>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: '500',
                          color: C.textmuted,
                        }}>
                        {item.course_price}
                      </Text>
                    </View>
                    <View>
                      <TouchableOpacity
                        style={{
                          padding: 15,
                          backgroundColor: C.blackbutton,
                          borderRadius: 15,
                        }}
                        onPress={() =>
                          navigation.navigate({
                            name: 'Spe_Course',
                            params: {coursename: item.course_name},
                          })
                        }>
                        <Text style={{color: 'white'}}>Start Learn</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <Loading show={true} />
            )}
          </View>
        </ScrollView>
      </View>
    );
  };

  const CourseC = ({navigation, route}) => {
    const {cdata} = route.params;
    const [modalvisible, setModalVisible] = useState(false);
    const [modaldata, setModalData] = useState();
    const [data, setData] = useState(cdata);

    const [isLoad, setIsLoad] = useState(false);
    const [refreshing, setRefreshing] = useState();

    const SetModalShow = (item, coursename, description) => {
      const data = {item: item, coursename: coursename, desc: description};
      setModalData(data);
      setModalVisible(true);
    };

    const onBuy = (coursename, item) => {
      setIsLoad(true);
      axios
        .post('/api/course/', {coursename: coursename})

        .then(res => {
          console.log(res);
          if (res.status == 201) {
            FetchCourseData();
            console.log('Fetched Course data');
            setIsLoad(false);
          }
        })
        .catch(err => console.log(res));
    };

    const FetchCourseData = () => {
      axios
        .get('/api/course/')
        .then(res => {
          console.log(res.data);
          setData(res.data);
        })
        .catch(err => console.log(err));
    };

    const RenderModal = props => {
      console.log('What happen Now');
      return (
        <Modal visible={modalvisible} transparent={true}>
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
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: '500',
                  marginBottom: 15,
                }}>
                Course Request
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '500',
                  marginBottom: 10,
                }}>
                {modaldata ? modaldata['coursename'] : ''}
              </Text>
              <View>
                <Text style={styles.paytext}>AYA Pay : 09791391736</Text>
                <Text style={styles.paytext}>Wave Pay : 09791391736</Text>
                <Text style={styles.paytext}>KBZ Pay : 09791391736</Text>
                <Text style={styles.paytext}>Wave Money : 09791391736</Text>
                <Text style={styles.paytext}>OK Dollar : 09791391736</Text>
              </View>
              <ScrollView style={{maxHeight: 350, marginTop: 10}}>
                <Text>{modaldata ? modaldata['desc'] : ''}</Text>
              </ScrollView>

              <View style={{flexDirection: 'row-reverse'}}>
                <TouchableOpacity
                  onPress={() => {
                    onBuy(modaldata['coursename'], modaldata['item']);
                    setModalVisible(false);
                  }}
                  style={{
                    padding: 20,
                    backgroundColor: '#f0f0f0',
                    margin: 5,
                    borderRadius: 15,
                  }}>
                  <Text>Buy Now</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={{
                    padding: 20,
                    backgroundColor: '#f0f0f0',
                    margin: 5,
                    borderRadius: 15,
                  }}>
                  <Text>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      );
    };

    /*console.log('Course::::',data[data['coursereq'].length<data['allcourse'].length?'coursereq':'allcourse'].filter(c=>data[data['coursereq'].length>data['allcourse'].length?'coursereq':'allcourse'].some(e=>{
      if(e.course_name===c.course_name){
        return false;
      }else{
        return true;
      }
    })));*/

    const onRefresh = () => {
      FetchCourseData();
      setRefreshing(false);
    };

    return (
      <View style={{flex: 1}}>
        <Loading show={isLoad} />

        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            backgroundColor: 'transparent',
            marginBottom: 10,
          }}>
          <TouchableOpacity
            style={styles.tabbarbutton_select}
            onPress={() =>
              navigation.navigate({name: 'Course_C', params: {cdata: data}})
            }>
            <Text>Course</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tabbarbutton}
            onPress={() =>
              navigation.navigate({name: 'U_Course', params: {cdata: data}})
            }>
            <Text>My Course</Text>
          </TouchableOpacity>
        </View>
        <RenderModal visible={modalvisible} />
        {data ? (
          <ScrollView
            style={{postion: 'absolute'}}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            <View style={{margin: 5}}>
              {data['coursereq'] ? (
                <View>
                  <Text style={{fontSize: 18, fontWeight: '600'}}>
                    {data['coursereq']
                      ? data['coursereq'].length > 1
                        ? 'Requested Courses'
                        : 'Requested Course'
                      : ''}
                  </Text>

                  {data['coursereq'].map((item, id) => (
                    <View
                      key={id}
                      style={{
                        width: '98%',
                        margin: 5,
                        borderRadius: 15,
                        backgroundColor: 'white',
                        shadowColor: 'black',
                        shadowRadius: 3,
                        shadowOpacity: 0.4,
                      }}>
                      <Image
                        source={{uri: axios.defaults.baseURL + item.coverimage}}
                        style={{
                          width: C.windowWidth * 100,
                          height: 200,
                          borderTopLeftRadius: 15,
                          borderTopRightRadius: 15,
                        }}
                        resizeMode={'cover'}
                        resizeMethod={'resize'}
                      />
                      <View
                        style={{
                          flexDirection: 'row',
                          padding: 5,
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <View>
                          <Text
                            style={{
                              fontSize: 20,
                              color: 'black',
                              fontWeight: '700',
                            }}>
                            {item.course_name}
                          </Text>
                          <Text
                            style={{
                              fontSize: 15,
                              fontWeight: '500',
                              color: C.textmuted,
                            }}>
                            {item.course_price}
                          </Text>
                        </View>
                        <View>
                          <TouchableOpacity
                            style={{
                              padding: 15,
                              backgroundColor: C.blackbutton,
                              borderRadius: 15,
                            }}>
                            <Text style={{color: 'white'}}>Requested</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              ) : null}
              {data['allcourse'] ? (
                <View>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '600',
                      marginTop: 20,
                      marginBottom: 10,
                    }}>
                    Courses
                  </Text>

                  {data['allcourse'].map((item, id) => (
                    <View
                      key={id}
                      style={{
                        width: '98%',
                        margin: 5,
                        borderRadius: 15,
                        backgroundColor: 'white',
                        shadowColor: 'black',
                        shadowRadius: 3,
                        shadowOpacity: 0.4,
                      }}>
                      <Image
                        source={{uri: axios.defaults.baseURL + item.coverimage}}
                        style={{
                          width: C.windowWidth * 100,
                          height: 200,
                          borderTopLeftRadius: 15,
                          borderTopRightRadius: 15,
                        }}
                        resizeMode={'cover'}
                      />
                      <View
                        style={{
                          flexDirection: 'row',
                          padding: 5,
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <View>
                          <Text style={{fontSize: 20, fontWeight: '700'}}>
                            {item.course_name}
                          </Text>
                          <Text
                            style={{
                              fontSize: 15,
                              fontWeight: '500',
                              color: C.textmuted,
                            }}>
                            {item.course_price}
                          </Text>
                        </View>
                        <View>
                          <TouchableOpacity
                            style={{
                              padding: 15,
                              backgroundColor: C.bluecolor,
                              borderRadius: 15,
                            }}
                            onPress={() =>
                              SetModalShow(
                                item,
                                item.course_name,
                                item.description,
                              )
                            }>
                            <Text style={{color: 'white'}}>Buy Now</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              ) : null}
            </View>
          </ScrollView>
        ) : (
          <Loading show={true} />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Loading show={isLoad} />
      <View style={{flexDirection: 'row', alignItems: 'center', margin: 5}}>
        <Image
          source={I.np}
          style={{
            width: 50,
            height: 50,
            marginRight: 5,
          }}
          resizeMode='contain'
        />
        <View style={styles.search}>
          <TextInput
            style={{
              backgroundColor: C.textfield,
              height: 40,
              borderRadius: 15,
              paddingLeft: 6,
              paddingRight: 5,
              fontSize: 16,
            }}
            onChangeText={text => setSearchText(text)}
            placeholder={'Search Course...'}
            onKeyPress={e => {
              if (e.code === 'Enter') {
                SearchProduct(searchtext);
              }
            }}
          />
          <TouchableOpacity onPress={() => SearchProduct(searchtext)}>
            <Icons name="search-outline" size={25} style={{padding: 6}} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{flex: 1}}>{Container(data)}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  search: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: C.textfield,
    borderRadius: 15,
  },
  tabbarbutton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    padding: 10,
    borderBottomColor: C.textmuted,
    borderBottomWidth: 1,
  },
  tabbarbutton_select: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    padding: 10,
    borderBottomColor: 'black',
    borderBottomWidth: 2,
  },
  paytext: {
    fontSize: 16,
    fontWeight: 'bold',
    color:'black',
  },
});

export default Container;
