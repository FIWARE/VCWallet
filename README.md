# VCWallet

> :warning: This wallet is intended to be used as a minimal demo application. It does only store one credential and does not encryption or verfication of issuers or relying parties. Do NOT use this in production.

A minimum wallet as a PWA for Verifiable Credentials following the DSBA Technical Convergence Discussions document. 


## Install and development

Clone the repository in your local machine:

```
git clone git@github.com:hesusruiz/VCWallet.git
```

Install the required Node.js packages for the browser. You have to change to the `front` directory and then run `npm install`.

```
cd front
npm install
```

Build the front-end files. This has to be done from the root of the repository (instead of from the `front` directory as in the previous step):

```
go run . build
```

The above command will create or update the directory `docs` with the files for deployment. Before deploying to production, you can test the application by using the included development server.

You can run the development server to serve the wallet files for testing and development. From the root of the repository run:

```
go run . serve
```

The development server will automatically build the wallet every time that the browser is refreshed.

## Deployment to production

To deploy the wallet to production, you just need a static file server or CDN (like Netlify). Just deploy the files inside the `docs` directory.

For demonstrational purposes, a docker image is provided and can be used.
