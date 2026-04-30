import { getDatabase } from './database';

export type Cat = {
  id: number;
  name: string;
  birthDate: string;
  gender: string;
  breedId: number | null;
  breedNameCustom: string | null;
  photoPath: string | null;
  isNeutered: boolean;
  isRepresentative: boolean;
  memo: string | null;
  createdAt: number;
};

// DB row 타입 추가
type CatRow = {
  id: number;
  name: string;
  birthDate: string;
  gender: string;
  breedId: number | null;
  breedNameCustom: string | null;
  photoPath: string | null;
  isNeutered: number;        // DB에선 0/1
  isRepresentative: number;  // DB에선 0/1
  memo: string | null;
  createdAt: number;
};

export async function getAllCats(): Promise<Cat[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<CatRow>('SELECT * FROM cat ORDER BY createdAt DESC');
  return rows.map(toDomain);
}

export async function getCatById(id: number): Promise<Cat | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<CatRow>('SELECT * FROM cat WHERE id = ?', [id]);
  return row ? toDomain(row) : null;
}

export async function getRepresentativeCat(): Promise<Cat | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<CatRow>('SELECT * FROM cat WHERE isRepresentative = 1');
  return row ? toDomain(row) : null;
}

export async function getCatCount(): Promise<number> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM cat');
  return row?.count ?? 0;
}

export async function insertCat(cat: Omit<Cat, 'id'>): Promise<number> {
  const db = await getDatabase();
  const result = await db.runAsync(
    `INSERT INTO cat (name, birthDate, gender, breedId, breedNameCustom, photoPath, isNeutered, isRepresentative, memo, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      cat.name,
      cat.birthDate,
      cat.gender,
      cat.breedId,
      cat.breedNameCustom,
      cat.photoPath,
      cat.isNeutered ? 1 : 0,
      cat.isRepresentative ? 1 : 0,
      cat.memo,
      cat.createdAt,
    ]
  );
  return result.lastInsertRowId;
}

export async function setRepresentative(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('UPDATE cat SET isRepresentative = CASE WHEN id = ? THEN 1 ELSE 0 END', [id]);
}

export async function deleteCat(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM cat WHERE id = ?', [id]);
}

function toDomain(row: CatRow): Cat {  // ← any → CatRow
  return {
    id: row.id,
    name: row.name,
    birthDate: row.birthDate,
    gender: row.gender,
    breedId: row.breedId,
    breedNameCustom: row.breedNameCustom,
    photoPath: row.photoPath,
    isNeutered: row.isNeutered === 1,
    isRepresentative: row.isRepresentative === 1,
    memo: row.memo,
    createdAt: row.createdAt,
  };
}