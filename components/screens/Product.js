import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
 
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  RefreshControl,
} from 'react-native';
import {C, I} from '../Database';
import Icons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ProductOne from './ProductOne';
import Text from '../DefaultText';

import ReactNative from 'react-native';
const TextInput = (props)=> <ReactNative.TextInput {...props} placeholderTextColor={C.textmuted}/>

const randomArray = array => {
  const shuffledArray = array.sort((a, b) => 0.5 - Math.random());
  return shuffledArray;
};

const Stack = createNativeStackNavigator();
const Container = ({route}) => {
  return (
    <Stack.Navigator
      initialRouteName={'ProductReal'}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="ProductReal"
        component={Product}
        initialParams={route.params}
      />
      <Stack.Screen name="ProductOne" component={ProductOne} />
    </Stack.Navigator>
  );
};

const Product = ({navigation, route}) => {
  const {proudctData, nav} = route.params;

  const [productData, setData] = useState(proudctData);
  const [pdData, setpdData] = useState(productData);
  const [searchtext, setSearchText] = useState();
  const [btnstring, setBtnstring] = useState();
  const [israndom, setIsRandom] = useState(false);
  const [followdata, setFollowdata] = useState();
  const [refreshing, setRefreshing] = useState(false);

  let pdid = 0;
  let flatlistref = null;

  useEffect(() => {
    if (!israndom) {
      const tempdata = {
        ...productData,
        ['product']: randomArray(productData['product']),
      };
      setData(tempdata);
      setIsRandom(true);
      console.log('what ow')
    }
  });

  const onRefresh = () => {
    setRefreshing(true);
    FetchProductData();
    setRefreshing(false);
  };

  const FetchProductData = () => {
    axios
      .get('/api/product/')
      .then(res => {
        setpdData(res.data);
     
      })
      .catch(err => console.log(err));
  };

  const handleProduct = category => {
    const category_index = pdData['category'].indexOf(category);
    console.log(category_index, 'Category _ Index', category);
    const data = productData['product'].filter(
      e => e.category == category_index + 1,
    );

    const tempdata = {...productData, ['product']: data};
    return tempdata;
  };

  const filterFollowProduct = (category, dat) => {
    const data = productData['product'].filter(e => e.category == category);

    const data1 = data.filter(d => d !== dat);

    const tempdata = {...productData, ['product']: data1};
    setFollowdata(tempdata);
    return tempdata;
  };

  String.prototype.replaceAllTxt = function replaceAll(search, replace) {
    return this.split(search).join(replace);
  };

  const SearchProduct = text => {
    const data = productData['product'].filter(e => {
      var b = e.productname.replaceAllTxt(' ', '').toLowerCase();
      var c = text.replaceAllTxt(' ', '').toLowerCase();
      return b.includes(c);
    });
    const tempdata = {...productData, ['product']: data};
    setpdData(tempdata);
    setBtnstring('All');
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
              name: 'ProductOne',
              params: {
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
      width: '150',
      height: '170',
      backgroundColor: 'white',
      margin: 10,
      borderRadius: 15,
    },
    title: {
      position: 'relative',

      fontSize: 18,
      fontWeight: 'bold',
      color: 'black',
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
      alignItems: 'center',
      borderBottomLeftRadius: 15,
      borderBottomRightRadius: 15,
      shadowColor: 'black',
      shadowOpacity: 0.4,
      elevation: 2,
      shadowOffset: {width: 0, height: 1},
    },
  });

  const pdItem = ({item}) => {
    console.log(item, 'pditemmmm');
    return <Text>data</Text>;
  };

  const RenderProductItem = () => {
    return (
      <FlatList
        ref={ref => (flatlistref = ref)}
        contentContainerStyle={{
          width: '100%',
          margin: 5,
          justifyContent: 'space-around',
        }}
        data={pdData ? pdData['product'] : null}
        renderItem={ProductItem}
        keyExtractor={item => {
          pdid += 1;
          return pdid;
        }}
        refreshControl={
          <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
        }
        numColumns={2}
        removeClippedSubviews={true} // Unmount components when outside of window
        initialNumToRender={2} // Reduce initial render amount
        maxToRenderPerBatch={1} // Reduce number in each render batch
        updateCellsBatchingPeriod={100} // Increase time between renders
        windowSize={7} // Reduce the window size
      />
    );
  };

  if (pdData && pdData['product']) {
    return (
      <View style={styles.container}>
        <View
          style={{flexDirection: 'column', alignItems: 'center', margin: 5}}>
          <View style={{flexDirection: 'row', alignItems: 'center', margin: 5}}>
            <Image
              source={I.np}
              style={{
                width: 50,
                height: 50,
                marginRight: 5,
              }}
              resizeMode="contain"
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
                placeholder={'Search Product...'}
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
          <ScrollView horizontal={true}>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={e => {
                  console.log(e);
                  setpdData(productData);
                  setBtnstring('All');
                }}
                style={
                  btnstring === 'All'
                    ? styles.buttonSelected
                    : styles.buttonNormal
                }>
                <Text
                  style={{
                    fontWeight: '600',
                    color: btnstring === 'All' ? 'white' : 'black',
                  }}>
                  All
                </Text>
              </TouchableOpacity>
              {pdData['category'].map((data, id) => (
                <TouchableOpacity
                  key={id}
                  onPress={() => {
                    setpdData(handleProduct(data));
                    console.log(data.productcategory);
                    setBtnstring(data.productcategory);
                  }}
                  style={
                    btnstring === data.productcategory
                      ? styles.buttonSelected
                      : styles.buttonNormal
                  }>
                  <Text
                    style={{
                      fontWeight: '600',
                      color:
                        btnstring === data.productcategory ? 'white' : 'black',
                    }}>
                    {data.productcategory}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {pdData['product'] == false ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              top: 20,
            }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '500',
                color: C.textmuted,
              }}>
              No Products Are Avaliable.
            </Text>
          </View>
        ) : (
          <View
            style={{
              flex: 1,
            }}>
            {RenderProductItem()}
          </View>
        )}
      </View>
    );
  } else {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Loading..........</Text>
      </View>
    );
  }
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
  category: {
    flexDirection: 'row',
    overflow: 'scroll',
  },
  buttonNormal: {
    padding: 10,
    backgroundColor: 'white',
    margin: 6,
    borderRadius: 10,
  },
  buttonSelected: {
    padding: 10,

    backgroundColor: C.blackbutton,
    color: 'white',
    margin: 6,
    borderRadius: 10,
  },
});
export default Container;
