This is a merged repository of useful forks of: atoy40:accounts-cas
===================
([(https://atmospherejs.com/atoy40/accounts-cas](https://atmospherejs.com/atoy40/accounts-cas))

## Essential improvements to atoy40 version
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

## Usage

Put CAS settings in Meteor.settings (for example using METEOR_SETTINGS env or --settings) like so:

If casVersion is not defined, it will assume you use CAS 1.0. (note by xaionaro: option `casVersion` seems to be just ignored in the code, ATM).

This package depends on NPM node-cas https://github.com/anrizal/node-cas which is forked from https://github.com/kcbanner/node-cas 
There is a pull-request to https://github.com/kcbanner/node-cas. If the pull-request accepted, anrizal [promised to](https://github.com/anrizal/meteor-accounts-cas/commit/78a6c2ab1673213cb41a4f9ce9544f76f7fbb3ad) will change the dependency in his fork. 

Server side settings:

```
Meteor.settings = {
	"cas": {
		"validateUrl": "https://cas.example.com/serviceValidate",
		"autoClose": true,
		"casVersion": 2.0,
		"popup": true,
	}
}
```

Client side settings:

```
Meteor.settings = {
	"public": {
		"cas": {
			"loginUrl": "https://cas.example.com/login",
			"serviceParam": "service",
			"popupWidth": 810,
			"popupHeight": 610,
			"popup": true,
		}
	}
}
```

`proxyUrl` is not required. Setup [ROOT_URL](http://docs.meteor.com/api/core.html#Meteor-absoluteUrl) environment variable instead.

Then, to start authentication, you have to call the following method from the client (for example in a click handler) :

```
Meteor.loginWithCas([callback]);
```

It must open a popup containing you CAS login form or redirect to the CAS login form (depending on "popup" setting).

If popup is disabled (== false), then it's required to execute `Meteor.initCas([callback])` in `Meteor.startup` of the client side. ATM, `Meteor.initCas()` completes authentication.

## Examples

* [https://devel.mephi.ru/dyokunev/start-mephi-ru](https://devel.mephi.ru/dyokunev/start-mephi-ru)


