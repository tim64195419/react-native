import firebase from 'firebase'
import 'firebase/firestore'




class Fire {
    state={
        RoomId:'room1'
    }
    createInfo ={
        latitude:null,
        longitude:null
    }
    

    constructor(){
        this.init()
        this.checkAuth()

    }   
    init = ()=>{
        if(!firebase.apps.length){
            firebase.initializeApp({
                apiKey: "AIzaSyB2ReSK2x6PPCh284Ca67AIcB3hWgIBMDY",
                authDomain: "mahjong-f43af.firebaseapp.com",
                databaseURL: "https://mahjong-f43af.firebaseio.com",
                projectId: "mahjong-f43af",
                storageBucket: "mahjong-f43af.appspot.com",
                messagingSenderId: "920832625541",
                appId: "1:920832625541:web:a7a6df050cbd32110a92ec",
                measurementId: "G-RRJSY205BL"
            });
            
        }
    };
    checkAuth = ()=>{
        firebase.auth().onAuthStateChanged(user=>{
            if(!user){
                // firebase.auth().signInAnonymously();
            }
        });
    };

    send = messages =>{
        messages.forEach(item=>{
            const message = {
                text:item.text,
                timestamp:firebase.database.ServerValue.TIMESTAMP,
                user:item.user
            };
            this.db.push(message);
            // firebase.database().ref('messages').push(message);
        });
    };
    parse = message =>{
        const{user,text,timestamp} = message.val();
        const{key:_id} =message;
        const createdAt = new Date(timestamp);
        const image =Fire.userPhoto

        return{
            _id,
            createdAt,
            text,
            user,
            image
        };
    };

    get = callback =>{
        this.db.on('child_added',snapshot=>callback(this.parse(snapshot)));
    };

    off(){
        this.db.off()
    }

    setEventName = EventName => {
        this.state.RoomId=EventName
    }

    createEvent = Events =>{
        this.createInfo=Events
        this.db_firestore.collection('Events').doc(this.createInfo.name).set({
            "address": this.createInfo.address,
            "body": this.createInfo.body,
            "checkAuth": this.createInfo.checkAuth,
            "createTime":this.createInfo.createTime,
            "createUserId": this.createInfo.createUserId,
            "image_url": this.createInfo.image_url,
            "key": this.createInfo.key,
            "name": this.createInfo.name,
            "needPeople": this.createInfo.needPeople,
            "status": this.createInfo.status,
            "title": this.createInfo.title,
            "userRation": this.createInfo.userRation,
            "coords":{latitude:this.createInfo.coords.latitude,longitude:this.createInfo.coords.longitude}
      })
        .then(function(docRef) {
            console.log("Document written Done ");
            
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
        
                
    }
    

    chatRoom = (RoomId)=>{
        return firebase.database().ref('ChatRoom/'+RoomId+'/messages');
    }
    get db(){
        return this.chatRoom(this.state.RoomId)
    } 
    
    get db_firestore(){
        return firebase.firestore()
    }

    get uid(){
        return (firebase.auth().currentUser || {}).uid;
    }
    get user(){
        return (firebase.auth().currentUser).email
    }
    get userPhoto(){
        return (firebase.auth().currentUser).photoURL
    }
    

}
export default new Fire();