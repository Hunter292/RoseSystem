FROM php:8.3-fpm-alpine

# System deps + PHP extensions typically needed by a MySQL-backed PHP app.
# Add/remove extensions to match what your app actually uses.
RUN apk add --no-cache \
        icu-dev \
        libzip-dev \
        oniguruma-dev \
        git \
        unzip \
    && docker-php-ext-configure intl \
    && docker-php-ext-install -j"$(nproc)" \
        pdo \
        pdo_mysql \
        mysqli \
        intl \
        zip \
        opcache \
        mbstring

# opcache tuned for production
RUN { \
        echo 'opcache.memory_consumption=192'; \
        echo 'opcache.interned_strings_buffer=16'; \
        echo 'opcache.max_accelerated_files=20000'; \
        echo 'opcache.validate_timestamps=0'; \
        echo 'opcache.enable_cli=0'; \
    } > /usr/local/etc/php/conf.d/opcache-prod.ini

# IMPORTANT: php-fpm clears the process environment by default, so
# variables passed via `environment:`/`env_file:` in docker-compose would
# otherwise NOT be visible to PHP. This pool override disables that so
# getenv()/$_ENV/$_SERVER see them (needed if you keep using vlucas/phpdotenv
# with $_ENV, or if you migrate reads to getenv()).
#COPY docker/www-clearenv.conf /usr/local/etc/php-fpm.d/zz-clearenv.conf

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Install dependencies first, leveraging Docker layer caching.
COPY composer.json composer.lock ./
RUN composer install \
        --no-dev \
        --no-scripts \
        --no-interaction \
        --optimize-autoloader \
        --prefer-dist

# Now copy the rest of the application code.
COPY . .

# Run any composer scripts that need the full source (e.g. autoload dump).
RUN composer dump-autoload --optimize --no-dev \
    && mkdir -p storage \
    && chown -R www-data:www-data /var/www/html

USER www-data

EXPOSE 9000
CMD ["php-fpm"]
