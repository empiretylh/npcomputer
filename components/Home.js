import React from 'react';
import {View,Text,TouchableOpacity} from 'react-native';
import axios from 'axios';

const Home = ()=>{

  const handleRequest = () => {
        // This request will only succeed if the Authorization header
        // contains the API token
//

      console.log(axios.defaults.headers.common)
       axios
       .get('http://127.0.0.1:8000/api/auth/profile/')
       .then(response=>{console.log(response)})
       .catch(err=>console.log(err));
      } 


    return(
        <View>
            <Text> Home screen here</Text>
            <TouchableOpacity onPress={()=>handleRequest()}>
                <View><Text>Log Out</Text></View>
            </TouchableOpacity>
            </View>
    )
}

export default Home;