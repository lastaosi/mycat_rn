import { getDatabase } from './database';

export type Medication = {
  id: number;
  catId: number;
  name: string;
  dosage: string | null;
  startDate: string;
  endDate: string | null;
  memo: string | null;
};

type MedicationRow = {
  id: number;
  catId: number;
  name: string;
  dosage: string | null;
  startDate: string;
  endDate: string | null;
  memo: string | null;
};

export async function getMedications(catId: number): Promise<Medication[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<MedicationRow>(
    'SELECT * FROM medication WHERE catId = ? ORDER BY startDate DESC',
    [catId]
  );
  return rows.map(toDomain);
}

export async function insertMedication(record: Omit<Medication, 'id'>): Promise<number> {
  const db = await getDatabase();
  const result = await db.runAsync(
    `INSERT INTO medication (catId, name, dosage, startDate, endDate, memo)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [record.catId, record.name, record.dosage, record.startDate, record.endDate, record.memo]
  );
  return result.lastInsertRowId;
}

export async function deleteMedication(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM medication WHERE id = ?', [id]);
}

function toDomain(row: MedicationRow): Medication {
  return {
    id: row.id,
    catId: row.catId,
    name: row.name,
    dosage: row.dosage,
    startDate: row.startDate,
    endDate: row.endDate,
    memo: row.memo,
  };
}