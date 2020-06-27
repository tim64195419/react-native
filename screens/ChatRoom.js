import React from 'react'
import { Image,View,Text,Platform,KeyboardAvoidingView,SafeAreaView,Keyboard,TouchableOpacity,Modal,TouchableWithoutFeedback,StyleSheet} from 'react-native'
import { GiftedChat,Bubble,Send,SystemMessage } from 'react-native-gifted-chat'
import Fire from '../Fire'
import { Button } from 'native-base';
import {Ionicons} from '@expo/vector-icons';
import {MaterialIcons} from '@expo/vector-icons';
import { IconButton } from 'react-native-paper';

export default class ChatRoom extends React.Component {
    
    state = {
        messages:[],
        modalStatus:false,
        pressUserId:null,
        pressUserAvatar:null,
        loadEarlier:true
    }
    
    
    get user(){
        return{
            _id:Fire.uid,
            name:this.props.navigation.state.params.name,
            avatar:Fire.userPhoto
            
        }
    }

    componentDidMount(){
        
        Fire.get(message=>
            this.setState(previous =>({
                messages:GiftedChat.append(previous.messages,message)

            }))
        );
        
        
    }
    
    componentWillUnmount(){
        Fire.off();
    }
    //點擊頭像回調函數
    pressUserAvatar = (user)=>{
        this.setState({modalStatus:true})
        this.setState({pressUserId:user._id})
        this.setState({pressUserAvatar:user.avatar})
        console.log(user)
    }
    renderBubble = (props) => {
        return (
          <Bubble
            {...props}
            wrapperStyle={{
              right: {
                backgroundColor: '#fff'
              }
            }}
            textStyle={{
              right: {
                color: '#111'
              }
            }}
          />
        );
    }
    renderSend =(props) => {
        return (
          <Send {...props}>
            <View style={styles.sendingContainer}>
              <IconButton icon='send-circle' size={32} color='#6646ee' />
            </View>
          </Send>
        );
      }
    
    scrollToBottomComponent = () => {
        return (
          <View style={styles.bottomComponentContainer}>
            <IconButton icon='chevron-double-down' size={36} color='#6646ee' />
          </View>
        );
      }

    renderSystemMessage = (props) => {
        return (
          <SystemMessage
            {...props}
            wrapperStyle={styles.systemMessageWrapper}
            textStyle={styles.systemMessageText}
          />
        );
      }

    

    render() {
        const chat = <GiftedChat 
                        messages = {this.state.messages} 
                        onSend={Fire.send} 
                        user={this.user} 
                        showUserAvatar={true} 
                        showAvatarForEveryMessage={true} 
                        onPressAvatar={this.pressUserAvatar} 
                        placeholder={'請輸入...'}
                        messagesContainerStyle={{ backgroundColor: '#6ee' }}
                        renderBubble={this.renderBubble}
                        scrollToBottom
                        scrollToBottomComponent={this.scrollToBottomComponent}
                        renderSystemMessage={this.renderSystemMessage}
                        renderSend={this.renderSend}
                        
                        
                     />;
        const modalStatus = this.state.modalStatus
        if(Platform.OS === 'android'){
            return(
                <KeyboardAvoidingView style={{flex:1}} behavior='padding' keyboardVerticalOffset={30} enabled>
                    {chat}
                </KeyboardAvoidingView>
            );
        }
        return (
            
            <SafeAreaView style={{flex:1}}>
                <Modal visible={modalStatus} animationType='slide'>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}> 
                        <View >
                        <MaterialIcons
                            name='close'
                            size={24}
                            onPress={()=> this.setState({modalStatus:false})}
                            style={{ ...styles.modalToggle, ...styles.modalClose}}
                        />
                        <Image
                            source={{uri:this.state.pressUserAvatar}}
                            style={{
                                width:100,
                                height:100,
                                borderRadius:70/2,
                                backgroundColor:'#9075e3',
                                alignItems:'center',
                                justifyContent:'center',
                                marginLeft:'38%',
                                marginTop:10
                            }}
                        />
                        <Text style={{alignSelf:'center'}}>{this.state.pressUserId}</Text>
          
                        
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>

                {chat}
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    
    back:{
        width:35,
        height:35,
        borderRadius:70/2,
        backgroundColor:'#4075e3',
        alignItems:'center',
        justifyContent:'center',

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
    },
    sendingContainer: {
      justifyContent: 'center',
      alignItems: 'center'
    },
    bottomComponentContainer: {
      justifyContent: 'center',
      alignItems: 'center'
    },
    systemMessageWrapper: {
      backgroundColor: '#6646ee',
      borderRadius: 4,
      padding: 5
    },
    systemMessageText: {
      fontSize: 14,
      color: '#fff',
      fontWeight: 'bold'
    }
});



