import React from 'react';
import { StyleSheet, Text, View,Container,Content,Header,Form,Input,Button,Label,Item} from 'react-native';
import {createAppContainer,createSwitchNavigator} from 'react-navigation';
import LoadingScreen from '../screens/LoadingScreen';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ChatRoom from '../screens/ChatRoom';

import InfoDetail from '../screens/InfoDetail';


import 'firebase/firestore';
// for firestore can't find atob
import {decode, encode} from 'base-64'
if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }



export default class switchNavigator extends React.Component {
  render(){
    return (
      
    <AppNavigator />
    )
  }

}

const AppSwitchNavigator = createSwitchNavigator({
  LoadingScreen:LoadingScreen,
  LoginScreen:LoginScreen,
  DashboardScreen:DashboardScreen,
  ChatRoom:ChatRoom,
  InfoDetail:InfoDetail,
  

});

const AppNavigator = createAppContainer(AppSwitchNavigator)


