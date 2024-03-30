import { useState, useCallback, useEffect } from 'react';

async function fetchData(url, method = "GET", body, signal) {
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

function useFetch(callbacks = { onMutate: null, onSuccess: null, onError: null }) {
  const { onMutate, onSuccess, onError } = callbacks;
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Abortion controller for fetch cancellation
  const controller = new AbortController();

  const triggerFetch = useCallback(async (params, ctx = null) => {
    const { url, method = "GET", body } = params; // Default method here if not specified
	const mutateResult = onMutate && onMutate(body, ctx);
    const { mutatedBody, extraCtx } = mutateResult || { mutatedBody: body, extraCtx: {} };

    try {
      setIsLoading(true);
      setError(null); // Reset error state before a new request
      const result = await fetchData(url, method, mutatedBody, controller.signal);
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
  }, [onMutate, onSuccess, onError]);

  // Clean up: cancel the fetch request if the component unmounts
  // or if triggerFetch is called again before the previous fetch completes.
  useEffect(() => {
    return () => controller.abort();
  }, []);

  return { data, error, isLoading, triggerFetch };
}

export default useFetch;
