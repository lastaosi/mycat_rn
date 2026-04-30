import { useState } from 'react';
import { Cat, insertCat } from '../database/catRepository';

export function useRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function saveCat(cat: Omit<Cat, 'id'>): Promise<boolean> {
    setIsLoading(true);
    setError(null);
    try {
      await insertCat(cat);
      return true;
    } catch (e) {
      console.error('고양이 등록 에러:', e);
      setError('저장 중 오류가 발생했습니다');
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  return { isLoading, error, saveCat };
}