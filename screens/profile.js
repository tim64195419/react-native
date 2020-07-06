import React, { useState,useEffect } from 'react'
import { Dimensions,Text, Alert,Image,TouchableOpacity, View ,Button,FlatList} from 'react-native'
import firebase from 'firebase';
import Fire from '../Fire'; 
import Card from '../shared/card'

const { width, height } = Dimensions.get('screen')

export default function profile(){
    const [reviews, setReviews] = useState([]);

    useEffect(()=>{
    
        get_db_firestore_data()
        dataChange()
        console.log('profile refresh')
        return ()=>{
          console.log('useEffect unmount')
         
        }
        
        
      },[])

    
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
            // console.log('here')
            get_db_firestore_data()
        
            
        }
        })
    }
    const get_db_firestore_data = ()=>{
        Fire.db_firestore.collection('Events').where('createUserId','==',Fire.uid).get().then(function(querySnapshot){
          const items = querySnapshot.docs.map(doc=>{
              return doc.data()
           })
          setReviews(items)
          
    
        })
    }


    const del_Event = ()=>{
        Fire.db_firestore.collection('Events').doc(Fire.user).delete().then(()=>{
            console.log(Fire.user,' del Event')
            get_db_firestore_data()
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


        </View>
        
    )
}


