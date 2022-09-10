import React from 'react';
import {View, Text, Modal, Image, TouchableOpacity} from 'react-native';
import {C, I} from '../Database';
const LoadingModal = ({show, infotext}) => {
  return (
    <Modal
      visible={show}
      style={{justifyContent: 'center', alignItems: 'center'}}
      animationType="slide"
      transparent={true}>
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
            backgroundColor: '#f0f0f0',
            borderRadius: 15,
            padding: 10,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,

            elevation: 5,
            alignItems: 'center',
          }}>
          <Image source={I.spinnerloadgif} style={{width: 50, height: 50}} />
          <Text>{infotext ? infotext : ' Loading...'}</Text>
        </View>
      </View>
    </Modal>
  );
};

export default LoadingModal;
