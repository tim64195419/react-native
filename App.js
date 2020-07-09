import React,{useState,useReducer,useEffect} from 'react';
import {YellowBox } from "react-native";
import * as Font from 'expo-font';
import { AppLoading } from 'expo';
import Navigator from './routes/drawer'
import {decode, encode} from 'base-64'
import Fire from './Fire'
import { createTheming } from '@callstack/react-theme-provider';

if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

export const DataContext = React.createContext()
YellowBox.ignoreWarnings(["Require cycle:", "Remote debugger"]);

const initialState = {
  // data:[],
  
}
const reducer = (state,action)=>{
  switch(action.type){
    case 'add_event':
      
      return action.data
    default:
      return state
  }
}




const getFonts =()=> Font.loadAsync({
    'roboto-bold':require('./assets/fonts/Roboto-Bold.ttf'),
    'roboto-medium':require('./assets/fonts/Roboto-Medium.ttf'),
});



export default function App() {
  const [fontsLoaded,setFontsLoaded] = useState(false);

  const [data, dispatch] = useReducer(reducer, initialState)


  useEffect(() => {
    
    dataChange()
    return () => {
      dataChange
    
    }
  }, [])

  const dataChange = async ()=>{
    await Fire.db_firestore.collection('Events')
        .onSnapshot((snapshot)=>{
        const changes = [];
        let changeType = ''

        snapshot.docChanges().forEach(function(change){
            if (change.type === "added") {
            changeType = change.type
            }
            if (change.type === "modified") {
            changeType = change.type 
            }
            if (change.type === "removed") { 
            changeType = change.type
            }
        })
        if(changeType){
            console.log('App changeType',changeType)
            get_db_firestore_data()
        
            
        }
        })
    }
  const get_db_firestore_data = ()=>{
    Fire.db_firestore.collection('Events').orderBy("createTime", "desc").get().then(function(querySnapshot){
      const items = querySnapshot.docs.map(doc=>{
          return doc.data()
       })        
      
      dispatch({type:'add_event',data:items})
  
    })
    
  }

  if(fontsLoaded){
    return (
      <DataContext.Provider value={{data:data,dataDispatch:dispatch}}>
        <Navigator />
      </DataContext.Provider>

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

