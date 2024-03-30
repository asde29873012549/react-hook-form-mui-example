import { useState, useCallback, useEffect, useMemo } from 'react';

async function fetchFn(url, method = "GET", body, signal) {
  const config = {
    method,
    headers: { 'Content-Type': 'application/json' },
    signal,
  };
  if (body) config.body = JSON.stringify(body);

  const response = await fetch(url, config);
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
}

function useFetch(callbacks = { onMutate: null, onSuccess: null, onError: null, autoFetch: false }) {
  const { onMutate, onSuccess, onError, autoFetch } = callbacks;
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Abortion controller for fetch cancellation
  const controller = useMemo(() => new AbortController(), []);


  const fetchData = useCallback(async (params, ctx = null) => {
    const { url, method = "GET", body } = params;
	const mutateResult = onMutate && onMutate(body, ctx);
    const { mutatedBody, extraCtx } = mutateResult || { mutatedBody: body, extraCtx: {} };

    try {
      setIsLoading(true);
      setError(null); // Reset error state before a new request
      const result = await fetchFn(url, method, mutatedBody, controller.signal);
      setData(result);
      if (onSuccess) {
        onSuccess(result, mutatedBody, { ...ctx, ...extraCtx });
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        setError(error);
        if (onError) {
          onError(error, mutatedBody, { ...ctx, ...extraCtx });
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [onMutate, onSuccess, onError, controller.signal]);

  useEffect(() => {
	autoFetch && fetchData();
  }, [autoFetch, fetchData]);

  useEffect(() => {
	return () => controller.abort();
  }, [controller]);


  return { data, error, isLoading, fetchData };
}

export default useFetch;
