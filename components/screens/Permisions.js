import {PermissionsAndroid} from 'react-native';

import {
  request,
  requestMultiple,
  check,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';

const appname = 'NP Computer';

export const requestContactPermission = async () => {
  console.log('....................... Contact Permission Requestiong');
  requestMultiple([
    PERMISSIONS.ANDROID.WRITE_CONTACTS,
    PERMISSIONS.ANDROID.READ_CONTACTS,
  ]).then(result => {
    console.log();
    if (
      result['android.permission.READ_CONTACTS'] == RESULTS.GRANTED &&
      result['android.permission.WRITE_CONTACTS'] == RESULTS.GRANTED
    ) {
      console.log('resykt granted');
      return true;
    } else {
      console.log('resykt dennide');
      return false;
    }
  });
};

export const requestCameraPermission = async () => {
  console.log('....................... Contact Permission Requestiong');
  request(PERMISSIONS.ANDROID.CAMERA).then(result => {
    console.log(result);
    if (result == RESULTS.GRANTED) {
      return true;
    } else {
      return false;
    }
  });
};
