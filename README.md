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