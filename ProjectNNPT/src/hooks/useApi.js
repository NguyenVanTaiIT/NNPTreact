import { useState, useCallback } from 'react';

const useApi = (apiFunction) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...params) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction(...params);
      setData(result);
      return result;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  return {
    data,
    loading,
    error,
    execute,
  };
};

export default useApi; 