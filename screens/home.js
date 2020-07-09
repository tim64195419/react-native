import React,{useState,useContext, useEffect} from 'react';
import { Dimensions,StyleSheet, Text, View ,Image,FlatList,TouchableOpacity,Modal,TouchableWithoutFeedback,Keyboard,RefreshControl} from 'react-native';
import {globalStyles} from '../styles/global';
import Card from '../shared/card'
import {MaterialIcons} from '@expo/vector-icons';
import ReviewForm from './reviewForm';
import Fire from '../Fire'
import firebase from 'firebase'
import 'firebase/firestore'
import * as Location from 'expo-location';
import {DataContext} from '../App';

const { width, height } = Dimensions.get('screen')

function wait(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}


export default function Home({navigation}) {
  const [modalOpen,setModalOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [geo,setGeo] = useState({coords:{latitude:null,longitude:null}})
  const [refreshing, setRefreshing] = React.useState(false);
  const [eventStatus,setEventStatus] = useState(true)
  const dataContext = useContext(DataContext)

  useEffect(()=>{
    
    dataRender()
    dataChange()
    console.log('home refresh')
    
    
    return ()=>{
      dataRender
      dataChange
      console.log('useEffect unmount')
      // Location.geocodeAsync().abort()
    }
    
    
  },[dataContext,setReviews])

  const dataRender = ()=>{
    setEventStatus(true)
    const Data = dataContext.data.map((data)=>{
      if(data.createUserId == Fire.uid){
        setEventStatus(false)
      }
      return data 
    })
    setReviews(Data)
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
          onRefresh()
      
          
        }
      })
  }

  //refresh
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
    console.log('refresh...')
    dataRender()
  }, [refreshing]);

  


  const addReview = (review) => {
    review.key = Math.random().toString();
    review.createTime = new Date()
    review.createUserId = Fire.uid;
    review.name = firebase.auth().currentUser.email;
    review.userRation = 5;
    review.status = true;
    review.checkAuth = true;
    const addrJson = review.address.toString()

    console.log(addrJson)

    Location.geocodeAsync(addrJson).then((resp)=>{
      let latitude=resp[0].latitude
      let longitude=resp[0].longitude
      
      setGeo(data => (
        data.coords.latitude = latitude,
        data.coords.longitude = longitude
      ))
      
      console.log('here',typeof(geo.coords))
      if(typeof(geo.coords) === 'object'){
        set()

      }else{
        console.log('no found address pls retry..')
      }
      
      
    }).catch((error) => {
      console.log('Geo Error: ', error)
    })
    
    const set = ()=>{
      review.coords=geo.coords
      console.log('geo',review.coords)

      if(review.coords.latitude){
        setReviews((currentReviews)=>{
          Fire.createEvent(review)
          return [review, ...currentReviews];
        });
        setModalOpen(false);
      }else{
        console.log('create fail')
      }
      //重置geo
      setGeo({coords:{latitude:null,longitude:null}})


    }

    
  }

    return (
      
      <View style={globalStyles.container}>
        <Modal visible={modalOpen} animationType='slide'>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}> 
            <View style={styles.modalContent}>
              <MaterialIcons
                name='close'
                size={24}
                onPress={()=> setModalOpen(false)}
                style={{ ...styles.modalToggle, ...styles.modalClose}}
              />
              <ReviewForm addReview={addReview} />
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        { eventStatus && 
          <MaterialIcons
            
            name='add'
            size={24}
            onPress={()=> {
              setModalOpen(true)
              }}
            style={styles.modalToggle}
          />
        }
        <FlatList
          data={reviews}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({item})=>(
            <TouchableOpacity onPress={()=> {
              navigation.navigate('ReviewDetails',item)
              Fire.setEventName(item.address)
              }}>
              <Card>
                <Text style={globalStyles.titleText} key={item.key}>{item.title}</Text>
                {item.image_url && 
                  <Image
                  source={{uri:item.image_url}}
                  style={{
                  width: width * 0.85,
                  height: height * 0.25,
                  alignSelf: 'center',
                  position: 'relative',
                  }}
                />
                }
                
                
              </Card>
            </TouchableOpacity>
          )}
        /> 
      </View>
    );
}
  
 const styles = StyleSheet.create({
   modalContent:{
      flex:1,
      borderColor:'#e333ee',
      borderWidth:1,
   },
   modalToggle:{
     marginBottom:10,
     borderWidth:1,
     borderColor:'#f2f2f2',
     padding:10,
     borderRadius:10,
     alignSelf:'center',
   },
   modalClose:{
     marginTop:20,
     marginBottom:0,
   }

 });