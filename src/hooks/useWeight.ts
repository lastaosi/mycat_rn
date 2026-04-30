import { useState, useEffect, useCallback } from 'react';
import { WeightRecord, getWeightHistory, insertWeight, deleteWeight } from '../database/weightRepository';

export function useWeight(catId: number) {
  const [records, setRecords] = useState<WeightRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);  // ← 추가

  const loadRecords = useCallback(async () => {
    setIsLoading(true);
    setError(null);  // ← 추가
    try {
      const data = await getWeightHistory(catId);
      setRecords(data);
    } catch (e) {
      console.error('체중 로드 에러:', e);
      setError('데이터를 불러올 수 없어요');  // ← 추가
    } finally {
      setIsLoading(false);
    }
  }, [catId]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  async function addWeight(weightG: number, memo: string | null) {
    try {
      await insertWeight({ catId, weightG, recordedAt: Date.now(), memo });
      await loadRecords();
    } catch (e) {
      console.error('체중 추가 에러:', e);
      throw e;
    }
  }

  async function removeWeight(id: number) {
    try {
      await deleteWeight(id);
      await loadRecords();
    } catch (e) {
      console.error('체중 삭제 에러:', e);
      throw e;
    }
  }

  return { records, isLoading, error, addWeight, removeWeight, loadRecords };  // ← error 추가
}