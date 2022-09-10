import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Linking,
  RefreshControl,
} from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import {C, I} from '../Database';
import {Actions} from 'react-native-router-flux';
import LoadingModal from './Loading';
import Text from '../DefaultText';
import AccordionView from './Collapsible';

const randomArray = array => {
  const shuffledArray = array.sort((a, b) => 0.5 - Math.random());
  return shuffledArray;
};

//Course Flat List

const pstyles = StyleSheet.create({
  item: {
    width: '100%',
    height: 150,
    borderRadius: 15,
    backgroundColor: 'white',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const itemstyles = StyleSheet.create({
  item: {
    width: 150,
    height: 170,
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 15,
  },
  title: {
    position: 'relative',
    color: 'black',
    fontSize: 18,
    fontWeight: '600',
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
  },
  price: {
    position: 'relative',
    color: '#6c757d',
  },
  buynow_btn: {
    position: 'relative',
    padding: 10,
    left: 0,
    bottom: 0,
    backgroundColor: '#0d6efd',
    color: 'white',
    alignItems: 'center',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    shadowColor: 'black',
    shadowOpacity: 0.4,
    elevation: 2,
    shadowOffset: {width: 0, height: 1},
  },
});

const HomeScreen = ({navigation, route}) => {
  console.log(profiledata, route);
  const {p_d, pd_d, c_d} = route.params;
  let coid = 0;
  let pdid = 0;
  let cousergetlength = c_d.courseuserget.length;

  const [profiledata, setProfileData] = useState(p_d);
  const [proudctData, setP_dd] = useState(pd_d);
  const [courseData, setC_d] = useState(c_d);

  const [productData, setProductData] = React.useState(proudctData);
  const [pdData, setPddata] = React.useState(productData);
  const [SECTIONS, setSections] = useState(null);
  const [ACTIVITY, setActivity] = useState(null);
  const [isload, setIsLoad] = useState([]);
  const [transfer, setTransfer] = useState(null);
  const [transfercount, setTransferCount] = useState(0);

  const [refreshing, setRefreshing] = useState(false);
  let A_R = null;

  let activity_size = 4;

  const scrollToIndex = (index, animated) => {
    A_R && A_R.scrollToIndex({index, animated});
  };

  let sliderindex = 0;

  useEffect(() => {
    if (SECTIONS == null) {
      axios
        .get('api/faq/')
        .then(res => {
          const a = res.data.filter(d => d.content != '');
          a.splice(1, a.length >= 3 ? 3 : a.length);
          setSections(a);
        })
        .catch(err => console.log(err));
    }
    if (ACTIVITY == null) {
      axios
        .get('api/activity/')
        .then(res => {
          const a = res.data.splice(
            res.data.length - activity_size,
            res.data.length,
          );
          setActivity(a);
        })
        .catch(err => console.log(err));
    }
    if (transfer == null) {
      axios
        .get('/api/chathistory/')
        .then(res => {
          let count = 0;
          res.data.map(e => {
            count = count + parseInt(e.item);
            console.log(count, parseInt(e.item));
          });
          setTransfer(res.data);
          setTransferCount(count);
        })
        .catch(res => console.log(res));
    }

    //Activity Scroll Animation
  });

  const LoadData = () => {
    FetchProfileData();
    FetchCourseData();
    FetchProductData();
    axios
      .get('api/activity/')
      .then(res => {
        const a = res.data.splice(
          res.data.length - activity_size,
          res.data.length,
        );
        setActivity(a);
      })
      .catch(err => console.log(err));
    axios
      .get('/api/chathistory/')
      .then(res => {
        let count = 0;
        res.data.map(e => {
          count = count + parseInt(e.item);
          console.log(count, parseInt(e.item));
        });
        setTransfer(res.data);
        setTransferCount(count);
      })
      .catch(res => console.log(res));
  };
  const onRefresh = () => {
    setRefreshing(true);
    LoadData();
    setRefreshing(false);
  };

  const FetchProfileData = async () => {
    axios
      .get('/api/profile/')
      .then(res => {
        setProfileData(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const FetchCourseData = async () => {
    axios
      .get('/api/course/')
      .then(res => {
        setC_d(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const FetchProductData = async () => {
    axios
      .get('/api/product/')
      .then(res => {
        setP_dd(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  setInterval(() => {
    if (sliderindex >= activity_size) {
      scrollToIndex(0, true);
      sliderindex = 0;
    } else {
      scrollToIndex(sliderindex, true);
      sliderindex += 1;
    }
  }, 3000);

  const filterFollowProduct = (category, dat) => {
    const data = productData.product.filter(e => e.category == category);

    const data1 = data.filter(d => d !== dat);

    const tempdata = {...productData, ['product']: data1};

    return tempdata;
  };

  const CourseItem = ({item}) => {
    return (
      <View style={itemstyles.item}>
        <Image
          source={{uri: axios.defaults.baseURL + item.coverimage}}
          style={{
            width: '100%',
            height: 95,
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
          }}
          resizeMode="contain"
        />
        <Text style={itemstyles.title}>{item.course_name}</Text>
        <Text style={itemstyles.price}>{item.course_price}</Text>

        <TouchableOpacity onPress={() => navigation.navigate('Course')}>
          <View style={itemstyles.buynow_btn}>
            <Text style={{color: 'white'}}>Buy Now</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const ProductItem = ({item}) => {
    return (
      <View
        style={{
          width: '49%',
          padding: 10,
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate({
              name: 'Product',
              params: {
                nav: 'ProductOne',
                data: item,
                followdata: filterFollowProduct(item.category, item),
                productData: productData,
              },
            });
          }}>
          <View style={pstyles.item}>
            <Image
              source={{uri: axios.defaults.baseURL + item.productimage}}
              style={{
                width: '100%',
                height: '100%',
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
              }}
              resizeMode="contain"
              resizeMethod={'resize'}
            />
          </View>
          <Text style={itemstyles.title}>{item.productname}</Text>
          <Text style={itemstyles.price}>{item.price}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const ActivityItem = ({item}) => {
    return (
      <View
        style={{
          width: C.windowWidth * 100,
          justifyContent: 'space-between',
        }}>
        <Image
          source={{uri: axios.defaults.baseURL + item.coverimage}}
          style={{
            width: '100%',
            height: 200,
          }}
          resizeMode="cover"
        />
      </View>
    );
  };

  const RenderProductItem = () => {
    return (
      <FlatList
        contentContainerStyle={{
          width: '100%',
          margin: 5,
          justifyContent: 'space-around',
        }}
        data={pdData ? randomArray(pdData.product).slice(0, 4) : null}
        renderItem={ProductItem}
        keyExtractor={item => {
          pdid += 1;
          return pdid;
        }}
        numColumns={2}
        removeClippedSubviews={true} // Unmount components when outside of window
        initialNumToRender={2} // Reduce initial render amount
        maxToRenderPerBatch={1} // Reduce number in each render batch
        updateCellsBatchingPeriod={100} // Increase time between renders
        windowSize={7} // Reduce the window size
      />
    );
  };

  let actvity_c = 0;
  const RenderActivityItem = () => {
    return (
      <FlatList
        ref={e => (A_R = e)}
        data={ACTIVITY}
        renderItem={ActivityItem}
        keyExtractor={item => {
          actvity_c += 1;
          return actvity_c;
        }}
        decelerationRate={0.8}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        snapToInterval={C.windowWidth * 100}
        bounces={false}
      />
    );
  };

  if (profiledata) {
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            shadowColor: 'black',
            shadowOffset: {width: 0, height: 2},
            shadowRadius: 2,
            elevation: 2,
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
            <TouchableOpacity
              onPress={() =>
                navigation.navigate({
                  name: 'Profile',
                  params: {data: profiledata},
                })
              }>
              <Image
                source={
                  profiledata.profileimage
                    ? {
                        uri: axios.defaults.baseURL + profiledata.profileimage,
                      }
                    : I.profile
                }
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 50,

                  marginRight: 10,
                }}
                resizeMode="cover"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Actions.settings()}>
              <Icons name="settings-outline" size={20} color={'#000'} />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView
          style={styles.scrollcontainer}
          refreshControl={
            <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
          }>
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <View
              style={{
                flex: 1,
                backgroundColor: '#494654',
                width: C.windowWidth * 100,
                height: 300,
                position: 'absolute',
                top: 50,
                borderRadius: 50,
              }}
            />
            <TouchableOpacity
              onPress={() =>
                navigation.navigate({
                  name: 'Profile',
                  params: {data: profiledata},
                })
              }>
              <Image
                source={
                  profiledata.profileimage
                    ? {
                        uri: axios.defaults.baseURL + profiledata.profileimage,
                      }
                    : I.profile
                }
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  borderColor: '#fff',
                  borderWidth: 5,
                }}
                resizeMode="cover"
              />
            </TouchableOpacity>
            <View style={{flexDirection: 'row', marginTop: 10}}>
              <Text
                style={{
                  fontSize: 19,
                  fontWeight: '100',
                  color: 'white',
                }}>
                Welcome,{' '}
              </Text>
              <Text
                style={{
                  fontSize: 19,
                  fontWeight: 'bold',
                  color: 'white',
                }}>
                {profiledata.first_name + ' ' + profiledata.last_name}
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',

                  padding: 5,
                  marginTop: 1,
                  borderRadius: 15,
                }}>
                <Icons name="book-outline" size={20} color={'#fff'} />
                <Text style={{margin: 5, color: 'white'}}>
                  {cousergetlength}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',

                  padding: 5,

                  borderRadius: 15,
                }}>
                <Icons name="image-outline" size={20} color={'#fff'} />
                <Text style={{margin: 5, color: 'white'}}>{transfercount}</Text>
              </View>
            </View>
          </View>

          <View
            style={{
              padding: 10,
              marginLeft: 20,
              marginRight: 20,
              backgroundColor: 'white',
              borderRadius: 20,
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => Linking.openURL('tel:+959791391736')}>
              <Image
                source={I.call}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 20,
                }}
                resizeMode={'cover'}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                Linking.openURL('viber://chat?number=959791391736')
              }>
              <Image
                source={I.viber}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 20,
                }}
                resizeMode={'cover'}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('Transfer Photo')}>
              <Image
                source={I.sendgif}
                style={{
                  width: 50,
                  height: 50,
                }}
                resizeMode={'cover'}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  'fb://facewebmodal/f?href=https://www.facebook.com/NPcomputerDesign',
                )
              }>
              <Image
                source={I.fb}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 20,
                }}
                resizeMode={'cover'}
              />
            </TouchableOpacity>
            {/*  */}
            <TouchableOpacity
              onPress={() =>
                Linking.openURL('https://goo.gl/maps/X4na9uuGPe3oXLmP6')
              }>
              <Image
                source={I.map}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 20,
                }}
                resizeMode={'cover'}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.course_container}>
            <View
              style={{
                flex: 1,
                backgroundColor: '#494654',
                width: C.windowWidth * 100,
                height: 200,
                position: 'absolute',
              }}
            />
            {ACTIVITY == null ? (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={I.spinnerloadgif}
                  style={{width: 50, height: 50}}
                />
                <Text>Loading Activity</Text>
              </View>
            ) : (
              RenderActivityItem()
            )}
          </View>

          {/* Course */}
          {courseData.allcourse == [] ? null : (
            <View style={styles.course_container}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: 5,
                  alignItems: 'center',
                }}>
                <Text style={{fontSize: 20, fontWeight: '400', color: 'black'}}>
                  Course
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Course')}>
                  <Text style={{color: 'blue'}}>See All</Text>
                </TouchableOpacity>
              </View>

              <FlatList
                data={courseData ? courseData.allcourse : null}
                renderItem={CourseItem}
                keyExtractor={item => {
                  coid += 1;
                  console.log(coid);
                  return coid;
                }}
                horizontal={true}
              />
            </View>
          )}

          {/* Product */}

          <View style={styles.course_container}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 5,
                alignItems: 'center',
              }}>
              <Text style={{fontSize: 20, fontWeight: '400', color: 'black'}}>
                Products
              </Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate({
                    name: 'Product',
                    params: {nav: 'ProductReal'},
                  })
                }>
                <Text style={{color: 'blue'}}>See All</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDriection: 'column',
                justifyContent: 'space-around',
                flexWrap: 'wrap',
              }}>
              {RenderProductItem()}

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate({
                    name: 'Product',
                    params: {nav: 'ProductReal'},
                  })
                }>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 10,
                    backgroundColor: '#ffff',
                  }}>
                  <Text style={{color: 'blue'}}>Show More</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.course_container}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 5,
                alignItems: 'center',
              }}>
              <Text style={{fontSize: 20, fontWeight: '400', color: 'black'}}>
                FAQ
              </Text>
              <TouchableOpacity onPress={() => Actions.Faq()}>
                <Text style={{color: 'blue'}}>See All</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flex: 1,
              }}>
              {SECTIONS == null ? (
                <View style={{flex: 1, alignItems: 'center'}}>
                  <Image
                    source={I.spinnerloadgif}
                    style={{width: 20, height: 20}}
                  />
                </View>
              ) : (
                <AccordionView sections={SECTIONS} />
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: 'red',
  },

  scrollcontainer: {
    flex: 1,
  },
  profile: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 5,
    height: 140,
    padding: 10,
    backgroundColor: '#fffff',
    borderRadius: 20,
    borderColor: C.textmuted,
    borderWidth: 1,

    flexDirection: 'row',
  },
  course_container: {
    position: 'relative',
    marginTop: 20,
  },
  course_image: {
    width: 180,
    height: 150,
    padding: 5,
    flexGrow: 5,
  },
  course: {
    width: 190,
    height: 200,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    padding: 5,
  },
  buybutton: {
    flexGrow: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    color: 'white',
    padding: '10',
  },
});

export default HomeScreen;
