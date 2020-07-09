import React,{useState,useEffect} from 'react';
import { Dimensions, Text, View ,Button,Alert,Image,TextInput,Keyboard,ScrollView,TouchableOpacity,ActivityIndicator} from 'react-native';
import {globalStyles} from '../styles/global';
import {Formik} from 'formik';
import * as yup from 'yup'
import Fire from '../Fire'; 
import * as ImagePicker from 'expo-image-picker';
import * as firebase from 'firebase'
import { func } from 'prop-types';
import * as Location from 'expo-location';


const { width, height } = Dimensions.get('screen')

const reviewSchema = yup.object({
  title:yup.string().required().min(4),
  body:yup.string().required().min(8),
  address:yup.string().required().min(4),
//   image_url:yup.string().required(),
  needPeople:yup.string().required().test('is-num-1~5','People must be a 1-4',(val)=>{
        return parseInt(val) < 5 && parseInt(val) > 0
      })
//   rating:yup.string().required().test('is-num-1~5','Rating must be a number 1-5',(val)=>{
//     return parseInt(val) < 6 && parseInt(val) > 0
//   })

})




export default function ReviewForm({addReview}){
    
    const [image,setImage] = useState('https://firebasestorage.googleapis.com/v0/b/mahjong-f43af.appspot.com/o/icon%2Fpicture.png?alt=media&token=621f2b1d-db9c-4999-8176-183a59c34a24')
    const [status,setStatus] = useState(true)
    

    useEffect(()=>{
        console.log('create new event!')
        
        return ()=>{
          onChooseImagePress
          uplpadImage
          
          console.log('clean up')

        }
        
        
    },[])
    const onChooseImagePress = async ()=>{
        // let result = await ImagePicker.launchCameraAsync();
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            allowsMultipleSelection:true,
            quality: 1,
          });

        if(!result.cancelled){
            uplpadImage(result.uri,Fire.uid)
            .then((progress)=>{
                var ref = firebase.storage().ref().child('images/'+progress.metadata.name)
                ref.getDownloadURL().then(function(url){            
                    console.log('url',url)
                    setImage(url)
                    setStatus(false)    
                })               
            }).catch((error)=>{
                Alert.alert(error)
            }) 
        }
    }
    const uplpadImage = async (uri,imageName)=>{
        const response = await fetch(uri);
        const blob = await response.blob()

        var ref = firebase.storage().ref().child('images/'+imageName)
        setImage('https://firebasestorage.googleapis.com/v0/b/mahjong-f43af.appspot.com/o/icon%2Floading.gif?alt=media&token=b4c7ae1c-07db-44cc-8ef8-c3f146276f1c')
        return ref.put(blob);
    }
    

    return(
        <View style={globalStyles.container}>
            <ScrollView>
                <Formik
                    initialValues={{title:'',body:'',address:'',needPeople:'',image_url:''}}
                    validationSchema={reviewSchema}
                    onSubmit={async (values,actions)=>{
                        values.image_url = image

                        
                        actions.resetForm();
                        console.log(values)
                        addReview(values);
                        setImage('https://firebasestorage.googleapis.com/v0/b/mahjong-f43af.appspot.com/o/icon%2Fpicture.png?alt=media&token=621f2b1d-db9c-4999-8176-183a59c34a24')
                        
                        
                    }}
                    onPress={Keyboard.dismiss}
                >
                    {(props)=>(
                        <View>
                            
                            {/* <Button title='上傳照片' onPress={onChooseImagePress}/> */}
                            <TextInput
                                style={globalStyles.input}
                                placeholder='標題'
                                onChangeText={props.handleChange('title')}
                                value={props.values.title}
                                onBlur={props.handleBlur('title')}
                            />
                            <Text style={globalStyles.errorText}>{props.touched.title && props.errors.title}</Text>
                            <TextInput
                                multiline minHeight={150}
                                style={globalStyles.input}
                                placeholder='內容'
                                onChangeText={props.handleChange('body')}
                                value={props.values.body}
                                onBlur={props.handleBlur('body')}
                            />
                            <Text style={globalStyles.errorText}>{props.touched.body && props.errors.body}</Text>
                            <TextInput
                                multiline minHeight={50}
                                style={globalStyles.input}
                                placeholder='地址'
                                onChangeText={props.handleChange('address')}
                                value={props.values.address}
                                onBlur={props.handleBlur('address')}
                            />
                            <Text style={globalStyles.errorText}>{props.touched.address && props.errors.address}</Text>
                            <TextInput
                                style={globalStyles.input}
                                placeholder='人數'
                                onChangeText={props.handleChange('needPeople')}
                                value={props.values.needPeople}
                                keyboardType='numeric'
                                onBlur={props.handleBlur('needPeople')}
                            />
                            <Text style={globalStyles.errorText}>{props.touched.needPeople && props.errors.needPeople}</Text>
                            {/* <TextInput
                                multiline minHeight={50}
                                style={globalStyles.input}
                                placeholder='Review image_url'
                                onChangeText={props.handleChange('image_url')}
                                value={props.values.image_url}
                                onBlur={props.handleBlur('image_url')}
                            /> */}
                            {/* <Text style={globalStyles.errorText}>{props.touched.image_url && props.errors.image_url}</Text> */}
                            
                            
                            <TouchableOpacity onPress={onChooseImagePress}>
                                {image && <Image
                                    source={{uri:image}}
                                    style={{
                                    width: width * 0.85,
                                    height: height * 0.35,
                                    alignSelf: 'center',
                                    position: 'relative',
                                    }}
                                />}
                                

                            </TouchableOpacity>
                            
                            <Button title='新增' disabled={status} onPress={props.handleSubmit}/>
                            
                            
                            
                            
                        </View>
                        
                    )}
                </Formik>

            </ScrollView>
            

        </View>
    )
}