import { useState } from 'react'
import { TextField, MenuItem } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import InputField from './inputField'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import './App.css'

function App({ values = { firstName: "Noah", lastName: "Hong", differ: "Kang", select: 3 } }) {
	const { control, handleSubmit, formState: { errors } } = useForm({
		mode: 'onBlur',
		values,
		defaultValues: {
			differs: values.differ,		}
	});

	const onSubmit = async (data) => {
		console.log(data);
	};

  return (
	<LocalizationProvider dateAdapter={AdapterDayjs}>
		<form onSubmit={handleSubmit(onSubmit)}>
		<InputField control={control} errors={errors} title="firstName" />
		<InputField control={control} errors={errors} title="lastName" />
		<InputField control={control} errors={errors} title="differs" />
		<InputField control={control} errors={errors} title="select" type="select" >
			<MenuItem value="1">1</MenuItem>
			<MenuItem value="2">2</MenuItem>
			<MenuItem value="3">3</MenuItem>
		</InputField>
		<InputField control={control} errors={errors} title="date" type="date" />
		<button type="submit">Submit</button>
		</form>
	</LocalizationProvider>
    
  )
}

export default App
