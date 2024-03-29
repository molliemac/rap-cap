import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const config = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: 'https://rap-caps.firebaseio.com',
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

class Firebase {
	constructor() {
		app.initializeApp(config);

		this.auth = app.auth();
		this.db = app.database();
	}

	//** Auth API **//
	doCreateUserWithEmailAndPassword = (email, password) => 
		this.auth.createUserWithEmailAndPassword(email, password);

	doSignInWithEmailAndPassword = (email, password) =>
		this.auth.signInWithEmailAndPassword(email, password);

	doSignOut = () => this.auth.signOut();

	doPasswordReset = email => this.auth.sendPasswordResetEmail(email);
	
	doPasswordUpdate = password =>
		this.auth.currentUser.updatePassword(password);

	//** Merge Auth and DB User API **//

	onAuthUserListener = (next, fallback) =>
		this.auth.onAuthStateChanged(authUser => {
			if (authUser) {
				this.user(authUser.uid)
					.once('value')
					.then(snapshot => {
						const dbUser = snapshot.val();

						// default empty roles
						if (!dbUser.roles) {
							dbUser.roles = {};
						}

						// merge auth and db user
						authUser = {
							uid: authUser.uid,
							email: authUser.email,
							...dbUser,
						};

						next(authUser);
					});
			} else {
				fallback();
			}
		});

	//** User API **//

	user = uid => this.db.ref(`users/${uid}`);
	users = () => this.db.ref('users');

	//** Lyrics API **//

	lyric = uid => this.db.ref(`/lyrics/${uid}`);
	lyrics = () => this.db.ref('lyrics');
	categories = () => this.db.ref('categories');
	category = uid => this.db.ref(`/categories/${uid}`);
}

export default Firebase;