import { useMinor, useMajor } from ".";

/**
 * Async operation hook
 * @param {Function} asyncFunction - Async function to execute
 * @param {Array} dependencies - Dependency array
 * @return {Object} { loading, error, data } - Async state
 */
export function useAsync(asyncFunction, dependencies = []) {
  const [state, setState] = useMinor({
    loading: false,
    error: null,
    data: null,
  });

  useMajor(() => {
    setState({ loading: true, error: null, data: null });

    asyncFunction()
      .then((data) => setState({ loading: false, error: null, data }))
      .catch((error) => setState({ loading: false, error, data: null }));
  }, dependencies);

  return state;
}
