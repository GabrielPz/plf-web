import styles from './styles.module.css';
import { Box, FormControl, IconButton, InputAdornment, InputLabel, Modal, OutlinedInput, TextField, Typography,  } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useEffect, useState } from 'react';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import { useTranslation } from 'react-i18next';
import {z} from 'zod';
import { useRouter } from 'next/router';

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


export default function Home(){
    const router = useRouter();
    useEffect(() => {
        router.push('/login')
    },[])
    return(
        <>
        </>
    )
}