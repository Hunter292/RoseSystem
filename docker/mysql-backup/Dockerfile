FROM alpine:3.20

RUN apk add --no-cache \
    mysql-client \
    bash \
    tzdata \
    dcron

COPY backup.sh /usr/local/bin/backup.sh
COPY entrypoint.sh /entrypoint.sh

# Convert Windows CRLF line endings to Unix LF and make scripts executable.
RUN sed -i 's/\r$//' /usr/local/bin/backup.sh /entrypoint.sh \
    && chmod +x /usr/local/bin/backup.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

