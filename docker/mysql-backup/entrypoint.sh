#!/bin/sh
set -eu

SCHEDULE="${BACKUP_CRON_SCHEDULE:-0 2 * * *}"

# Write env vars into a file cron jobs can source, since cron itself runs
# with a minimal environment.
printenv | grep -E '^(DB_HOST|MYSQL_DATABASE|MYSQL_USER|MYSQL_PASSWORD|BACKUP_RETENTION_DAYS)=' > /etc/environment

echo "${SCHEDULE} root . /etc/environment; /usr/local/bin/backup.sh >> /var/log/backup.log 2>&1" > /etc/cron.d/db-backup
chmod 0644 /etc/cron.d/db-backup
touch /var/log/backup.log
echo "[entrypoint] scheduled backups: ${SCHEDULE}"

crond -f -l 2 &
CROND_PID=$!

tail -f /var/log/backup.log &

wait "${CROND_PID}"
