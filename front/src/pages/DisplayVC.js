import { log } from '../log'

let gotoPage = window.MHR.gotoPage
let goHome = window.MHR.goHome

window.MHR.register("DisplayVC", class DisplayVC extends window.MHR.AbstractPage {

    constructor(id) {
        super(id)
    }

    async enter(qrData) {
        let html = this.html
        log.log("get " + qrData)

        let theData = window.localStorage.getItem(qrData)

        console.log("The data " + JSON.stringify(theData))    
        // We should have received a URL that was scanned as a QR code.
        // Perform some sanity checks on the parameter
        if (theData == null) {
            log.error("The scanned QR does not contain a valid URL")
            gotoPage("ErrorPage", {"title": "No data received", "msg": "The scanned QR does not contain a valid URL"})
            return
        }

        
        const theHtml = html`
        <div id="theVC" class="w3-container">
        <p>You have this Verifiable Credential: </p>
        
<pre ><code class="language-json">
${theData}
</code></pre>
        
        </div>
        
        <div class="w3-container w3-padding-16">       
        <btn-primary @click=${() => goHome()}>${T("Home")}</btn-primary>
        </div>
        `
        
        this.render(theHtml)
        
    
        const theElement = document.getElementById("theVC")
        theElement.innerHTML = `
        <div id="theVC" class="w3-container">
        <p>You have this Verifiable Credential: </p>
        
<pre ><code class="language-json">
${theData}
</code></pre>
        
        </div>
        `
        // Re-run the highlighter for the VC display
        Prism.highlightAll()
    }

})
