import { getDatabase } from './database';

export type Diary = {
  id: number;
  catId: number;
  content: string;
  photoPath: string | null;
  createdAt: number;
};

type DiaryRow = {
  id: number;
  catId: number;
  content: string;
  photoPath: string | null;
  createdAt: number;
};


export async function getDiaries(catId: number): Promise<Diary[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<DiaryRow>(
    'SELECT * FROM cat_diary WHERE catId = ? ORDER BY createdAt DESC',
    [catId]
  );
  return rows.map(toDomain);
}

export async function insertDiary(record: Omit<Diary, 'id'>): Promise<number> {
  const db = await getDatabase();
  const result = await db.runAsync(
    `INSERT INTO cat_diary (catId, content, photoPath, createdAt)
     VALUES (?, ?, ?, ?)`,
    [record.catId, record.content, record.photoPath, record.createdAt]
  );
  return result.lastInsertRowId;
}

export async function deleteDiary(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM cat_diary WHERE id = ?', [id]);
}

function toDomain(row: DiaryRow): Diary {
  return {
    id: row.id,
    catId: row.catId,
    content: row.content,
    photoPath: row.photoPath,
    createdAt: row.createdAt,
  };
}