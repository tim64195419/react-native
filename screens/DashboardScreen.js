import React,{useState} from 'react';
import { View, Text, StyleSheet, Button,Dimensions,Image,TouchableOpacity } from 'react-native';
import MapView from 'react-native-maps';
import {Ionicons} from '@expo/vector-icons';
import * as Permissions from 'expo-permissions'
import * as Location from 'expo-location';
import firebase from 'firebase';
import Polyline from '@mapbox/polyline'
import { Marker } from 'react-native-maps'
import Fire from '../Fire'






const locations = []

const { width, height } = Dimensions.get('screen')



class DashboardScreen extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      latitude: null,
      longitude: null,
      locations: locations,
      update:true,
      EventName:locations
    }
    
    
  }
  
  get_db_firestore_data(){
    if(this.state.update){
      Fire.db_firestore.collection('Events').get().then(function(querySnapshot){
        let items = querySnapshot.docs.map(doc=>{
            return doc.data()
        })
        return Promise.all(items)
      }).then((items)=>{
        this.setting(items)
      })
    }
  }
  setting(data){
    this.setState({locations:data,update:false})
    // console.log('asdasdasasd',this.state)
  }
  
  
  async componentDidMount() {
    await this.get_db_firestore_data()
    
    
    const { status } = await Permissions.getAsync(Permissions.LOCATION)
    
    if (status !== 'granted') {
      const response = await Permissions.askAsync(Permissions.LOCATION)
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => this.setState({ latitude, longitude }, this.mergeCoords),
      (error) => console.log('Error:', error)
    )
    // const { locations: [ sampleLocation ] } = this.state
    // const desLatitude = this.state.locations[0].coords.latitude
    // const desLongitude =  this.state.locations[0].coords.longitude

    this.setState({
      desLatitude: 25,
      desLongitude: 121,
      // desLatitude,
      // desLongitude
    }, this.mergeCoords)
    // console.log('1111',this.state.locations[0].coords)
    
    await this.renderMarkers()
  }

  async componentDidUpdate(){
    let {
      locations
    } = this.state
    await Fire.db_firestore.collection('Events')
      // .where('userId', '==', firebase.auth().currentUser.uid)
      // .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot)=>{
        
        const changes = [];
        let changeType = ''
        snapshot.docChanges().forEach(function(change){
          if (change.type === "added") {
            // console.log("added Event: ");
            changes.push(change.doc.data()) 
            changeType = change.type
          }
          if (change.type === "modified") {
            changes.push(change.doc.data())
            changeType = change.type 
          }
          if (change.type === "removed") { 
            changes.push(change.doc.data())
            changeType = change.type
          }
        })
        if(changeType=='added'){
          this.state.locations = changes
          // console.log('qweqew',this.state.locations)
          // console.log('123123')
      
          
        }
      })
      
  }

  mergeCoords = () => {
    const {
      latitude,
      longitude,
      desLatitude,
      desLongitude
    } = this.state

    const hasStartAndEnd = latitude !== null && desLatitude !== null

    if (hasStartAndEnd) {
      const concatStart = `${latitude},${longitude}`
      const concatEnd = `${desLatitude},${desLongitude}`
      this.getDirections(concatStart, concatEnd)
      // console.log(concatStart,concatEnd)
    }
  }
  
  async getDirections(startLoc, desLoc) {
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
      this.setState({ coords,distance,time ,startlocation})
    } catch(error) {
      console.log('Error: ', error)
    }
  }

  onMarkerPress = (location,EventName) => () => {
    const { coords: { latitude, longitude } } = location
    this.setState({
      destination: location,
      desLatitude: latitude,
      desLongitude: longitude,
      EventName:EventName
    }, this.mergeCoords)
    console.log("EventName",EventName.address)
    Fire.setEventName(EventName.address)
   
    // Fire.createEvent(locations)
    
  }

  renderMarkers = () => {
    const { locations } = this.state
    // console.log('hi~~~',locations)
    return (
      <View>
        {
          locations.map((location, idx) => {
            const {
              coords: { latitude, longitude }
            } = location
            const EventName = location
            return (
              <Marker
                key={idx}
                coordinate={{ latitude, longitude }}
                onPress={this.onMarkerPress(location,EventName)}
              />
            )
          })
        }
      </View>
    )
  }

  ChatRoom = () => {
    this.props.navigation.navigate('InfoDetail')

  }

  render() {  
    const {
      time,
      coords,
      distance,
      latitude,
      longitude,
      destination,
      EventName,
      
      
    } = this.state

    if(latitude){
      return (
        
        <MapView
            provider='google'
            showsUserLocation
            style={{ flex: 1 }}
            initialRegion={{
              latitude,
              longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421
            }}
        >
          
          <View
            style={{
              width,
              paddingTop: 10,
              // alignSelf: 'center',
              // alignItems: 'center',
              // height: height * 0.15,
              backgroundColor: 'white',
              // justifyContent: 'flex-end',
              
              
            }}
            >
            <TouchableOpacity onPress={()=> {
              this.props.navigation.navigate('ReviewDetails',EventName)
              Fire.setEventName(EventName.address)
              
              }}
              style={{
                flexDirection:'col',
                alignSelf: 'center',
                alignItems: 'center',

              }}
              >
              <Text style={{ fontWeight: 'bold' }}>EventName: {EventName.address}</Text>
              <Text style={{ fontWeight: 'bold' }}>Time: {time}</Text>
              <Text style={{ fontWeight: 'bold' }}>Distance: {distance}</Text>
              
            </TouchableOpacity>
            
          </View>
          
          {this.state.locations && this.renderMarkers()}
          <MapView.Polyline
            strokeWidth={2}
            strokeColor="blue"
            coordinates={coords}
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
            // onPress={() => {this.props.navigation.navigate('InfoDetail',{EventName:EventName})}}
          />

        </MapView>
        
          // <Button title="Sign out" onPress={() => firebase.auth().signOut()} />
          // <Text>DashboardScreen</Text>
      );

    }
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>We need your permission!</Text>
        {/* <Button title="Sign out" onPress={() => firebase.auth().signOut()} /> */}
      </View>
    )
    
  }
}
export default DashboardScreen;

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