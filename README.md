atoy40:accounts-cas
===================

CAS login support.

## Usage

put CAS settings in Meteor.settings (for example using METEOR_SETTINGS env or --settings) like so:

```
"cas": {
	"baseUrl": "https://sso.univ-pau.fr/cas/",
    "proxyUrl": "https://local-proxy",
 	"autoClose": true
},
"public": {
	"cas": {
		"loginUrl": "https://sso.univ-pau.fr/cas/login",
        "proxyUrl": "https://local-proxy",
		"serviceParam": "service",
		"popupWidth": 810,
		"popupHeight": 610
	}
}
```

The ```proxyUrl``` Key:Value pair is only needed if you need to force the callback url. Needed when running through a proxy. Without this value it will read the site URL.

Then, to start authentication, you have to call the following method from the client (for example in a click handler) :

```
Meteor.loginWithCas([callback]);
```

It must open a popup containing you CAS login from. The popup will be close immediately if you are already logged with your CAS server.
