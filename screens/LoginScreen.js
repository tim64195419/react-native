import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Container,Form, Input, Item, Button, Label } from 'native-base'

import firebase from 'firebase';
import * as Google from "expo-google-app-auth"
// import * as Expo from 'expo';


class LoginScreen extends Component {
  constructor(props){
    super(props)
    this.state=({
      email:'',
      password:''
    })
  }
  componentDidMount() {

    firebase.auth().onAuthStateChanged((user) => {
      if (user != null) {
        
      }
    })
  }

  signUpUser = (email,password)=>{
    try{
      if(this.state.password.length<6){
        alert('Please enter at least 6 characters')
        return;
      }

      firebase.auth().createUserWithEmailAndPassword(email,password)
    }catch(error){
      console.log(error.toString())
    }

  }

  logInUser = (email,password)=>{
    try{
      firebase.auth().signInWithEmailAndPassword(email,password).then(function(user){
        // console.log(user)
      })

    }catch(error){
      console.log(error.toString())
    }

  }
  //google isUserEqual
  isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId ===
            firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()
        ) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  };
  onSignIn = (googleUser) => {
    // console.log('Google Auth Response:', googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase.auth().onAuthStateChanged(
      function(firebaseUser) {
        unsubscribe();
        // Check if we are already signed-in Firebase with the correct user.
        if (!this.isUserEqual(googleUser, firebaseUser)) {
          // console.log(firebaseUser)
          // Build Firebase credential with the Google ID token.
          var credential = firebase.auth.GoogleAuthProvider.credential(
            googleUser.idToken,
            googleUser.accessToken,
            // googleUser.getAuthResponse().id_token
            
          );
          // console.log(credential)
          
          // Sign in with credential from the Google user.
          //signInAndRetrieveDataWithCredential
          firebase
            .auth()
            .signInWithCredential(credential)
            .then(function(result) {
              console.log('user signed in ');
             
              if(result.additionalUserInfo.isNewUser){
                firebase
                  .database()
                  .ref('/users/' + result.user.uid)
                  .set({
                    gmail: result.additionalUserInfo.profile.email,
                    profile_picture: result.additionalUserInfo.profile.picture,
                    first_name: result.additionalUserInfo.profile.given_name,
                    last_name: result.additionalUserInfo.profile.family_name,
                    created_at: Date.now(),
                    
                  })
                  .then(function(snapshot) {
                    // console.log('Snapshot', snapshot);
                  });
              } else {
                firebase
                  .database()
                  .ref('/users/' + result.user.uid)
                  .update({
                    last_logged_in: Date.now()
                  });
              }
            })
            .catch(function(error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              // The email of the user's account used.
              var email = error.email;
              // The firebase.auth.AuthCredential type that was used.
              var credential = error.credential;
              // ...
            });
        } else {
          console.log('User already signed-in Firebase.');
        }
      }.bind(this)
    );
  };
    signInWithGoogleAsync = async () => {
        try {
          const result = await Google.logInAsync({
            // androidClientId: YOUR_CLIENT_ID_HERE,
            // behavior:'web',
            iosClientId: '563873674691-lefn5jqsa7ckds4ituh0bicrf1vm5k4l.apps.googleusercontent.com',
            scopes: ['profile', 'email'],
            
          });
      
          if (result.type === 'success') {
            this.onSignIn(result)
            
            return result.accessToken;
          } else {
            return { cancelled: true };
          }
        } catch (e) {
          return { error: true };
        }
      }

    render() {
        return (
          <Container style={styles.container}>
            <Form>
              <Item>
                <Label>Email</Label>
                <Input 
                  autoCorrect={false}
                  autoCapitalize='none'
                  onChangeText={(email)=>this.setState({email})}
    
                />
              </Item>
              <Item>
                <Label>Password</Label>
                <Input 
                  secureTextEntry={true}
                  autoCorrect={false}
                  autoCapitalize='none'
                  onChangeText={(password)=>this.setState({password})}
    
                />
    
              </Item>
              <Button style={{marginTop:10}}
                full
                rounded
                success
                onPress={()=>this.logInUser(this.state.email,this.state.password)}
              >
                <Text style={{color:'white'}}>Log in</Text>
              </Button>
    
              <Button style={{marginTop:10}}
                full
                rounded
                primary
                onPress={()=>this.signUpUser(this.state.email,this.state.password)}
              >
                <Text style={{color:'white'}}>Sign up</Text>
              </Button>
              <Button style={{ marginTop: 10 }}
                full
                rounded
                primary
                onPress={() => this.signInWithGoogleAsync()}
              >
                <Text style={{ color: 'white' }}> Login With Google</Text>
              </Button>
            </Form>
          </Container>     
        )
    }
}

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        // alignItems: 'center',
        justifyContent: 'center',
        padding:10
      },
})
