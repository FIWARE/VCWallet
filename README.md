# VCWallet

A minimum wallet as a PWA for Verifiable Credentials following the DSBA Technical Convergence Discussions document.

## Install and development

Clone the repository in your local machine:

```
git clone git@github.com:hesusruiz/VCWallet.git
```

Install the required Node.js packages for the browser:

```
cd front
npm install
```

Build the front-end files

```
go run . build
```

Run the development server to serve the wallet files for testing and development:

```
go run . serve
```

The development server will automatically build the wallet every time that the browser is refreshed.