/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  Modal,
  Dimensions,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {I, C} from '../Database';
import axios from 'axios';
import ImageZoom from 'react-native-image-pan-zoom';
import AccordionView from './Collapsible';
const ProductOne = ({navigation, route}) => {
  const {data, followdata, productData} = route.params;
  const [pdData, setPdData] = useState(followdata);
  console.log(followdata, 'Followdata', productData);
  const [detail, setDetail] = useState(null);
  let pdid = 0;
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

  const Details = (pdname, category) => {
    axios
      .post('/api/productview/', {productname: pdname, category: category})
      .then(res => setDetail(res.data))
      .catch(err => console.log(err));
  };

  const filterFollowProduct = (category, dat) => {
    const data = productData['product'].filter(e => e.category == category);

    const data1 = data.filter(d => d !== dat);

    const tempdata = {...productData, ['product']: data1};
    setPdData(tempdata);
    return tempdata;
  };
  useEffect(() => {
    if (detail == null) {
      Details(data.productname, data.category);
    }
  });

  const RenderProductItem = () => {
    return (
      <FlatList
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
        numColumns={2}
        removeClippedSubviews={true} // Unmount components when outside of window
        initialNumToRender={2} // Reduce initial render amount
        maxToRenderPerBatch={1} // Reduce number in each render batch
        updateCellsBatchingPeriod={100} // Increase time between renders
        windowSize={7} // Reduce the window size
      />
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
      fontWeight: '500',
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

  const images = [
    {
      // Simplest usage.
      url: 'https://avatars2.githubusercontent.com/u/7970947?v=3&s=460',

      // width: number
      // height: number
      // Optional, if you know the image size, you can set the optimization performance

      // You can pass props to <Image />.
      props: {
        // headers: ...
        source: I.np,
        resizeMode: 'contain',
      },
    },
  ];
  const imagezoomref = React.createRef();
  if (pdData) {
    return (
      <View style={styles.container}>
        <View style={{flex: 1}}>
          <View style={{position: 'relative', backgroundColor: 'white'}}>
            <ImageZoom
              ref={imagezoomref}
              cropWidth={C.windowWidth * 100}
              cropHeight={200}
              imageWidth={C.windowWidth * 100}
              imageHeight={200}>
              <Image
                source={{uri: axios.defaults.baseURL + data.productimage}}
                style={{
                  width: C.windowWidth * 100,
                  height: 200,
                }}
                resizeMode="contain"
              />
            </ImageZoom>

            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                position: 'absolute',
                padding: 8,
                backgroundColor: '#dfdddd',
                opacity: 0.4,
                borderRadius: 100,
                top: 5,
                left: 5,
              }}>
              <Icon name={'arrow-back-outline'} size={30} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              marginTop: 10,
              marginLeft: 10,
              marginBottom: 10,
            }}>
            <Text style={{fontSize: 23, color: 'black', fontWeight: 'bold'}}>
              {data.productname}
            </Text>
            <Text style={{fontSize: 15, fontWeight: '400', color: 'black'}}>
              Price : {data.price ? data.price : '-'}
            </Text>
            <Text style={{fontSize: 15, fontWeight: '400', color: 'black'}}>
              {data.size ? 'Size : ' + data.size : ''}
            </Text>
            <Text style={{fontSize: 15, fontWeight: '400', color: 'black'}}>
              {data.type ? 'Type : ' + data.type : ''}
            </Text>
          </View>

          <ScrollView>
            {detail == null ? null : (
              <AccordionView
                sections={[{title: 'See More Detail', content: detail.content}]}
              />
            )}
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
                  flexDriection: 'column',
                  justifyContent: 'space-around',
                  flexWrap: 'wrap',
                }}>
                {RenderProductItem()}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    );
  } else {
    return <View style={{flex: 1}}></View>;
  }
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ProductOne;
