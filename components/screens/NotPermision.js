import React from 'react';
import {View,Text} from 'react-native';

const notPermision = ()=>{
    return(
        <View style={{
            flex:1,
            justifyContent:'center',
            alignItems:'center',
        }}>
            <Text>
                This tabs is only for NP students.
            </Text>
        </View>
    )
}

export default notPermision;