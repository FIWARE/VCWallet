# VCWallet

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

## Configuration of the build and bundling process

The build process can be configured with the `devserver.yaml` configuration file in the root of the repository. An example configuration file is the following:

```yaml
# The directory with the source files for the PWA, relative to current directory
sourcedir: front/src

# The distribution files after building the app, relative to current directory
targetdir: docs

# If cleantarget is true, erase the 'targetdir' before building
cleantarget: true

# The individual HTML files composing the application
# Name is relative to the 'sourcedir'
htmlfiles:
  - index.html

# The JavaScript files which are the entrypoints (normally included in the HTML files)
# Name is relative to the 'sourcedir'
entryPoints:
  - app.js

# The directory whith the source javascipt for the app pages
# Name relative to 'sourcedir'
pagedir: /pages

# Directory with files that will be copied to target without any processing
# ATTENTION: name is relative to the root of the project, not to 'sourcedir'
# This means that static assets can be located anywhere in the project directory
staticAssets:
  source: front/src/public
  target: docs

# Set to true if you want entrypoint names to include a hash
# This includes the pages names
hashEntrypointNames: true

subdomainprefix: /faster

# Configuration specific to the development server process
# In addition to serving local content, the server can forward some requests from the frontend to other
# servers, helping development in complex projects
devserver:
  listenAddress: ":3500"
  autobuild: true
  # Information to proxy some requests to other server
  # proxy:
  #   - route: /webauthn/*
  #     target: http://localhost:3000
```

