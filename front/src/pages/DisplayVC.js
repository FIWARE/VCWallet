import { log } from '../log'

let gotoPage = window.MHR.gotoPage
let goHome = window.MHR.goHome

window.MHR.register("DisplayVC", class DisplayVC extends window.MHR.AbstractPage {

    constructor(id) {
        super(id)
    }

    async enter(qrData) {
        let html = this.html
        console.log("The data " + JSON.stringify(qrData))    
        // We should have received a URL that was scanned as a QR code.
        // Perform some sanity checks on the parameter
        if (qrData == null) {
            log.error("The scanned QR does not contain a valid URL")
            gotoPage("ErrorPage", {"title": "No data received", "msg": "The scanned QR does not contain a valid URL"})
            return
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
        `

        this.render(theHtml)

        // Re-run the highlighter for the VC display
        Prism.highlightAll();
    }

})
