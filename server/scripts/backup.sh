#!/bin/bash
# Database automated backup script for A B Taxway Consultancy
# Run via cron daily: 0 2 * * * /path/to/server/scripts/backup.sh

BACKUP_DIR="/var/backups/ab_consultancy"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
FILENAME="ab_db_backup_${TIMESTAMP}.sql.gz"

mkdir -p ${BACKUP_DIR}

# Source env
if [ -f .env ]; then
  export $(cat .env | grep -v '#' | awk '/=/ {print $1}')
fi

echo "[$(date)] Starting MySQL backup for ${DB_NAME}..."
mysqldump -h ${DB_HOST:-localhost} -P ${DB_PORT:-3306} -u ${DB_USER:-root} -p${DB_PASSWORD} ${DB_NAME:-ab_consultancy_db} | gzip > ${BACKUP_DIR}/${FILENAME}

# Remove backups older than 30 days
find ${BACKUP_DIR} -name "ab_db_backup_*.sql.gz" -type f -mtime +30 -delete

echo "[$(date)] Backup completed: ${BACKUP_DIR}/${FILENAME}"
