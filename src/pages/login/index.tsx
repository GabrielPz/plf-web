import styles from './styles.module.css';
import { Alert, Box, FormControl, IconButton, InputAdornment, InputLabel, Modal, OutlinedInput, TextField, Typography,  } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useEffect, useState } from 'react';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import { useTranslation } from 'react-i18next';
import {z} from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";
import { LoginFormData, loginFormShceme } from '../../types/types';
import EmailIcon from '@mui/icons-material/Email';
import logo from '../../assets/2.png' 
import { useRouter } from 'next/router';
import { handleEmailLogin } from '@/services/backendCalls';
import RegisterComponent from './registerComponent';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '75%',
    height: '75%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem'
};


export default function Login(){
    const { t } = useTranslation("global");
    const router = useRouter();
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const handleShowAlert = () => setShowAlert(true);
    const handleDismissAlert = () => setShowAlert(false);
    const[alertMessage, setAlertMessage] = useState('');
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);   
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginFormShceme),
    });

    const handleLogin = async (data: LoginFormData) => {
        setLoading(true);
        const result = await handleEmailLogin(data);
        setLoading(false);
        if(result?.status == 200){
            router.push('/home');
            return;
        }
        setAlertMessage("Credênciais inválidas");
        handleShowAlert();
    }
    return(
        <div className={styles.body}>
            {showAlert && (
                <Alert variant="filled" severity="error" sx={{position: 'absolute', top: '20%'}} onClose={() => {handleDismissAlert()}}>
                    {alertMessage}
                </Alert>
            )}
            <form className={styles.formContainer} onSubmit={handleSubmit(handleLogin)}>
                <img src={logo.src} height="300px"/>
                <FormControl sx={{width: '50%' }} variant="outlined">
                <InputLabel>Email</InputLabel>
                <OutlinedInput
                    endAdornment={
                    <InputAdornment position="end">
                        <EmailIcon sx={{justifySelf: 'flex-end'}}/>
                    </InputAdornment>
                    }
                    label="Email"
                    {...register('email')}
                    error={errors.email ? true : false}
                />
                </FormControl>
                <FormControl sx={{width: '50%' }} variant="outlined">
                <InputLabel>Password</InputLabel>
                <OutlinedInput
                    type={showPassword ? 'text' : 'password'}
                    endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        // edge="end"
                        >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                    }
                    label="Password"
                    {...register('password')}
                    error={errors.password ? true : false}
                />
                </FormControl>
                <LoadingButton loading={loading} type='submit' sx={{backgroundColor: '#F46A29', color: '#fff', width: '10%', margin: '1rem 0 0 0', "&:hover": {backgroundColor: '#F46A29'} }}> Login </LoadingButton>
            </form>
        </div>
    )
}