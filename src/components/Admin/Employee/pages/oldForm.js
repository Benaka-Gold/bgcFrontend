import React from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { TextField, Grid, Paper, Typography } from '@mui/material';
import { createEmployee, updateEmployee } from '../../apis/employee';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import EmployeeformPages from './EmployeeFormPages/EmployeeformPages';


const EmployeeForm = ({ open, onClose, employeeData, onSave }) => {
    const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
        defaultValues: employeeData || {
            empCode: '',
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            dateOfBirth: null,
            address: {
                street: '',
                city: '',
                state: '',
                zipCode: '',
                country: ''
            },
            position: '',
            department: '',
            dateHired: new Date(),
            documents: [],
            photo: null,
        }
    });

    const submitForm = async (data) => {
        try {
            if (employeeData) {
                await updateEmployee(employeeData._id, data);// Update existing employee
            } else {
                await createEmployee(data) // Create new employee
            }
            onSave();
            onClose();
        } catch (error) {
            // Handle error response
        }
    };

    // Reset form when employeeData changes
    React.useEffect(() => {
        reset(employeeData);
    }, [employeeData, reset]);

    const handlePhotoUpload = async (e) => {
        console.log(e)
    }

    const handleIdProofUpload = async (e) => {
        console.log(e)
    }

    const handleAddressProofUpload = async (e) => {
        console.log(e)
    }

    return (
        <Dialog open={open} onClose={onClose} aria-labelledby="employee-form-dialog">
            <DialogTitle>{employeeData ? 'Edit Employee' : 'Create New Employee'}</DialogTitle>
            <DialogContent>
                <form id="employee-form" onSubmit={handleSubmit(submitForm)} noValidate>
                    <Grid container spacing={2}>
                        {/* Left Column */}
                        <Grid item xs={12} md={4}>
                            {/* Employee Code */}
                            <TextField
                                margin="normal"
                                label="Employee Code"
                                {...register('empCode', { required: 'Employee code is required' })}
                                error={!!errors.empCode}
                                helperText={errors.empCode?.message}
                            />
                            {/* First Name */}
                            <TextField
                                margin="normal"
                                fullWidth
                                label="First Name"
                                {...register('firstName', { required: 'First name is required' })}
                                error={!!errors.firstName}
                                helperText={errors.firstName?.message}
                            />
                            {/* Last Name */}
                            <TextField
                                margin="normal"
                                fullWidth
                                label="Last Name"
                                {...register('lastName', { required: 'Last name is required' })}
                                error={!!errors.lastName}
                                helperText={errors.lastName?.message}
                            />
                            {/* Email */}
                            <TextField
                                margin="normal"
                                fullWidth
                                label="Email"
                                type="email"
                                {...register('email', { required: 'Email is required' })}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />
                            {/* Phone Number */}
                            <TextField
                                margin="normal"
                                fullWidth
                                label="Phone Number"
                                {...register('phoneNumber', { required: 'Phone number is required' })}
                                error={!!errors.phoneNumber}
                                helperText={errors.phoneNumber?.message}
                            />
                            {/* Date of Birth */}
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Date of Birth"
                                    value={watch('dateOfBirth')}
                                    onChange={(date) => setValue('dateOfBirth', date)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            margin="normal"
                                            fullWidth
                                            error={!!errors.dateOfBirth}
                                            helperText={errors.dateOfBirth?.message}
                                        />
                                    )}
                                />
                            </LocalizationProvider>
                            {/* Date Hired */}
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Date Hired"
                                    value={watch('dateHired')}
                                    onChange={(date) => setValue('dateHired', date)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            margin="normal"
                                            fullWidth
                                            error={!!errors.dateHired}
                                            helperText={errors.dateHired?.message}
                                        />
                                    )}
                                />
                            </LocalizationProvider>
                        </Grid>

                        {/* Right Column */}
                        <Grid item xs={12} md={4}>
                            {/* Position */}
                            <TextField
                                margin="normal"
                                fullWidth
                                label="Position"
                                {...register('position')}
                            />
                            {/* Department */}
                            <TextField
                                margin="normal"
                                fullWidth
                                label="Department"
                                {...register('department')}
                            />
                            {/* Address Fields */}
                            <TextField
                                margin="normal"
                                fullWidth
                                label="Street"
                                {...register('address.street')}
                            />
                            <TextField
                                margin="normal"
                                fullWidth
                                label="City"
                                {...register('address.city')}
                            />
                            <TextField
                                margin="normal"
                                fullWidth
                                label="State"
                                {...register('address.state')}
                            />
                            <TextField
                                margin="normal"
                                fullWidth
                                label="Zip Code"
                                {...register('address.zipCode')}
                            />
                            <TextField
                                margin="normal"
                                fullWidth
                                label="Country"
                                {...register('address.country')}
                            />
                            {/* Photo Upload */}
                            {/* <DropzoneArea
                                acceptedFiles={['image/*']}
                                dropzoneText={"Drag and drop employee's photo or click"}
                                filesLimit={1}
                                onDrop={handlePhotoUpload}
                            /> */}
                            {/* Address Proof Upload */}
                            {/* <DropzoneArea
                                acceptedFiles={['image/*', 'application/pdf']}
                                dropzoneText={"Drag and drop address proof or click"}
                                filesLimit={1}
                                onDrop={handleAddressProofUpload}
                            /> */}
                            {/* ID Proof Upload */}
                            {/* <DropzoneArea
                                acceptedFiles={['image/*', 'application/pdf']}
                                dropzoneText={"Drag and drop ID proof or click"}
                                filesLimit={1}
                                onDrop={handleIdProofUpload}
                            /> */}
                        </Grid>
                        <Grid item md={4} xs={12}>

                        </Grid>
                    </Grid>
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button form="employee-form" type="submit">Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EmployeeForm;