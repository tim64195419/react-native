import {createStackNavigator} from 'react-navigation-stack';
import DashboardScreen from '../screens/DashboardScreen';
import Header from '../shared/header'
import React from 'react';
import ReviewDetails from '../screens/reviewDetails'
import ChatRoom from '../screens/ChatRoom';

const screens = {
    About:{
        screen:DashboardScreen,
        navigationOptions: ({navigation})=> {
            return{
                headerTitle:()=> <Header navigation={navigation} title='尋找場地'/>,
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

const AboutStack = createStackNavigator(screens,{
    defaultNavigationOptions:{
        headerStyle:{ backgroundColor:'#fda' }
    }
});

export default AboutStack;
