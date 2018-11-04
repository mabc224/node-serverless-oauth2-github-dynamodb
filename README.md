# Node Serverless oauth2 github Dynamodb offline cookie

Serverless application with Node.js to perform GitHub oauth2 authentication and get access token, api utilization with token, persevering cookie on client side & saving detail in dynamodb

* Clone repo:

    ```
    git clone git@github.com:mabc224/node-serverless-oauth2-github-dynamodb.git
    ```


## Prerequisite

* Node.js V8.10
* npm V5.6.0
* Java Runtime Engine (JRE) version 6.x or newer
* AWS-CLI to generate credentials(fake allowed), Refer: [Here](https://docs.aws.amazon.com/cli/latest/userguide/cli-install-macos.html) ... after installing aws-cli type following command and set your credentials(***fake allowed for local test***)
* Create OAuth App in [GitHub](https://github.com/settings/developers), see [tutorial here ](https://developer.github.com/apps/building-oauth-apps/creating-an-oauth-app/) and update values in ***oauth2-app-dev.yml*** Line # 1 to 4

### Setup

```
  export AWS_ACCESS_KEY_ID=<key>
  export AWS_SECRET_ACCESS_KEY=<key>
  export AWS_DEFAULT_REGION=<region>

  _Fake Credential_
  export AWS_ACCESS_KEY_ID=AKIYEIAJBI46AFZBSS
  export AWS_SECRET_ACCESS_KEY=XzUf0k/iOImrK2HvuKL27RggzJFjjtCC2wFPK
  export AWS_DEFAULT_REGION=eu-central-1

  OR

  aws configure
 ``` 


* install serverless globally

  ```
  npm install -g serverless
  ```

* JAVA Development KIT, get it for your platform from [Here](http://www.oracle.com/technetwork/java/javase/downloads/index.html)

## Setup Serverless Locally - Offline

* install dependencies:

    ```
    npm install
    ```

* install Dynamodb locally
  ```
  sls dynamodb install
  ```

* Run Server

    ```
    serverless offline start
    ```

    or

    ```
    sls offline start
    ```

- To list all the options for the plugin run:
    
    ```
    sls offline --help
    ```

- Serverless url: ```http://localhost:3001/```
- dynamodb shell url: ```http://localhost:8000/shell/```

## Routes:

  - Setup oauth for github: GET http://localhost:3001/setup
  - Callback redirect route after oauth code in url : GET http://localhost:3001?code=you-see-some-code-after-redirection (auto works)

### Deploy On AWS:

    ```
    npm run deploy
    ```

## Reference

* Simple ouath2 [Click here](https://www.npmjs.com/package/simple-oauth2)
* Github Api [Click here](https://developer.github.com/v3/)
* serverless-offline guide: [Click here](https://www.npmjs.com/package/serverless-offline)
* serverless-dynamodb-local [Click here](https://www.npmjs.com/package/serverless-dynamodb-local)
* aws serverless guide here: [Click here](https://serverless.com/framework/docs/providers/fn/guide/quick-start/)
* DyanomoDB Programming: [Click here](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.04.html) AND [Here](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/dynamodb-example-table-read-write.html)
