import { useState, useEffect, useCallback } from 'react';
import { Diary, getDiaries, insertDiary, deleteDiary } from '../database/diaryRepository';

export function useDiary(catId: number) {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  const loadDiaries = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getDiaries(catId);
      setDiaries(data);
    } catch (e) {
      setError('다이어리 로드 에러');
      console.error('다이어리 로드 에러:', e);
    } finally {
      setIsLoading(false);
    }
  }, [catId]);

  useEffect(() => {
    loadDiaries();
  }, [loadDiaries]);

  async function addDiary(content: string, photoPath: string | null) {
    try {
      await insertDiary({
        catId,
        content,
        photoPath,
        createdAt: Date.now(),
      });
      await loadDiaries();
    } catch (e) {
      console.error('다이어리 추가 에러:', e);
      throw e;
    }
  }

  async function removeDiary(id: number) {
    try {
      await deleteDiary(id);
      await loadDiaries();
    } catch (e) {
      console.error('다이어리 삭제 에러:', e);
      throw e;
    }
  }

  return { diaries, isLoading,error, addDiary, removeDiary };
}