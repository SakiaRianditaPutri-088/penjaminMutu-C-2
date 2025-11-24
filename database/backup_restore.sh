#!/bin/bash

# =======================================================
#  Script: backup_restore.sh
#  Deskripsi: Otomatisasi Backup & Restore Database
#  Mendukung: MySQL & PostgreSQL
#  Dibuat untuk: si-tugas-dashboard project
# =======================================================

DATE=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_DIR="./database/backups"
MYSQL_DB="si_tugas_dashboard"
MYSQL_USER="root"
POSTGRES_DB="si_tugas_dashboard"
POSTGRES_USER="postgres"

mkdir -p "$BACKUP_DIR/mysql"
mkdir -p "$BACKUP_DIR/postgres"

usage() {
  echo "============================================"
  echo "Gunakan script ini untuk Backup / Restore DB"
  echo "--------------------------------------------"
  echo "Cara pakai:"
  echo "  bash backup_restore.sh mysql backup"
  echo "  bash backup_restore.sh mysql restore"
  echo "  bash backup_restore.sh postgres backup"
  echo "  bash backup_restore.sh postgres restore"
  echo "============================================"
  exit 1
}

backup_mysql() {
  FILE="$BACKUP_DIR/mysql/${MYSQL_DB}_${DATE}.sql"
  echo "🔹 Membuat backup MySQL ke $FILE"
  mysqldump -u $MYSQL_USER -p $MYSQL_DB > "$FILE"
  echo "✅ Backup MySQL selesai!"
}

restore_mysql() {
  echo "Masukkan path file backup (.sql): "
  read FILE
  if [ ! -f "$FILE" ]; then
    echo "❌ File tidak ditemukan!"
    exit 1
  fi
  echo "🔹 Mengembalikan database MySQL dari $FILE"
  mysql -u $MYSQL_USER -p $MYSQL_DB < "$FILE"
  echo "✅ Restore MySQL selesai!"
}

backup_postgres() {
  FILE="$BACKUP_DIR/postgres/${POSTGRES_DB}_${DATE}.sql"
  echo "🔹 Membuat backup PostgreSQL ke $FILE"
  pg_dump -U $POSTGRES_USER -d $POSTGRES_DB -f "$FILE"
  echo "✅ Backup PostgreSQL selesai!"
}

restore_postgres() {
  echo "Masukkan path file backup (.sql): "
  read FILE
  if [ ! -f "$FILE" ]; then
    echo "❌ File tidak ditemukan!"
    exit 1
  fi
  echo "🔹 Mengembalikan database PostgreSQL dari $FILE"
  psql -U $POSTGRES_USER -d $POSTGRES_DB -f "$FILE"
  echo "✅ Restore PostgreSQL selesai!"
}

if [ $# -ne 2 ]; then
  usage
fi

DB_TYPE=$1
ACTION=$2

case $DB_TYPE in
  mysql)
    case $ACTION in
      backup) backup_mysql ;;
      restore) restore_mysql ;;
      *) usage ;;
    esac
    ;;
  postgres)
    case $ACTION in
      backup) backup_postgres ;;
      restore) restore_postgres ;;
      *) usage ;;
    esac
    ;;
  *)
    usage
    ;;
esac
