# Docker deployment



## First run

```bash
cp .env.example .env            
docker compose build
docker compose up -d
```

Frontend: http://localhost (or `FRONTEND_PORT`)
Adminer (DB GUI): http://localhost:8080 — server `db`, user/password from `.env`


## Database backups

A dedicated `db-backup` service runs `mysqldump` on a cron schedule
(`BACKUP_CRON_SCHEDULE` in `.env`, default daily at 02:00) and writes
gzip-compressed dumps to `./backups` on the host, with automatic cleanup
of files older than `BACKUP_RETENTION_DAYS`.

**Manual backup, any time:**
```bash
docker compose exec db-backup /usr/local/bin/backup.sh
```

**Restore a backup:**
```bash
gunzip < backups/filename.sql.gz | \
  docker compose exec -T db mysql -u root -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE"
```

**Ad-hoc access / GUI:**
- Adminer at http://localhost:8080 for browsing data or exporting via the UI.
- Direct CLI: `docker compose exec db mysql -u root -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE"`

