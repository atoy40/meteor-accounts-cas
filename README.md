This is a merged repository of useful forks of: atoy40:accounts-cas https://atmospherejs.com/atoy40/accounts-cas
===================

## Improvements to atoy40 version
* CAS 2.0 support
* Added support of "redirect" instead of "popup window" (disable the popup window)
* Use xmlparser instead of newline parsing

## Install

```
cd ~site
mkdir packages
cd packages
git clone https://github.com/xaionaro/meteor-accounts-cas
cd ~site
meteor add xaionaro:accounts-cas
```

## TODO
* Add tests
* Submit changes as a PR
* Cleanup code


CAS login support.

## Usage

put CAS settings in Meteor.settings (for example using METEOR_SETTINGS env or --settings) like so:

if casVersion is not defined, it will assume you use CAS 1.0

This package depends on NPM node-cas https://github.com/anrizal/node-cas which is forked from https://github.com/kcbanner/node-cas 
There is a pull-request to https://github.com/kcbanner/node-cas. If the pull-request accepted, I will change the dependency. 

```
"cas": {
	"validateUrl": "https://cas.example.com/serviceValidate",
	"autoClose": true,
	"casVersion": 2.0,
	"popup": true,
},
"public": {
	"cas": {
		"loginUrl": "https://cas.example.com/login",
		"serviceParam": "service",
		"popupWidth": 810,
		"popupHeight": 610,
		"popup": true,
	}
}
```

`proxyUrl` is not required. Setup [ROOT_URL](http://docs.meteor.com/api/core.html#Meteor-absoluteUrl) environment variable instead.

Then, to start authentication, you have to call the following method from the client (for example in a click handler) :

```
Meteor.loginWithCas([callback]);
```

It must open a popup containing you CAS login from. The popup will be close immediately if you are already logged with your CAS server.
