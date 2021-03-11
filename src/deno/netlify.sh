#!/bin/bash

HOME_BIN=$(pwd)/bin/x86_64-unknown-linux-gnu
mkdir -p $HOME_BIN

curl -fsSL https://deno.land/x/install/install.sh | sh

curl -fsSL https://github.com/sass/dart-sass/releases/download/1.32.8/dart-sass-1.32.8-linux-x64.tar.gz \
  | tar -zx --strip-components 1 dart-sass/sass

mv -f /opt/buildhome/.deno/bin/deno $HOME_BIN
mv -f sass $HOME_BIN

export PATH="$HOME_BIN:$PATH"

ls -la $HOME_BIN

deno --version
sass --version

deno run --allow-all --no-check --unstable \
  --import-map src/deno/imports.json \
  src/deno/mod.js

exit 0
