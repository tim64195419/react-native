import React,{useState,useEffect} from 'react';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';
import Navigator from './routes/drawer'
import {decode, encode} from 'base-64'

if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }



const getFonts =()=> Font.loadAsync({
    'roboto-bold':require('./assets/fonts/Roboto-Bold.ttf'),
    'roboto-medium':require('./assets/fonts/Roboto-Medium.ttf'),
});



export default function App() {
  const [fontsLoaded,setFontsLoaded] = useState(false);
  

  if(fontsLoaded){
    return (
      
      <Navigator />
      
      
    );

  } else { 
    return(
      <AppLoading
      startAsync={getFonts}
      onFinish={()=>setFontsLoaded(true)}
      />
    )
  }
}

