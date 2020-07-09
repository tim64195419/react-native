import React, { Component } from 'react';
import {  Text, View ,Button,FlatList,TouchableOpacity,TextInput } from 'react-native';



export default function AdScreen({navigation}){
  const handled = ()=>{

    console.log('hello')
    navigation.navigate('RootDrawerNavigator')
  }
  return(
      <View>
        <Text></Text>
        <Text></Text>
        <Text>廣</Text>
        <Text>吿</Text>
        <Text>頁</Text>
        <Text>面</Text>
        
        
        <Button title='Welcome' onPress={()=> {
              navigation.navigate('RootDrawerNavigator')}}/>

      </View>
      
  )
}