This is a fork of: atoy40:accounts-cas https://atmospherejs.com/atoy40/accounts-cas
===================

## Improvements to atoy40 version
* Handle (non-standard) http protocol (see tag 'http-only')
* Use xmlparser instead of newline parsing

## TODO
* Add tests
* Submit changes as a PR
* Cleanup code


CAS login support.

## Usage

put CAS settings in Meteor.settings (for exemple using METEOR_SETTINGS env or --settings) like so:

```
"cas": {
	"baseUrl": "https://sso.univ-pau.fr/cas/",
 	"autoClose": true
},
"public": {
	"cas": {
		"loginUrl": "https://sso.univ-pau.fr/cas/login",
		"serviceParam": "service",
		"popupWidth": 810,
		"popupHeight": 610
	}
}
```

Then, to start authentication, you have to call the following method from the client (for example in a click handler) :

```
Meteor.loginWithCas([callback]);
```

It must open a popup containing you CAS login from. The popup will be close immediately if you are already logged with your CAS server.
