import firebase from 'firebase'

const config = {
    apiKey: "AIzaSyAqoaHRcN8mo5fs793cSGyYtqeyXCBRyUU",
    authDomain: "rap-caps.firebaseapp.com",
    databaseURL: "https://rap-caps.firebaseio.com",
    projectId: "rap-caps",
    storageBucket: "rap-caps.appspot.com",
    messagingSenderId: "821452696707"
};
firebase.initializeApp(config);

export default firebase;