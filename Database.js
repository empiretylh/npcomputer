import {Dimensions} from 'react-native';

export const COLOR = {
  backgroundcolor: '#f0f0f0',
  black: '#000000',
  textmuted: '#656363',
  blackbutton: '#323232',
  textfield: '#C4C4C4',
  bluecolor: '#0d6efd',
  windowWidth: Dimensions.get('window').width / 100,
  windowHeight: Dimensions.get('window').height / 100,
};

export const IMAGE = {
  np: require('./assets/logo.png'),
  loadgif: require('./assets/loading.gif'),
  spinnerloadgif: require('./assets/spinnerloading.gif'),
  profile: require('./assets/profile_images.jpeg'),
  viber: require('./assets/viber.png'),
  call: require('./assets/call.png'),
  fb: require('./assets/fb.png'),
  map: require('./assets/googlemaps.jpeg'),
  send: require('./assets/send.png'),
  send2: require('./assets/send2.png'),
  thura : require('./assets/i.png'),
  sendgif: require('./assets/send1.gif'),
  scangif: require('./assets/scangif.gif'),
};

// export const baseUrl = 'http://192.168.43.247:8000';

export const baseUrl = 'https://npweb.pythonanywhere.com';

export const appversion = '1.2.2';

export const isEdit = {
  isEdit: false,
  type: null,
  data: null,

  set ChangeEdit(n) {
    this.isEdit = n;
  },
  get getEdit() {
    return this.isEdit;
  },
  set setData(n) {
    this.data = n;
  },
  get getData() {
    return this.isEdit;
  },
  set setType(n) {
    this.type = n;
  },
  get getType() {
    return this.type;
  },
};
