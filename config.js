// import * as firebase from 'firebase'
// import 'firebase/firestore';
import firebase from 'firebase'

export const firebaseConfig = {
  apiKey: "AIzaSyB2ReSK2x6PPCh284Ca67AIcB3hWgIBMDY",
  authDomain: "mahjong-f43af.firebaseapp.com",
  databaseURL: "https://mahjong-f43af.firebaseio.com",
  projectId: "mahjong-f43af",
  storageBucket: "mahjong-f43af.appspot.com",
  messagingSenderId: "920832625541",
  appId: "1:920832625541:web:a7a6df050cbd32110a92ec",
  measurementId: "G-RRJSY205BL"
};

// firebase.initializeApp(firebaseConfig);
// export default firebase

// export default !firebase.apps.length
//   ? firebase.initializeApp(firebaseConfig).firestore()
//   : firebase.app().firestore();