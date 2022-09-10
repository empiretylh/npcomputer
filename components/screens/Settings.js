import React, {useState} from 'react';
import {View, Text, TouchableOpacity, BackHandler, Image} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import {Actions} from 'react-native-router-flux';
import {appversion, IMAGE} from '../../Database';
const Settings = ({navigation}) => {
  return (
    <View style={{flex: 1, margin: 10}}>
      <Text style={{fontSize: 18, fontWeight: 'bold', color: 'black'}}>
        Settings
      </Text>
      <TouchableOpacity
        onPress={() => {
          const result = EncryptedStorage.removeItem('secure_token');
          if (result) {
            BackHandler.exitApp();
            Actions.main();
          }
        }}
        style={{
          padding: 10,
          backgroundColor: '#f0f0f0',
          borderRadius: 15,
        }}>
        <View>
          <Text style={{fontSize: 15, color: 'black'}}> Log out</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          padding: 10,
          backgroundColor: '#f0f0f0',
          borderRadius: 15,
        }}>
        <View>
          <Text style={{fontSize: 15, color: 'black'}}>
            App Version {appversion}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          padding: 10,
          backgroundColor: '#f0f0f0',
          borderRadius: 15,
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <View>
          <View
            style={{
              width: 50,
              height: 50,
              backgroundColor: 'black',
              borderRadius: 50,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={IMAGE.thura}
              style={{width: 35, height: 35, position: 'absolute', top: 6}}
            />
          </View>
        </View>
        <Text style={{color: 'black', fontSize: 15}}> Developer Contact </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Settings;
