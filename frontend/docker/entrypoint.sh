#!/bin/sh
# Runs automatically because nginx:alpine executes every script in
# /docker-entrypoint.d/ before starting nginx.
#
# Writes the current API_URL env var into a static JSON file the Angular
# app can fetch at startup (see "Frontend adaptation" notes). This lets
# the *same built image* be deployed to staging/production with a
# different backend URL, just by changing an env var at `docker run` /
# compose time — no rebuild needed.
set -e

cat <<EOF > /usr/share/nginx/html/assets/config.json
{
  "apiUrl": "${API_URL}"
}
EOF
