import React,{useState,useContext,useEffect} from 'react';
import { View, Text, StyleSheet, Dimensions,Image,TouchableOpacity } from 'react-native';
import MapView from 'react-native-maps';
import * as Permissions from 'expo-permissions'

import Polyline from '@mapbox/polyline'
import { Marker } from 'react-native-maps'
import Fire from '../Fire'
import {DataContext} from '../App';

const { width, height } = Dimensions.get('screen')

export default function DashboardScreen({navigation}) {

  const dataContext = useContext(DataContext)
  const [coords,setCoords] = useState({latitude:null,longitude:null})
  const [desCoords,setDesCoords] = useState({desLatitude:null,desLongitude:null})
  const [locations,setLocations] = useState(dataContext.data)
  const [eventName,setEventName] = useState()
  const [destination,setDestination] = useState()
  const [directionInfo,setDirectionInfo] = useState({coords:null,distance:'',time:'',startlocation:null})
  

  useEffect(()=>{  
    authPermissionsLocation()
    dataRender()
    dataChange()
    getDirections()
    console.log('Dashboard refresh')
    return ()=>{
      authPermissionsLocation
      dataRender
      dataChange
      getDirections
      console.log('useEffect unmount')
    }
  },[dataContext,setLocations,setDirectionInfo])

  const dataRender = ()=>{   
  
    setLocations(dataContext.data)
    
    
  }

  const dataChange = async ()=>{
    await Fire.db_firestore.collection('Events')
      .onSnapshot((snapshot)=>{
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
        if(changeType !== 'added'){
          dataRender()
      
          
        }
      })
  }

  
  const authPermissionsLocation = async ()=>{
    const { status } = await Permissions.getAsync(Permissions.LOCATION)
    
    if (status !== 'granted') {
      const response = await Permissions.askAsync(Permissions.LOCATION)
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => setCoords({ latitude, longitude }),
      (error) => console.log('Error:', error)
    )
    setDesCoords({desLatitude:coords.latitude,desLongitude:coords.longitude})
    mergeCoords()
    // await renderMarkers()

  }
  

  const mergeCoords = ()=>{
    const hasStartAndEnd = coords.latitude !==null && desCoords.desLatitude !== null
    if(hasStartAndEnd){
      const concatStart = `${coords.latitude},${coords.longitude}`
      const concatEnd = `${desCoords.desLatitude},${desCoords.desLongitude}`
      getDirections(concatStart, concatEnd)

    }

  }

  const getDirections = async (startLoc,desLoc)=>{
    try {
      const resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${desLoc}&key=AIzaSyDgkU5775LUQXl8NDdIJzXNEyun95sA_rY`)
      const respJson = await resp.json();
      // console.log('respJson',respJson)
      const response = respJson.routes[0]
      const distanceTime = response.legs[0]
      const distance = distanceTime.distance.text
      const startlocation = distanceTime.start_location.lat
      const time = distanceTime.duration.text
      
      const points = Polyline.decode(respJson.routes[0].overview_polyline.points);
      const coords = points.map(point => {
        return {
          latitude: point[0],
          longitude: point[1]
        }
      })

      console.log('distance~~~',time,distance)
      setDirectionInfo({coords,distance,time,startlocation})
    }catch(error) {
      console.log('Error: ', error)
    }

  }

  const onMarkerPress = (location,EventName)=>{
    setDestination(location)
    console.log('desCoords!!!',location.coords.latitude,location.coords.longitude)
    setDesCoords({desLatitude:location.coords.latitude,desLongitude:location.coords.longitude})
    console.log('desCoords',desCoords)
    setEventName(EventName)
    mergeCoords()
    console.log("EventName!",EventName)
    Fire.setEventName(EventName)
  }

  
  const renderMarkers = ()=>{
    return (
      <View>
        { 
          locations.map((location,idx) => {
            {/* console.log('mapping',location) */}
            const EventName = location.address
            const coords = location.coords
            {/* console.log('EventName!!!',EventName) */}
            
            return (
              <Marker
                key={idx}
                coordinate={coords}
                onPress={()=>onMarkerPress(location,EventName)}
                
              />
            )
          })
        }
      </View>
    )

  }

  
  
  if(coords.latitude!==null){
    const latitude = coords.latitude
    const longitude = coords.longitude
    return (
      <MapView
          provider='google'
          showsUserLocation
          style={{ flex: 1 }}
          initialRegion={{
            latitude:latitude,
            longitude:longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
      >
        
        <View
          style={{
            width,
            paddingTop: 10,
            backgroundColor: 'white',

          }}
          >
          <TouchableOpacity onPress={()=> {
            if(eventName.length>=1){
              navigation.navigate('ReviewDetails',eventName)
              Fire.setEventName(eventName)

            }
            
            
            }}
            style={{
              flexDirection:'col',
              alignSelf: 'center',
              alignItems: 'center',

            }}
            >
            <Text style={{ fontWeight: 'bold' }}>EventName: {eventName}</Text>
            <Text style={{ fontWeight: 'bold' }}>Time: {directionInfo.time}</Text>
            <Text style={{ fontWeight: 'bold' }}>Distance: {directionInfo.distance}</Text>
            
          </TouchableOpacity>
          
        </View>
        
        {locations && renderMarkers()}
        <MapView.Polyline
          strokeWidth={2}
          strokeColor="blue"
          coordinates={directionInfo.coords}
        />
        
        <Image
          source={{uri:destination && destination.image_url}}
          style={{
            flex: 1,
            width: width * 0.95,
            height: height * 0.30,
            alignSelf: 'center',
            position: 'absolute',
            bottom: height * 0.05
          }}
          
        />
      </MapView>
    )

  }else{
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>We need your permission!</Text>
      </View>
    )

  }
    
    
  
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});