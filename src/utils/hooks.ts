import * as React from 'react';

function useSafeDispatch<A>(dispatch: React.Dispatch<A>) {
  const mounted = React.useRef(false);
  React.useLayoutEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  return React.useCallback((args) => (mounted.current ? dispatch(args) : void 0), [dispatch]);
}

// Example usage:
// const {data, error, status, run} = useAsync()
// React.useEffect(() => {
//   run(fetchPokemon(pokemonName))
// }, [pokemonName, run])

export type AsyncLoadingState<DataType> = {
  status: 'idle' | 'pending' | 'rejected' | 'resolved';
  data: DataType | null;
  error: Error | null;
};

function defaultInitialState<DataType>(): AsyncLoadingState<DataType> {
  return { status: 'idle', data: null, error: null };
}

type AsyncLoadingResult<DataType> = {
  isIdle: boolean;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  setData: (data: DataType) => void;
  setError: (error: Error) => void;
  error: Error | null;
  status: 'idle' | 'pending' | 'rejected' | 'resolved';
  data: DataType | null;
  run: (promise: Promise<DataType>) => Promise<DataType>;
  reset: () => void;
};

function useAsync<T>(initialState: Partial<AsyncLoadingState<T>>): AsyncLoadingResult<T> {
  const initialStateRef: React.MutableRefObject<AsyncLoadingState<T>> = React.useRef({
    ...defaultInitialState(),
    ...initialState,
  });
  const [{ data, error, status }, setState] = React.useReducer(
    (s: AsyncLoadingState<T>, a: AsyncLoadingState<T>) => ({ ...s, ...a }),
    initialStateRef.current
  );

  const safeSetState = useSafeDispatch(setState);

  const setData = React.useCallback((data) => safeSetState({ data, status: 'resolved' }), [
    safeSetState,
  ]);
  const setError = React.useCallback((error) => safeSetState({ error, status: 'rejected' }), [
    safeSetState,
  ]);
  const reset = React.useCallback(() => {
    safeSetState(initialStateRef.current);
  }, [safeSetState]);

  const run = React.useCallback(
    (promise: Promise<T>) => {
      if (!promise || !promise.then) {
        throw new Error(
          `The argument passed to useAsync().run must be a promise. Maybe a function that's passed isn't returning anything?`
        );
      }
      safeSetState({ status: 'pending' });
      return promise.then(
        (data) => {
          setData(data);
          return data;
        },
        (error) => {
          setError(error);
          return Promise.reject(error);
        }
      );
    },
    [safeSetState, setData, setError]
  );

  return {
    // using the same names that react-query uses for convenience
    isIdle: status === 'idle',
    isLoading: status === 'pending',
    isError: status === 'rejected',
    isSuccess: status === 'resolved',

    setData,
    setError,
    error,
    status,
    data,
    run,
    reset,
  };
}

export { useAsync };
