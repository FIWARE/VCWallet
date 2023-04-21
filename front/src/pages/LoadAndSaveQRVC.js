import { log } from '../log'

let gotoPage = window.MHR.gotoPage
let goHome = window.MHR.goHome

window.MHR.register("LoadAndSaveQRVC", class LoadAndSaveQRVC extends window.MHR.AbstractPage {

    constructor(id) {
        super(id)
    }

    async enter(qrData) {
        let html = this.html

        // We should have received a URL that was scanned as a QR code.
        // Perform some sanity checks on the parameter
        if (qrData == null || !qrData.startsWith) {
            console.log("The scanned QR does not contain a valid URL")
            gotoPage("ErrorPage", {"title": "No data received", "msg": "The scanned QR does not contain a valid URL"})
            return
        }

        // Make sure it is a fully qualified URL
        if (!qrData.startsWith("https://") && !qrData.startsWith("http://") && !qrData.startsWith("openid-initiate-issuance://")) {
            console.log("The scanned QR does not contain a valid URL")
            gotoPage("ErrorPage", {"title": "No data received", "msg": "The scanned QR does not contain a valid URL"})
            return
        }


        if (qrData.startsWith("openid-initiate-issuance://")) {
            // extract info from the openid init string 
            var withoutPrefix = qrData.replace(/^openid-initiate-issuance:\/\/\?/, '');
            var params = withoutPrefix.split('&');
            var i = 0
            while (i < params.length) {
                var paramArray = params[i].split('=');
                if (paramArray[0] == 'pre-authorized_code') {
                var code = paramArray[1];
                }
                if (paramArray[0] == 'format') {
                var format = paramArray[1];
                }
                if (paramArray[0] == 'credential_type') {
                var credential_type = paramArray[1];
                }
                if (paramArray[0] == 'issuer') {
                var issuerAddress = paramArray[1];
                }
                i++;
            }

            var decodedIssuerAddress = decodeURIComponent(issuerAddress)
            // get the openid info from the well-known endpoint
            var openIdInfo = await getOpenIdConfig(decodedIssuerAddress)
            var credentialEndpoint = openIdInfo["credential_endpoint"]
            var tokenEndpoint = openIdInfo["token_endpoint"]
            // get an accesstoken for retrieving the credential
            var authTokenObject = await getAuthToken(tokenEndpoint, code)
            var accessToken = authTokenObject["access_token"]
            // get the actual credential
            var credentialResponse = await getCredentialOIDC4VCI(credentialEndpoint, accessToken, format,JSON.parse(decodeURIComponent(credential_type)))
            console.log("Received the credentials.")
            this.VC = JSON.stringify(credentialResponse["credential"], null, 2)
        } else {
            // We have received a URL that was scanned as a QR code.
            // First we should do a GET to the URL to retrieve the VC.
            this.VC = await getVerifiableCredentialLD(qrData);
        }

        // The VC should be in JSON-LD format (for the moment is the only format we support)

        // As the user if we should store the VC

        let theHtml = html`
        <div class="w3-container">
            <div class="w3-card-4 w3-center w3-margin-top w3-padding-bottom">
        
                <header class="w3-container color-primary" style="padding:10px">
                    <h4>${T("You received a Verifiable Credential")}</h4>
                </header>
        
                <div class="w3-container ptb-16">
                    <p>${T("You can save it in this device for easy access later.")}</p>
                    <p>${T("Please click Save to save the certificate.")}</p>
                </div>
        
                <div class="w3-padding-16">       
                    <btn-primary @click=${() => this.saveVC()}>${T("Save")}</btn-primary>
                </div>
        
            </div>
        </div>
        `

        this.render(theHtml)
    }

    saveVC() {
        console.log("Save VC " + JSON.stringify(this.VC))
        // Store it in local storage
        log.log("Store " + this.VC)
        let total = 0;
        if(!!window.localStorage.getItem("W3C_VC_LD_TOTAL")) {
          total = parseInt(window.localStorage.getItem("W3C_VC_LD_TOTAL"))
          log.log("Total " + total)
        }
        const id = "W3C_VC_LD_"+total
        window.localStorage.setItem(id, this.VC)
        total = total + 1;
        log.log(total + " credentials in storage.")
        window.localStorage.setItem("W3C_VC_LD_TOTAL", total)
        // Reload the application with a clean URL
        gotoPage("DisplayVC", id)
        return
    }

})

async function getCredentialOIDC4VCI(credentialEndpoint, accessToken, format, credential_type) {
    try {
      var credentialReq = {
        format: format,
        types: credential_type
      }
      console.log("Body " + JSON.stringify(credentialReq))
      let response = await fetch(credentialEndpoint, {
        method: "POST",
        cache: "no-cache",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accessToken
        },
        body: JSON.stringify(credentialReq),
        mode: "cors"
      });
      if (response.ok) {
        var credentialBody = await response.json();
      } else {
        if (response.status == 403) {
          alert.apply("error 403");
          window.MHR.goHome();
          return "Error 403";
        }
        var error = await response.text();
        log.error(error);
        window.MHR.goHome();
        alert(error);
        return null;
      }
    } catch (error2) {
      log.error(error2);
      alert(error2);
      return null;
    }
    console.log(credentialBody);
    return credentialBody;
  }
  
  async function getAuthToken(tokenEndpoint, preAuthCode) {
    try {
      var formAttributes = {
        'grant_type': 'urn:ietf:params:oauth:grant-type:pre-authorized_code',
        'code': preAuthCode
      }
      var formBody = [];
      for (var property in formAttributes) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(formAttributes[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");
      console.log("The body: " + formBody)
  
      let response = await fetch(tokenEndpoint, {
        method: "POST",
        cache: "no-cache",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formBody,
        mode: "cors"
      });
      if (response.ok) {
        var tokenBody = await response.json();
      } else {
        if (response.status == 403) {
          alert.apply("error 403");
          window.MHR.goHome();
          return "Error 403";
        }
        var error = await response.text();
        log.error(error);
        window.MHR.goHome();
        alert(error);
        return null;
      }
    } catch (error2) {
      log.error(error2);
      alert(error2);
      return null;
    }
    console.log(tokenBody);
    return tokenBody;
  }
  
  async function getOpenIdConfig(issuerAddress) {
    try {
  
      console.log("Get: " + issuerAddress)
      let response = await fetch(issuerAddress + "/.well-known/openid-configuration", {
        cache: "no-cache",
        mode: "cors"
      });
      if (response.ok) {
        var openIdInfo = await response.json();
      } else {
        if (response.status == 403) {
          alert.apply("error 403");
          window.MHR.goHome();
          return "Error 403";
        }
        var error = await response.text();
        log.error(error);
        window.MHR.goHome();
        alert(error);
        return null;
      }
    } catch (error2) {
      log.error(error2);
      alert(error2);
      return null;
    }
    console.log(openIdInfo);
    return openIdInfo;
  }
  

async function getVerifiableCredentialLD(backEndpoint) {
    try {
        let response = await fetch(backEndpoint, {
            mode: "cors"
        });
        if (response.ok) {
            var vc = await response.text();
        } else {
            if (response.status == 403) {
                alert.apply("error 403");
                window.MHR.goHome();
                return "Error 403";
            }
            var error = await response.text();
            log.error(error);
            window.MHR.goHome();
            alert(error);
            return null;
        }
    } catch (error) {
        log.error(error);
        alert(error);
        return null;
    }
    console.log(vc);
    return vc;
}
