import React, {useState} from 'react';
import {
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import {Actions} from 'react-native-router-flux';
import {appversion} from '../../Database';
import axios from 'axios';
import AccordionView from './Collapsible';
import {I, C} from '../Database';

const FaqScreen = ({navigation}) => {
  const [SECTIONS, setSections] = useState(null);

  React.useEffect(() => {
    if (SECTIONS == null) {
      axios
        .get('/api/faq/')
        .then(res => {
          const a = res.data.filter(d => d.content != '');
          setSections(a);
        })
        .catch(err => {
          console.log(err);
        });
    }
  });

  return (
    <View style={{flex: 1, margin: 10}}>
      <Text
        style={{fontSize: 18, fontWeight: 'bold', padding: 10, color: 'black'}}>
        Faq (Frequently Asked Questions)
      </Text>

      <ScrollView>
        {SECTIONS == null ? (
          <View>
            <Image source={I.spinnerloadgif} style={{width: 20, height: 20}} />
          </View>
        ) : (
          <AccordionView sections={SECTIONS} />
        )}
      </ScrollView>
    </View>
  );
};

export default FaqScreen;
