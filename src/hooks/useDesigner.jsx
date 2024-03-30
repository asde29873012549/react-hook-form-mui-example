import useFetch from "./useFetch";

export function useDesigner() {
	const { data, error, isLoading } = useFetch({
		autoFetch: true,
		fetchUrl: 'http://localhost:8080/designer?limit=10'
	});

	return { designerData: data, designerError: error, isDesignerLoading: isLoading }
}