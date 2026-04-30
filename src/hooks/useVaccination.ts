import { useState, useEffect, useCallback } from 'react';
import {
  VaccinationRecord,
  getVaccinations,
  insertVaccination,
  deleteVaccination
} from '../database/vaccinationRepository';

export function useVaccination(catId: number) {
  const [records, setRecords] = useState<VaccinationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRecords = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getVaccinations(catId);
      setRecords(data);
    } catch (e) {
      console.error('예방접종 로드 에러:', e);
      setError('데이터를 불러올수 없습니다.')
    } finally {
      setIsLoading(false);
    }
  }, [catId]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  async function addVaccination(
    vaccineName: string,
    vaccinatedAt: string,
    nextDueAt: string | null,
    memo: string | null
  ) {
    try {
      await insertVaccination({ catId, vaccineName, vaccinatedAt, nextDueAt, memo });
      await loadRecords();
    } catch (e) {
      console.error('예방접종 추가 에러:', e);
      throw e;
    }
  }

  async function removeVaccination(id: number) {
    try {
      await deleteVaccination(id);
      await loadRecords();
    } catch (e) {
      console.error('예방접종 삭제 에러:', e);
      throw e;
    }
  }

  return { records, isLoading,error, addVaccination, removeVaccination };
}