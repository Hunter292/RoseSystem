FROM mysql:8.4

RUN apt-get update \
    && apt-get install -y --no-install-recommends cron bash tzdata \
    && rm -rf /var/lib/apt/lists/*

COPY backup.sh /usr/local/bin/backup.sh
RUN chmod +x /usr/local/bin/backup.sh

# Cron schedule is generated at startup from BACKUP_CRON_SCHEDULE (see
# entrypoint), so it stays configurable via the compose environment variable.
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

VOLUME ["/backups"]
ENTRYPOINT ["/entrypoint.sh"]

