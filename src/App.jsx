import { useState } from 'react'
import { useForm } from 'react-hook-form';
import InputField from './inputField'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import './App.css'
import useFetch from './hooks/useFetch'

function App() {
	const { control, handleSubmit, formState: { errors } } = useForm({
		mode: 'all',
	});

	const [count, setCount] = useState(0);

	const { data, isLoading, fetchData } = useFetch({
		onMutate: (body, ctx) => {
			console.log(body, ctx)
			return { body, extraCtx: { extra: "extra" } }
		},
		onSuccess: (res, body, ctx) => {
			console.log(res, body, ctx, count)
		},
		onError: (error) => {
			console.log(error)
		},
		autoFetch: true,
		fetchUrl: 'http://localhost:8080/designer?limit=10'
	});


	const onSubmit = async (data) => {
		setCount(count + 1)
		await fetchData({
			url: `http://localhost:8080/designer?keyword=${data.designer}&limit=10`,
		}, { numLevel: 1 })
	};

	console.log("rerender")

  return (
	<LocalizationProvider dateAdapter={AdapterDayjs}>
		<form onSubmit={handleSubmit(onSubmit)}>
		<InputField control={control} errors={errors} title="designer" />
		<button type="submit">Submit</button>
		</form>
		{isLoading && <div>Loading...</div>}
		{
			<>{data?.data.map((item, index) => <div key={index}>{item.name}</div>)}</>
		}
	</LocalizationProvider>
    
  )
}

export default App
