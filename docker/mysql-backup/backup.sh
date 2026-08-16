#!/bin/bash
set -euo pipefail

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
OUT_FILE="/backups/${MYSQL_DATABASE}_${TIMESTAMP}.sql.gz"

echo "[backup] $(date -Iseconds) starting dump of ${MYSQL_DATABASE}@${DB_HOST}"

mysqldump \
    --host="${DB_HOST}" \
    --user="${MYSQL_USER}" \
    --password="${MYSQL_PASSWORD}" \
    --single-transaction \
    --routines \
    --triggers \
    --events \
    "${MYSQL_DATABASE}" \
    | gzip > "${OUT_FILE}"

echo "[backup] wrote ${OUT_FILE} ($(du -h "${OUT_FILE}" | cut -f1))"

# Retention: delete backups older than N days.
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-14}"
find /backups -name "*.sql.gz" -mtime +"${RETENTION_DAYS}" -print -delete

echo "[backup] $(date -Iseconds) done"
