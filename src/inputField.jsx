import { Typography } from "@mui/material"
import { TextField, Select } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Controller } from 'react-hook-form';

// eslint-disable-next-line react/prop-types
export default function InputField({ control, errors, title, type = "text", children }) {

	const inputType = (field) => {
		switch (type) {
			case "text":
				return <TextField
					{ ...field}
					variant="outlined"
					error={!!errors[title]}
				/>
			case "select":
				return <Select
					{ ...field}
					variant="outlined"
					error={!!errors[title]}
				>{children}</Select>
			case "date":
				return <DatePicker
					{ ...field}
					label="YYYY/MM/DD"
					slotProps={{
						textField: {
							error: !!errors[title],
						},
					}}
				/>
		}
	}

	return (
		<div>
			<Typography variant="h3">Input Field</Typography>
			<Controller
				name={title}
				control={control}
				defaultValue=""
				rules={{ required: 'First name required' }}
				render={({ field }) => (
					<>{inputType(field)}</>
				)}
			/>
		</div>
	)
}