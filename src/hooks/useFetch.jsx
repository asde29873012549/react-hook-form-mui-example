import { useState, useCallback, useEffect, useMemo, useRef } from 'react';

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

function useFetch(callbacks = { onMutate: null, onSuccess: null, onError: null, autoFetch: false, fetchUrl: null }) {
  const { onMutate, onSuccess, onError, autoFetch, fetchUrl } = callbacks;
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Abortion controller for fetch cancellation
  const controller = useMemo(() => new AbortController(), []);

  const onMutateRef = useRef(onMutate);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);


  const fetchData = useCallback(async (params = {}, ctx = null) => {
    const { url, method = "GET", body } = params;

    try {
      const mutateResult = onMutateRef.current && onMutateRef.current(body, ctx);
      const { mutatedBody, extraCtx } = mutateResult || { mutatedBody: body, extraCtx: {} };
	
      setIsLoading(true);
      setError(null); // Reset error state before a new request
      const result = await fetchFn(url, method, mutatedBody);
      setData(result);

      onSuccessRef.current && onSuccessRef.current(result, mutatedBody, { ...ctx, ...extraCtx });
    } catch (error) {
      if (error.name !== 'AbortError') {
        setError(error);
        onErrorRef.current && onErrorRef.current(error);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    onMutateRef.current = onMutate;
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
  }, [onMutate, onSuccess, onError]);

  useEffect(() => {
	autoFetch && fetchData({ url: fetchUrl });
  }, [autoFetch, fetchData, fetchUrl]);

  useEffect(() => {
	return () => controller.abort();
  }, [controller]);

  return { data, error, isLoading, fetchData };
}

export default useFetch;
