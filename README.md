# Automate Tasks in Salesforce using JSforce

## Description

This repository guides to automate time-consuming manual tasks in Salesforce using JSforce library.

## Usage

### Installing

In order to use this repository you will need to make sure that the following 
dependencies are installed on your system:
  - Node.js

### Download
Download the code and extract to a folder.
Here's a folder structure after extract:
```
extracted folder/           # Root directory.
|- countrystateautomation/  # app code.
|- config.json              # salesforce environment credentials.
|- package.json             # defines functional attributes of a project that npm uses to install dependencies.
|- package-lock.json        # automatically generated for any operations where npm modifies either the node_modules tree, or package. json

```

### Setup
Run `npm install` in the root directory. `e.g. ...\Downloads\salesforceautomationJSforce-main>npm install`
You should see the folder has a new folder named `node_modules`
```
extracted folder/           # Root directory.
|- countrystateautomation/  # app code.
|- node_modules             # required packages are downloaded locally
|- config.json              # salesforce environment credentials.
|- package.json             # defines functional attributes of a project that npm uses to install dependencies.
|- package-lock.json        # automatically generated for any operations where npm modifies either the node_modules tree, or package. json

```

Edit the `config.json` file to set environment variables:
```md
---
{
	"env" : {
		"SF_USER_NAME" : {
			"description" : "SF_USER_NAME",
			"value" : "xyz.salesforce.com"
		},
		"SF_USER_PASSWORD" : {
			"description" : "SF_USER_PASSWORD",
			"value" : "xyz"
		},
		"SF_LOGIN_URL" : {
			"description" : "SF_LOGIN_URL",
			"value" : "https://login.salesforce.com"
		}
	}
}
---
```

### Usage
The countrystateautomation folder has the following folder structure.
```
countrystateautomation/  # current directory.
|- activeCountries.json  # json file with country isoCode and its equivalent integrationValue.
|- app.js                # node application file

```
Run `node app.js` command in the countrystateautomation directory. `e.g. ...\Downloads\salesforceautomationJSforce-main\countrystateautomation>node app.js`
Terminal promts with below prompt. Enter y to proceed
```
---
SF_USER_NAME => xyz.salesforce.com
SF_LOGIN_URL => https://login.salesforce.com
Is this OK? (y or n)y
---
```

### Code Walkthrough
Import required libraries
```
---
const jsforce = require('jsforce');
var async = require('async');
const fs = require('fs');
var config = require('../config.json');
const prompt = require('prompt-sync')();
---
```
Login to Salesforce
```
---
const connection = new jsforce.Connection({ loginUrl : config.env.SF_LOGIN_URL.value, version : '56.0'});
connection.login(config.env.SF_USER_NAME.value,config.env.SF_USER_PASSWORD.value);
---
```
Mapping of Country isoCode and integrationValue
```
---
const activeCountryMap = new Map();
//path to JSON file 
var activeCountries = JSON.parse(fs.readFileSync('activeCountries.json'));
for (const element of activeCountries) {
  activeCountryMap.set(element.isoCode,element.integrationValue);
}
---
```
Read and modify [Address](https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_addresssettings.htm) metadata 
```
---
var fullNames = ['Address'];
	var retrievedMetadata = {};
    connection.metadata.read('AddressSettings', fullNames, function(err, metadata) {
		if (err) { console.error(err); }
		retrievedMetadata = metadata;
		for (var i=0; i < retrievedMetadata.countriesAndStates.countries.length; i++) {
			var country = retrievedMetadata.countriesAndStates.countries[i];
			//override integration value.
			retrievedMetadata.countriesAndStates.countries[i].integrationValue = activeCountryMap.has(country.isoCode) ? activeCountryMap.get(country.isoCode) : country.isoCode; 
			//active flag is of type String
			retrievedMetadata.countriesAndStates.countries[i].active = activeCountryMap.has(country.isoCode) ? 'true' : 'false';
			retrievedMetadata.countriesAndStates.countries[i].visible = activeCountryMap.has(country.isoCode);
			//not all countries would have states configured by default
			if(retrievedMetadata.countriesAndStates.countries[i].states !== undefined){
				for (var j=0; j < retrievedMetadata.countriesAndStates.countries[i].states.length; j++) {
					//active flag is of type String
					if(country.active == 'true') {
						retrievedMetadata.countriesAndStates.countries[i].states[j].active = 'true';
						retrievedMetadata.countriesAndStates.countries[i].states[j].visible = true;
					}
					else {
						retrievedMetadata.countriesAndStates.countries[i].states[j].active = 'false';
						retrievedMetadata.countriesAndStates.countries[i].states[j].visible = false;
					}
				}
			}
		}
---
```
Write modifications to a json file
```
---
fs.writeFile('output.json',JSON.stringify(retrievedMetadata),'utf8', function(err){
			if(err) {console.log("error while writing to file");}
		});
---
```
Finally update [Address](https://developer.salesforce.com/docs/atlas.en-us.api_meta.meta/api_meta/meta_addresssettings.htm) metadata
```
---
//perform metadata update
connection.metadata.update('AddressSettings', retrievedMetadata, function(err, results) {
	if(err) { console.error(err);}
	console.log("results" + JSON.stringify(results));			
});
---
```