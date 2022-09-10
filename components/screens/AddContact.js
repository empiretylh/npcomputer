import React from 'react';
import {
  View,
  Image,
  Text,
  PermissionsAndroid,
  TouchableOpacity,
} from 'react-native';
import {I, C} from '../Database';
import Contacts from 'react-native-contacts';
import {Actions} from 'react-native-router-flux';
import {saveData, deleteItem} from '../Storage';

import {requestMultiple, PERMISSIONS, RESULTS} from 'react-native-permissions';

const AddPhoneContact = () => {
  const AddContact = async () => {
    requestMultiple([
      PERMISSIONS.ANDROID.WRITE_CONTACTS,
      PERMISSIONS.ANDROID.READ_CONTACTS,
    ]).then(result => {
      console.log();
      if (
        result['android.permission.READ_CONTACTS'] == RESULTS.GRANTED &&
        result['android.permission.WRITE_CONTACTS'] == RESULTS.GRANTED
      ) {
        var newPerson = {
          phoneNumbers: [
            {
              label: 'mobile',
              number: '+959791391736',
            },
          ],

          givenName: 'NP Computer & Photo (Myaungmya)',
        };
        try {
          Contacts.addContact(newPerson);
          console.log('Contact Added');
          Actions.login();
          saveData('IsPhoneno', 'true');
        } catch {
          err => console.log(err);
        }
      } else {
        console.log('resykt dennide');
        return false;
      }
    });
  };
  return (
    <View style={{flex: 1, alignItems: 'center', backgroundColor: 'white'}}>
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
        <Text style={{color: 'black', fontSize: 18, fontWeight: 'bold'}}>
          NP Computer & Photo
        </Text>
        <Text style={{}}>Digital Photo Printing Services & Computer</Text>
        <View style={{alignItems: 'center', marginTop: 20}}>
          <Text style={{fontSize: 20, fontWeight: 'bold', color: 'black'}}>
            09791391736
          </Text>
          <TouchableOpacity
            onPress={AddContact}
            style={{
              width: '95%',
              padding: 20,
              backgroundColor: C.blackbutton,
              borderRadius: 15,
              margin: 5,
            }}>
            <View>
              <Text style={{fontSize: 15, color: 'white'}}>Add To Contact</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default AddPhoneContact;
