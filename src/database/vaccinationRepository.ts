import { getDatabase } from './database';

export type VaccinationRecord = {
  id: number;
  catId: number;
  vaccineName: string;
  vaccinatedAt: string;
  nextDueAt: string | null;
  memo: string | null;
};

type VaccinationRecordRow = {
  id: number;
  catId: number;
  vaccineName: string;
  vaccinatedAt: string;
  nextDueAt: string | null;
  memo: string | null;
};

export async function getVaccinations(catId: number): Promise<VaccinationRecord[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<VaccinationRecordRow>(
    'SELECT * FROM vaccination_record WHERE catId = ? ORDER BY vaccinatedAt DESC',
    [catId]
  );
  return rows.map(toDomain);
}

export async function insertVaccination(record: Omit<VaccinationRecord, 'id'>): Promise<number> {
  const db = await getDatabase();
  const result = await db.runAsync(
    `INSERT INTO vaccination_record (catId, vaccineName, vaccinatedAt, nextDueAt, memo)
     VALUES (?, ?, ?, ?, ?)`,
    [record.catId, record.vaccineName, record.vaccinatedAt, record.nextDueAt, record.memo]
  );
  return result.lastInsertRowId;
}

export async function deleteVaccination(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM vaccination_record WHERE id = ?', [id]);
}

function toDomain(row: VaccinationRecordRow): VaccinationRecord {
  return {
    id: row.id,
    catId: row.catId,
    vaccineName: row.vaccineName,
    vaccinatedAt: row.vaccinatedAt,
    nextDueAt: row.nextDueAt,
    memo: row.memo,
  };
}