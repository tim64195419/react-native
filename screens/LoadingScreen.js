import React, { Component } from 'react'
import { Text, StyleSheet, View ,ActivityIndicator} from 'react-native'
import firebase from 'firebase'
// import Navigator from './routes/drawer'


export default class LoadingScreen extends Component {
    state={
        user:null
    }
    componentDidMount(){
        this.checkIfLoggedIn();
    }

    checkIfLoggedIn = () => {
        firebase.auth().onAuthStateChanged(
          function(user) {
            console.log('AUTH STATE CHANGED CALLED ')
            if(user){
                console.log('Dashboard')
                this.props.navigation.navigate('RootDrawerNavigator');
                
                
            } else {
                console.log('LoginScreen')
                this.props.navigation.navigate('LoginScreen');
                
            }
          }.bind(this)
        );
    };
    render() {
        return (
            
            <View style={styles.container}>
                <ActivityIndicator size='large'/>
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
})
