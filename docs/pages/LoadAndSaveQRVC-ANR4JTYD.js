import {
  log
} from "../chunks/chunk-FVTRWWP3.js";
import "../chunks/chunk-KRYK5JSZ.js";

// front/src/pages/LoadAndSaveQRVC.js
var gotoPage = window.MHR.gotoPage;
var goHome = window.MHR.goHome;
window.MHR.register("LoadAndSaveQRVC", class LoadAndSaveQRVC extends window.MHR.AbstractPage {
  constructor(id) {
    super(id);
  }
  async enter(qrData) {
    let html = this.html;
    if (qrData == null || !qrData.startsWith) {
      console.log("The scanned QR does not contain a valid URL");
      gotoPage("ErrorPage", { "title": "No data received", "msg": "The scanned QR does not contain a valid URL" });
      return;
    }
    if (!qrData.startsWith("https://") && !qrData.startsWith("http://")) {
      console.log("The scanned QR does not contain a valid URL");
      gotoPage("ErrorPage", { "title": "No data received", "msg": "The scanned QR does not contain a valid URL" });
      return;
    }
    this.VC = await getVerifiableCredentialLD(qrData);
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
        `;
    this.render(theHtml);
  }
  saveVC() {
    log.log(this.VC);
    window.localStorage.setItem("W3C_VC_LD", this.VC);
    gotoPage("DisplayVC", this.VC);
    return;
  }
});
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
  } catch (error2) {
    log.error(error2);
    alert(error2);
    return null;
  }
  console.log(vc);
  return vc;
}
