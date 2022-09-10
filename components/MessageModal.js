import React from 'react';
import {View, Text, Modal, TouchableOpacity} from 'react-native';
import {C, I} from './Database';
const MessageModal = ({show, onClose, children, closetext}) => {
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
            width: '80%',

            backgroundColor: 'white',
            borderRadius: 15,
            padding: 10,
            shadowColor: 'black',
            shadowOffset: {width: 2, height: 3},
            shadowRadius: 5,
            shadowOpacity: 0.4,
          }}>
          {children}
          <View style={{width: '100%'}}>
            <TouchableOpacity
              onPress={onClose}
              style={{
                padding: 10,
                backgroundColor: C.blackbutton,
                borderRadius: 15,
                alignItems: 'center',
                marginTop: 10,
              }}>
              <Text style={{color: 'white', fontSize: 19}}>{closetext}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default MessageModal;

export const ConfirmMessageModal = ({
  show,
  onClose,
  children,
  closetext,
  confirmtext,
  onConfirm,
  
}) => {
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
            width: '80%',

            backgroundColor: 'white',
            borderRadius: 15,
            padding: 10,
          
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            
            elevation: 5,
          }}>
          {children}
          <View style={{width: '100%', flexDirection: 'row-reverse'}}>
            <TouchableOpacity
              onPress={onConfirm}
              style={{
                padding: 10,
                backgroundColor: C.blackbutton,
                borderRadius: 15,
                alignItems: 'center',
                marginTop: 10,
                margin: 5,
              }}>
              <Text style={{color: 'white', fontSize: 19}}>{confirmtext}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onClose}
              style={{
                padding: 10,
                backgroundColor: '#f0f0f0',
                borderRadius: 15,
                alignItems: 'center',
                marginTop: 10,
                margin: 5,
              }}>
              <Text style={{color: 'black', fontSize: 19}}>{closetext}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};


export const MessageModalNormal = ({show, children,}) => {
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
            width: '80%',

            backgroundColor: 'white',
            borderRadius: 15,
            padding: 10,
            shadowColor: 'black',
            shadowOffset: {width: 2, height: 3},
            shadowRadius: 5,
            shadowOpacity: 0.4,
          }}>
          {children}
          
        </View>
      </View>
    </Modal>
  );
};
