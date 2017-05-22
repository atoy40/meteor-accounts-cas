anrizal:accounts-cas
===================

CAS login support.

Support CAS 1.0 and CAS 2.0

## Usage

put CAS settings in Meteor.settings (for example using METEOR_SETTINGS env or --settings) like so:

if casVersion is not defined, it will assume you use CAS 1.0

This package depends on NPM node-cas https://github.com/anrizal/node-cas which is forked from https://github.com/kcbanner/node-cas 
There is a pull-request to https://github.com/kcbanner/node-cas. If the pull-request accepted, I will change the dependency. 

```
"cas": {
	"baseUrl": "https://sso.univ-pau.fr/cas/",
 	"autoClose": true,
 	"casVersion": 2.0
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
