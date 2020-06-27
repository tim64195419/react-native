import React ,{useState}from 'react';
import { StyleSheet, Text, View ,Image,TouchableOpacity} from 'react-native';
import {globalStyles,images} from '../styles/global';
import Card from '../shared/card'
import {Ionicons} from '@expo/vector-icons';
import { Directions } from 'react-native-gesture-handler';


export default function ReviewDetails({navigation}) {
  // another go back function
  // const pressHandler =()=>{
  //   navigation.goBack();
  // }
  

  const rating = navigation.getParam('rating')
  return (
    <View style={globalStyles.container}>
      <Card>
        <Text>{ navigation.getParam('title')}</Text>
        
        <Text>{ navigation.getParam('body')}</Text>
        <Text>{ navigation.getParam('needPeople')}</Text>
        <Text>{ navigation.getParam('userRation')}</Text>

        
        <View style={styles.rating}>
        <Text>{ navigation.getParam('address')}</Text>
          <Image source={images.ratings[rating]} />
        </View>
      </Card>
      {/* <Button title='go back to home page' onPress={}/> */}
      
        <TouchableOpacity style={{
              width:30,
              height:30,
              borderRadius:70/2,
              backgroundColor:'#9075e3',
              alignItems:'center',
              justifyContent:'center',
              marginLeft:'45%'
              
          }} 
          onPress={()=> {
          navigation.navigate('ChatRoom',{name:navigation.getParam('name'),messages:navigation.getParam('name')})
          }}>
          <Ionicons name='md-chatbubbles' size={20} color='#fff'/>
        </TouchableOpacity>

      

      
        
    </View>
    
  );
    
}
  
const styles = StyleSheet.create({
  rating:{
    flexDirection:'row',
    justifyContent:'center',
    paddingTop:16,
    marginTop:16,
    borderTopWidth:1,
    borderTopColor:'#eee',


  }
});