#!/bin/bash
# Crea la base de los tests y le da permisos al mismo usuario de la app.
# Solo corre la primera vez que se crea el volumen.
set -e
mysql -uroot -p"$MYSQL_ROOT_PASSWORD" <<SQL
CREATE DATABASE IF NOT EXISTS \`${DB_TEST_NAME}\`;
GRANT ALL PRIVILEGES ON \`${DB_TEST_NAME}\`.* TO '${MYSQL_USER}'@'%';
FLUSH PRIVILEGES;
SQL
