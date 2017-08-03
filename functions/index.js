const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.helloWorld = functions.https.onRequest((request, response) => {
	const ref = functions.database.ref('/users');

	console.log(ref);
	// ref.once('value').then(snapshot => {
	// 	console.log(snapshot.val());
	// });

	response.send(snapshot.val());
});


// Keeps track of the length of the 'likes' child list in a separate property.
exports.base = functions.database.ref('/users/{user}/data/income').onWrite(event => {
	const collectionRef = event.data.ref.parent;
	const countRef = collectionRef.parent.child('likes_count');

	// Return the promise from countRef.transaction() so our function
	// waits for this async event to complete before it exits.
	return countRef.transaction(current => {
		if (event.data.exists() && !event.data.previous.exists()) {
			return (current || 0) + 1;
		}
		else if (!event.data.exists() && event.data.previous.exists()) {
			return (current || 0) - 1;
		}
	}).then(() => {
		console.log('Counter updated.');
	});
});

exports.watcher = functions.database.ref('/users')
	.onWrite(event => {
		const original = event.data.val();
		console.log('Uppercasing', event.params.pushId, original);
		const uppercase = original.toUpperCase();
		return event.data.ref.parent.child('uppercase').set(uppercase);
	});


