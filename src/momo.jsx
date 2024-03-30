import { useState } from 'react'
import { TextField, MenuItem, Tabs, Tab } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import InputField from './inputField'

export default function Momo({ values = { differs: "Kang", select: 3} } ) {

	const { control, handleSubmit, formState: { errors } } = useForm({
		mode: 'onBlur',
		values,
	});

	const onSubmit = async (data) => {
		console.log(data);
	};
	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<InputField control={control} errors={errors} title="differs" />
		<InputField control={control} errors={errors} title="select" type="select" >
			<MenuItem value="1">1</MenuItem>
			<MenuItem value="2">2</MenuItem>
			<MenuItem value="3">3</MenuItem>
		</InputField>
		<button type="submit">Submit</button>
		</form>
	)
}