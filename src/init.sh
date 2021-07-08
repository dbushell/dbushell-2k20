#!/bin/zsh
source ~/.zshrc

deno --version

source src/build.sh

deno install --force --allow-net --allow-read \
  https://deno.land/std@0.100.0/http/file_server.ts

file_server -p 8080 ./public/
