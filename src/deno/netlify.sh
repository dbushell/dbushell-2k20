#!/bin/bash

curl -fsSL https://deno.land/x/install/install.sh | sh

# curl -fsSL https://github.com/sass/dart-sass/releases/download/1.32.8/dart-sass-1.32.8-linux-x64.tar.gz \
#   | tar -zx --strip-components 1 dart-sass/sass

echo $(pwd)

ls -la ./

/opt/buildhome/.deno/bin/deno info
