import {createStackNavigator} from 'react-navigation-stack';
import profile from '../screens/profile';
import Header from '../shared/header'
import React from 'react';

const screens = {
    Profile:{
        screen:profile,
        navigationOptions: ({navigation})=> {
            return{
                headerTitle:()=> <Header navigation={navigation} title='Profile'/>,
            }           
        }
    },
        
}

const ProfileStack = createStackNavigator(screens,{
    defaultNavigationOptions:{
        headerStyle:{ backgroundColor:'#fda' }
    }
});

export default ProfileStack;
