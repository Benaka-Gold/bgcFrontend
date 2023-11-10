import React from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { TextField, Grid, Paper, Typography } from '@mui/material';
import { createEmployee, updateEmployee } from '../../apis/employee';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { PersonalDetails } from './pages/PersonalDetails';
import { AddressDetails } from './pages/AddressDetails';
import { DocumentationDetails } from './pages/DocumentationDetails';
import { CompanyDetails } from './pages/CompanyDetails';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material';

const EmployeeForm = ({ open, onClose, employeeData, onSave }) => {

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
        defaultValues: employeeData || {
            empCode: '',
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            fatherName: ' ',
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
            teamId: ' ',
            dateHired: new Date(),
            documents: [],
            photo: null,
        }
    });

    const submitForm = async (data) => {
        try {
            if (employeeData) {
                // await updateEmployee(employeeData._id, data);// Update existing employee
                console.log(employeeData);
            } else {
                // await createEmployee(data) // Create new employee
                console.log(data);
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
        <Dialog open={open} onClose={onClose} aria-labelledby="employee-form-dialog" fullWidth={true} fullScreen={fullScreen} scroll='body' maxWidth={'lg'}>
            <DialogTitle>{employeeData ? 'Edit Employee' : 'Create New Employee'}</DialogTitle>
            <DialogContent>
                <form id="employee-form" onSubmit={handleSubmit(submitForm)} noValidate>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <PersonalDetails register={register} errors={errors} watch={watch} setValue={setValue} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <AddressDetails register={register} errors={errors} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <DocumentationDetails register={register} errors={errors} setValue={setValue} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <CompanyDetails register={register} errors={errors} watch={watch} setValue={setValue} />
                            </Grid>
                        </Grid>
                    </LocalizationProvider>
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
