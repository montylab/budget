import * as firebase from 'firebase';
import Vue from 'vue'

const config = {
	apiKey: "AIzaSyAiosYDEN9e8PwUyNotnUD5YMqBHQmkiKY",
	authDomain: "budget-86974.firebaseapp.com",
	databaseURL: "https://budget-86974.firebaseio.com",
	projectId: "budget-86974",
	storageBucket: "budget-86974.appspot.com",
	messagingSenderId: "98263644403"
}

export default {
	user: null,
	token: null,
	initialized: false,

	events: new Vue(),

	init: function () {
		firebase.initializeApp(config)
		this.initialized = true
		
		firebase.auth().onAuthStateChanged((user) => {
			this.user = user;
			this.token = user && user.Yd;

			this.events.$emit('authStateChanged', user);
		});
	},

	authorized: function () {
		if (this.initialized) {
			this.getUid();
		}
		return !!this.token;
	},

	getUid: function () {
		if (firebase.auth().currentUser) {
			firebase.auth().currentUser.getIdToken().then(token => {
				this.user = firebase.auth().currentUser;
				this.token = token;
			});
		}

		return this.user && this.user.uid;
	},

	signin: function () {
		const provider = new firebase.auth.GoogleAuthProvider();
		firebase.auth().signInWithPopup(provider).then(result => {
			this.token = result.credential.accessToken;
			this.user = result.user;

			this.events.$emit('authorized', this.token);
		}).catch(function (error) {
			console.error(error);
		});
	},
}