# Authenticate with Singular 

Jan 20, 2020

This document describes the authentication with Singular over HTTPS.


# Introduction

The “Login with Singular” uses basic authentication over HTTPS, as described in the following article on Wikipedia.


    [https://en.wikipedia.org/wiki/Basic_access_authentication](https://en.wikipedia.org/wiki/Basic_access_authentication)

You can integrate the Singular Login Dialog into your application. Users enter their username and password to authenticate with Singular. Your server will receive an access token, which is used to access Singular on behalf of the specific user.


To use the Login Dialog, you need to:


1. Get the **_client id_** and create the **_client secret_** for your account 
2. Setup the **_callback URL_** on your server 

    Singular will redirect the user to the callback URL after the completion of the log-in, whether success or failure.

3. Prepare your server to accept the **_access token_** from the **_callback URL._**


# OAuth Client Credentials

Create your client credentials following the steps below. 

_Note: Only users with “Developer Permissions” enabled have access to the client credentials menu_.

A detailed description for “How do I change user permissions” is available here -> [https://support.singular.live/hc/en-us/articles/360019955471-How-do-I-change-user-permissions-](https://singularlive.zendesk.com/hc/en-us/articles/360019955471-How-do-I-change-user-permissions-)



1. Select the “**Settings**” menu from the dropdown



2. Open the “**OAuth Client**” Settings to copy your “**Client Id,**” generate your “**Client Secret**” and enter the “**Callback URL.**”



# Example Implementation

You can see an example implementation in the demo URL below. 

Demo URL: [https://start.singular.live/examples/loginwithsingular/](https://start.singular.live/examples/loginwithsingular/)

Github Repository: [https://github.com/xinexo/login-with-singular](https://github.com/xinexo/login-with-singular)


# Client-Server Communication to get the Access Token


1. Call the login dialog with your **_client id_**
2. Singular calls the callback URL and returns the **_code _**as a parameter
3. Send a request including the **_code_**, the **_client id_** and the **_client secret _**from your server to Singular to get the access token
4. Singular returns the access token 


# Step by Step Implementation of the Login Dialog



1. [singular user interface] \
Select the “**Settings**” menu from the drop-down, open the **OAuth Client settings** -> copy the  **Client Id**, generate the **Client Secret,** and set the **Callback URL**.
2. [your web UI] \
Create a link and point it to: \
<code>https://app.singular.live/oauth/logindialog?client_id=<strong>{client_id from keys UI}</strong></code>
3. [your web server] \
Prepare your callback URL to accept <strong>{callback url}?code={code} </strong>(if the user is logged in)
4. [your web server] \
Send HTTP POST request with the fields 

        <strong>code: <em>{code returned from Singular}</em></strong>


        **client_id: _{client_id from the OAuth settings UI} _**


        **client_secret: _ {client_secret from the OAuth settings UI}_**


        Send the request to: \
`https://app.singular.live/oauth/accesstoken` 


        Singular returns the **_access token_**.


        **Note: The access token is valid for six months. You have to request a new month.**

5. [your web server] \
Keep this access token. You can use it on every request to the Singular apiv1 with Bearer authorization.  \
Example: Request all compositions in the user’s account

    ```
    var options = {
      url: 'https://app.singular.live/apiv1/compositions',
      method: method,
      json: true,
      headers: { 
        "Authorization": "Bearer " + accessToken,
        "Content-Type": "application/json"
      }
    }

    ```



# 


# Tenant Level

Singular’s OAauth2 flow is a "client credentials grant."

[http://oauthlib.readthedocs.io/en/latest/oauth2/grants/credentials.html](http://oauthlib.readthedocs.io/en/latest/oauth2/grants/credentials.html)

The code example below shows how to get the OAuth2 token. Singular generates the CLIENT_ID and the CLIEnt_SECRET. The user can regenerate the CLIENT_SECRET.

**Two  steps to getting authenticated**



1. Tenant app send the **_CLIENT_ID _**and the **_CLIENT_SECRET _**to request the **access token**
2. Use the **access token** to access any endpoints

    ```
    var credentials = {
      client: {
        id: CLIENT_ID,
        secret: CLIENT_SECRET
      },
      auth: {
        tokenHost: 'https://app.singular.live'
      }
    }

    // Use oauth2 client credential grants
    var oauth2 = require('simple-oauth2').create(credentials);
    oauth2.clientCredentials.getToken({}, function(error, result) {
      if (error) {
        console.log(error);
        cb('Error on get access token: ' + error.message);
      }
    

      var accessToken = oauth2.accessToken.create(result);

      currentToken = accessToken.token;
      cb(null, accessToken.token);
    });
    ```



    Example to request the compositions using the access token.


    ```
    var options = {
      url: 'https://app.singular.live/apiv1/compositions',
      method: method,
      json: true,
      headers: { 
        "Authorization": "Bearer " + accessToken,
        "Content-Type": "application/json"
      }
    }


<!-- Docs to Markdown version 1.0β17 -->
