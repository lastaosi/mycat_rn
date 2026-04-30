import { getDatabase } from './database';

export type WeightRecord = {
  id: number;
  catId: number;
  weightG: number;
  recordedAt: number;
  memo: string | null;
};
// WeightRecordRow 타입 추가
type WeightRecordRow = {
  id: number;
  catId: number;
  weightG: number;
  recordedAt: number;
  memo: string | null;
};

export async function getWeightHistory(catId: number): Promise<WeightRecord[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<WeightRecordRow>(
    'SELECT * FROM weight_record WHERE catId = ? ORDER BY recordedAt ASC',
    [catId]
  );
  return rows.map(toDomain);
}

export async function getLatestWeight(catId: number): Promise<WeightRecord | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<WeightRecordRow>(
    'SELECT * FROM weight_record WHERE catId = ? ORDER BY recordedAt DESC LIMIT 1',
    [catId]
  );
  return row ? toDomain(row) : null;
}

export async function insertWeight(record: Omit<WeightRecord, 'id'>): Promise<number> {
  const db = await getDatabase();
  const result = await db.runAsync(
    'INSERT INTO weight_record (catId, weightG, recordedAt, memo) VALUES (?, ?, ?, ?)',
    [record.catId, record.weightG, record.recordedAt, record.memo]
  );
  return result.lastInsertRowId;
}

export async function deleteWeight(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM weight_record WHERE id = ?', [id]);
}

function toDomain(row: WeightRecordRow): WeightRecord {
  return {
    id: row.id,
    catId: row.catId,
    weightG: row.weightG,
    recordedAt: row.recordedAt,
    memo: row.memo,
  };
}