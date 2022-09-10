import React,{useEffect} from 'react';
import {View, Image, Text} from 'react-native';
import {I, C} from '../Database';

const LoadingScreen = () => {


  return (
    <View style={{flex: 1, alignItems: 'center',backgroundColor:'white'}}>
      <View style={{alignItems: 'center', top: C.windowHeight * 25}}>
        <Image
          source={I.np}
          style={{
            width: 100,
            height: 100,
          }}
          resizeMode={'contain'}
          resizeMethod={'resize'}
        />
        <Text style={{color: 'black',fontSize:18,fontWeight:'bold'}}>NP Computer & Photo</Text>
        <Text style={{}}>Digital Photo Printing Services & Computer</Text>
        <Image
          source={I.loadgif}
          style={{
            width: 100,
            height: 100,
            top:-20,
          }}
          resizeMode={'contain'}
          resizeMethod={'resize'}
        />
      </View>
    </View>
  );
};

export default LoadingScreen;
