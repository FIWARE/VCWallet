import {
  log
} from "../chunks/chunk-FVTRWWP3.js";
import "../chunks/chunk-KRYK5JSZ.js";

// front/src/pages/DisplayVC.js
var gotoPage = window.MHR.gotoPage;
var goHome = window.MHR.goHome;
window.MHR.register("DisplayVC", class DisplayVC extends window.MHR.AbstractPage {
  constructor(id) {
    super(id);
  }
  async enter(qrData) {
    let html = this.html;
    console.log("The data " + JSON.stringify(qrData));
    if (qrData == null) {
      log.error("The scanned QR does not contain a valid URL");
      gotoPage("ErrorPage", { "title": "No data received", "msg": "The scanned QR does not contain a valid URL" });
      return;
    }
    let theHtml = html`
        <div class="w3-container">
            <p>You have this Verifiable Credential:</p>

<pre><code class="language-json">
${qrData}
</code></pre>

        </div>

        <div class="w3-container w3-padding-16">       
            <btn-primary @click=${() => goHome()}>${T("Home")}</btn-primary>
        </div>
        `;
    this.render(theHtml);
    Prism.highlightAll();
  }
});
