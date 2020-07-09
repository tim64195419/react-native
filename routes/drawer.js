import {createDrawerNavigator} from 'react-navigation-drawer';

import AboutStack from './aboutStack';
import HomeStack from './homeStack';
import ProfileStack from './profileStack';


import {createAppContainer,createSwitchNavigator} from 'react-navigation';
import LoadingScreen from '../screens/LoadingScreen';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ChatRoom from '../screens/ChatRoom';
import InfoDetail from '../screens/InfoDetail';
import AdScreen from '../screens/AdScreen';


const RootDrawerNavigator = createDrawerNavigator({
    
    Home:{
        screen:HomeStack,
    },
    About:{
        screen:AboutStack,
    },
    Profile:{
        screen:ProfileStack,
    },    
        
});

const AppSwitchNavigator = createSwitchNavigator({
    LoadingScreen:LoadingScreen,
    LoginScreen:LoginScreen,
    RootDrawerNavigator:RootDrawerNavigator,
    ChatRoom:ChatRoom,
    InfoDetail:InfoDetail,
    AdScreen:AdScreen,
    
  
  });
  
  
  

export default createAppContainer(AppSwitchNavigator);
