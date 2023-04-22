// import required libraries
const jsforce = require('jsforce');
var async = require('async');
const fs = require('fs');
var config = require('../config.json');
const prompt = require('prompt-sync')();

//Establish connection to Salesforce
const connection = new jsforce.Connection({ loginUrl : config.env.SF_LOGIN_URL.value, version : '56.0'});

start();

async function start() {
	console.log('SF_USER_NAME => '+ config.env.SF_USER_NAME.value);
	console.log('SF_LOGIN_URL => '+ config.env.SF_LOGIN_URL.value);
	//prompt to confirm
	let confirm = prompt('Is this OK? (y or n)');
	if(confirm === 'y') {
		await login();		
		await doAction();
	}
}

async function login() {
	await connection.login(config.env.SF_USER_NAME.value,config.env.SF_USER_PASSWORD.value);
	console.log('login successfull');
}

async function doAction() {
	//map of country isoCode to integrationValue
	const activeCountryMap = new Map();
	//path to JSON file 
	var activeCountries = JSON.parse(fs.readFileSync('activeCountries.json'));
	for (const element of activeCountries) {
	  activeCountryMap.set(element.isoCode,element.integrationValue);
	}
	
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
		
		fs.writeFile('output.json',JSON.stringify(retrievedMetadata),'utf8', function(err){
			if(err) {console.log("error while writing to file");}
		});
		//perform metadata update
		connection.metadata.update('AddressSettings', retrievedMetadata, function(err, results) {
			if(err) { console.error(err);}
			console.log("results" + JSON.stringify(results));			
		});
	});
}
