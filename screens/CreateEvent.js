import React, { Component } from 'react';
import { StyleSheet, Text, View ,Button,FlatList,TouchableOpacity,TextInput } from 'react-native';
import {Formik} from 'formik';
import * as yup from 'yup'
import {globalStyles} from '../styles/global';
import Fire from '../Fire'


const reviewSchema = yup.object({
  title:yup.string().required().min(4),
  body:yup.string().required().min(8),
  rating:yup.string().required().test('is-num-1~5','Rating must be a number 1-5',(val)=>{
    return parseInt(val) < 6 && parseInt(val) > 0
  })
})

export default function CreateEvent({addReview}){

  return(
    <View style={globalStyles.container}>
        <Formik
            initialValues={{title:'',body:'',rating:''}}
            validationSchema={reviewSchema}
            onSubmit={(values,actions)=>{
                actions.resetForm();
                // addReview(values);
                console.log(values)

            }}
        >
            {(props)=>(
                <View>
                    <TextInput
                        style={globalStyles.input}
                        placeholder='Review title'
                        onChangeText={props.handleChange('title')}
                        value={props.values.title}
                        onBlur={props.handleBlur('title')}
                    />
                    <Text style={globalStyles.errorText}>{props.touched.title && props.errors.title}</Text>
                    <TextInput
                        multiline minHeight={100}
                        style={globalStyles.input}
                        placeholder='Review body'
                        onChangeText={props.handleChange('body')}
                        value={props.values.body}
                        onBlur={props.handleBlur('body')}
                    />
                    <Text style={globalStyles.errorText}>{props.touched.body && props.errors.body}</Text>
                    <TextInput
                        style={globalStyles.input}
                        placeholder='Review rating'
                        onChangeText={props.handleChange('rating')}
                        value={props.values.rating}
                        keyboardType='numeric'
                        onBlur={props.handleBlur('rating')}
                    />
                    <Text style={globalStyles.errorText}>{props.touched.rating && props.errors.rating}</Text>
                    <Button title='submit' onPress={props.handleSubmit}/>
                    {/* // <FlatButton title='submit' onPress={props.handleSubmit}/> */}
                    
                </View>
            )}
        </Formik>

    </View>
  )
}