import { useState } from 'react'
import { useForm } from 'react-hook-form';
import InputField from './inputField'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import './App.css'
import useFetch from './hooks/useFetch'
import { useDesigner } from './hooks/useDesigner'

function App() {
	const { control, handleSubmit, formState: { errors } } = useForm({
		mode: 'all',
	});

	const { designerData, isDesignerLoading } = useDesigner();
	const [data, setData] = useState(null);

	const { fetchData } = useFetch({
		onMutate: (body, ctx) => {
			console.log('onMutate', body, ctx)
			return { body, extraCtx: { extra: "extra" } }
		},
		onSuccess: (res, body, ctx) => {
			console.log('onSuccess', res, body, ctx)
			setData(res)
		},
		onError: (error) => {
			console.log(error)
		}
	});


	const onSubmit = async (data) => {
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
		{isDesignerLoading && <div>Loading...</div>}
		{
			<>
			{(data || designerData)?.data.map((item, index) => <div key={index}>{item.name}</div>)}
		</>
		}
	</LocalizationProvider>
    
  )
}

export default App
