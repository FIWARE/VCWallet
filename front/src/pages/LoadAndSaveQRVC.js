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
        if (!qrData.startsWith("https://") && !qrData.startsWith("http://")) {
            console.log("The scanned QR does not contain a valid URL")
            gotoPage("ErrorPage", {"title": "No data received", "msg": "The scanned QR does not contain a valid URL"})
            return
        }

        // We have received a URL that was scanned as a QR code.
        // First we should do a GET to the URL to retrieve the VC.
        this.VC = await getVerifiableCredentialLD(qrData)

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
        // Store it in local storage
        log.log(this.VC)
        window.localStorage.setItem("W3C_VC_LD", this.VC)

        // Reload the application with a clean URL
        gotoPage("DisplayVC", this.VC)
        return
    }

})


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
