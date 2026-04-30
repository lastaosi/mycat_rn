import { useState, useEffect, useCallback } from 'react';
import { Cat, getAllCats, getRepresentativeCat } from '../database/catRepository';

export function useCatList() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [representativeCat, setRepresentativeCat] = useState<Cat | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);  // ← 추가

  const loadCats = useCallback(async () => {
    setIsLoading(true);
    setError(null);  // ← 추가
    try {
      const [allCats, repCat] = await Promise.allSettled([
        getAllCats(),
        getRepresentativeCat(),
      ]);
      if (allCats.status === 'fulfilled') setCats(allCats.value);
      if (repCat.status === 'fulfilled') setRepresentativeCat(repCat.value);
    } catch (e) {
      console.error('고양이 로드 에러:', e);
      setError('데이터를 불러올 수 없어요');  // ← 추가
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCats();
  }, [loadCats]);

  return { cats, representativeCat, isLoading, error, loadCats };  // ← error 추가
}