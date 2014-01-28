meteor-accounts-cas
==================

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

The, to start authentication:

```
Meteor.loginWithCas([callback]);
```