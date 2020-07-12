import React, { useState,useEffect,useContext } from 'react'
import { Dimensions,Text, Alert,Image,TouchableOpacity, View ,Button,FlatList} from 'react-native'
import firebase from 'firebase';
import Fire from '../Fire'; 
import Card from '../shared/card'
import {DataContext} from '../App';

const { width, height } = Dimensions.get('screen')

export default function profile(){
    const [reviews, setReviews] = useState([]);
    const dataContext = useContext(DataContext)
    useEffect(()=>{
        proInfo()
        console.log('profile refresh')
        return ()=>{
            proInfo
            console.log('useEffect unmount')
        }
        
        
      },[dataContext,setReviews])

    const proInfo = ()=>{
        
        dataContext.data.map((data)=>{
            if(data.createUserId == Fire.uid){
                // console.log('profile data',data)
                setReviews([data])   
            }
        })
    }


    const del_Event = ()=>{
        Fire.db_firestore.collection('Events').doc(Fire.user).delete().then(()=>{
            console.log(Fire.user,' del Event')
            setReviews([])
        })

    }

    return (
        <View>
            <View>
            <Image
                source={{uri:Fire.userPhoto}}
                style={{
                    width:50,
                    height:50,
                    borderRadius:70/2,
                    backgroundColor:'#9075e3',
                    alignItems:'center',
                    justifyContent:'center',
                    marginLeft:'45%',
                    marginTop:10

                  }}
            />
            <Text style={{alignSelf:'center'}}>{Fire.user}</Text>
            </View>
            <Text>進行中...</Text>
            <FlatList
                data={reviews}
                renderItem={({item})=>(
                <TouchableOpacity onPress={()=> {
                    Alert.alert(
                        '訊息通知',
                        'what do you want to do ?',
                        [
                            {
                            text: 'Edit',
                            onPress: () => {
                                console.log('Edit pressed')
                            }
                            },
                            {
                            text: 'Del',
                            onPress: () => {
                                console.log('Del Pressed'),
                                del_Event()

                            }
                            
                            },
                            { 
                            text: 'Cancel',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel' 
                            }
                        ],
                        { cancelable: false }
                    );
                    
                    
                }}>
                <Card>
                    <Text style={{flex:1}} key={item.key}>{item.title}</Text>
                    {/* {item.image_url && 
                    <Image
                    source={{uri:item.image_url}}
                    style={{
                    width: width * 0.85,
                    height: height * 0.25,
                    alignSelf: 'center',
                    position: 'relative',
                    }}
                    />
                    } */}

                </Card>
                </TouchableOpacity>
                )}
            />
            <Button  title="Sign out" onPress={() => firebase.auth().signOut()} />
            {/* <Button title='add_event' onPress={()=>dataContext.dataDispatch({data:dataContext.data,type:'add_event'})} />
            <Button title='del_event' onPress={()=>dataContext.dataDispatch({type:'del_event'})} /> */}


        </View>
        
    )
}


