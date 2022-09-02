# Shared Code

Code that is used by **both** the client and server goes here.

For annoying reasons they must be named with the `.mjs` extension.

Note that neither the client nor the server code is able to import any files from within each other. So this folder cannot reside in the client or the server. It must stand alone. This is some limitation of Node's ability to import modules. Otherwise I would place this folder in either the client or the server for simplicity and to facilitate auto-reloading on file changes during development.
