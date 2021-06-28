#!/bin/bash

HOME_BIN=$(pwd)/bin/x86_64-unknown-linux-gnu
mkdir -p $HOME_BIN

curl -fsSL https://deno.land/x/install/install.sh | sh

curl -fsSL https://github.com/sass/dart-sass/releases/download/1.35.1/dart-sass-1.35.1-linux-x64.tar.gz \
  | tar -zx --strip-components 1 dart-sass/sass

mv -f /opt/buildhome/.deno/bin/deno $HOME_BIN
mv -f sass $HOME_BIN

export PATH="$HOME_BIN:$PATH"

ls -la $HOME_BIN

deno --version
sass --version

source src/build.sh

exit 0
