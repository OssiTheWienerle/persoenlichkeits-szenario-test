#!/usr/bin/env bash
set -e
cd -- "$(dirname -- "$0")"
if [ ! -d node_modules ]; then
  printf '%s\n' 'Bitte zuerst im App-Ordner npm ci ausführen.'
  exit 1
fi
printf '%s\n' 'Kontext startet unter http://127.0.0.1:4317/'
exec npm run dev -- --host 127.0.0.1 --port 4317
