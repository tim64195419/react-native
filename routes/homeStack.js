import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation'
import Home from '../screens/home'
import ReviewDetails from '../screens/reviewDetails'
import ChatRoom from '../screens/ChatRoom';
import Header from '../shared/header'
import React from 'react';

const screens = {
    Home:{
        screen:Home,
        navigationOptions: ({navigation})=> {
            return{
                
                headerTitle:()=> <Header navigation={navigation} title='揪麻將'/>,
            }           
        }
    },
    ReviewDetails:{
        screen:ReviewDetails
    },
    ChatRoom:{
        screen:ChatRoom
    }
    
    
    
    
}

const HomeStack = createStackNavigator(screens,{
    defaultNavigationOptions:{
        headerStyle:{ backgroundColor:'#fda' }

    }
});

export default HomeStack;
