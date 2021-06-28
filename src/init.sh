#!/bin/zsh
source ~/.zshrc

deno --version

source src/build.sh

export PATH="/home/user/.deno/bin:$PATH"

deno install --force --allow-net --allow-read \
  https://deno.land/std@0.99.0/http/file_server.ts

file_server -p 8080 ./public/
