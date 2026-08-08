import { useEffect, useState, useCallback } from 'react';

/**
 * Drives any list screen backed by the API's { data, meta } pagination shape —
 * used by every public list page and every admin list table.
 */
export function usePaginatedFetch(listFn, params = {}, deps = []) {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, meta: resultMeta } = await listFn(params);
      setItems(data);
      setMeta(resultMeta);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
    // deps is an intentional caller-supplied dependency array, not derived from closure state
  }, deps);

  useEffect(() => {
    load();
  }, [load]);

  return { items, meta, loading, error, reload: load };
}
