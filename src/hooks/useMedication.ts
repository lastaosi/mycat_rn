import { useState, useEffect, useCallback } from 'react';
import {
  Medication,
  getMedications,
  insertMedication,
  deleteMedication
} from '../database/medicationRepository';

export function useMedication(catId: number) {
  const [records, setRecords] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  const loadRecords = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getMedications(catId);
      setRecords(data);
    } catch (e) {
      console.error('투약 로드 에러:', e);
      setError('데이터를 불러올수 없습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [catId]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  async function addMedication(
    name: string,
    dosage: string | null,
    startDate: string,
    endDate: string | null,
    memo: string | null
  ) {
    try {
      await insertMedication({ catId, name, dosage, startDate, endDate, memo });
      await loadRecords();
    } catch (e) {
      console.error('투약 추가 에러:', e);
      throw e;
    }
  }

  async function removeMedication(id: number) {
    try {
      await deleteMedication(id);
      await loadRecords();
    } catch (e) {
      console.error('투약 삭제 에러:', e);
      throw e;
    }
  }

  // 진행 중인 투약 — endDate가 없거나 오늘 이후
  const activeMedications = records.filter(r => {
    if (!r.endDate) return true;
    return new Date(r.endDate) >= new Date();
  });

  // 완료된 투약
  const completedMedications = records.filter(r => {
    if (!r.endDate) return false;
    return new Date(r.endDate) < new Date();
  });

  return {
    records,
    activeMedications,
    completedMedications,
    isLoading,
    error,
    addMedication,
    removeMedication
  };
}