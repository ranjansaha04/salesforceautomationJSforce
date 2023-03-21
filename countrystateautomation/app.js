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
	var fullNames = ['Address'];
    connection.metadata.read('AddressSettings', fullNames, function(err, metadata) {
	if (err) { console.error(err); }
	console.log("Full Name: " + metadata.fullName);
	var countries = metadata.countriesAndStates.countries;
	for (var i=0; i < countries.length; i++) {
		var country = countries[i];
		console.log("Actve " + country.active);
		console.log("IntegrationValue " + country.integrationValue	);
		console.log("isoCode " + country.isoCode);
	}
	});
}