import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'mycat.db';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  
  db = await SQLite.openDatabaseAsync(DATABASE_NAME);
  await initDatabase(db);
  return db;
}

async function initDatabase(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS cat (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      birthDate TEXT NOT NULL,
      gender TEXT NOT NULL,
      breedId INTEGER,
      breedNameCustom TEXT,
      photoPath TEXT,
      isNeutered INTEGER NOT NULL DEFAULT 0,
      isRepresentative INTEGER NOT NULL DEFAULT 0,
      memo TEXT,
      createdAt INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS weight_record (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      catId INTEGER NOT NULL,
      weightG INTEGER NOT NULL,
      recordedAt INTEGER NOT NULL,
      memo TEXT,
      FOREIGN KEY (catId) REFERENCES cat(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS vaccination_record (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      catId INTEGER NOT NULL,
      vaccineName TEXT NOT NULL,
      vaccinatedAt TEXT NOT NULL,
      nextDueAt TEXT,
      memo TEXT,
      FOREIGN KEY (catId) REFERENCES cat(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS medication (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      catId INTEGER NOT NULL,
      name TEXT NOT NULL,
      dosage TEXT,
      startDate TEXT NOT NULL,
      endDate TEXT,
      memo TEXT,
      FOREIGN KEY (catId) REFERENCES cat(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS cat_diary (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      catId INTEGER NOT NULL,
      content TEXT NOT NULL,
      photoPath TEXT,
      createdAt INTEGER NOT NULL,
      FOREIGN KEY (catId) REFERENCES cat(id) ON DELETE CASCADE
    );
  `);
}