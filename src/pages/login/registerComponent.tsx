import styles from './styles.module.css';
import LoadingButton from '@mui/lab/LoadingButton';
import { useEffect, useState } from 'react';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import { useTranslation } from 'react-i18next';
import {z} from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";
import { LoginFormData, RegisterClientForm, RegisterForm, Signatures, loginFormShceme, registerFormScheme } from '../../types/types';
import EmailIcon from '@mui/icons-material/Email';
import logo from '../../assets/logo.png' 
import { useRouter } from 'next/router';
import { getCEP, getSignatures, handleEmailLogin, registerClient } from '@/services/backendCalls';
import { Box, Card, CircularProgress, FormHelperText, MenuItem, Typography } from "@mui/material";
import { buttonStyle, finishButtonStyle, ibeaconCardModel, mainCard } from "../../styles/stylesMui";
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import SettingsIcon from '@mui/icons-material/Settings';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import VideoLabelIcon from '@mui/icons-material/VideoLabel';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { StepIconProps } from '@mui/material/StepIcon';
import Check from '@mui/icons-material/Check';
import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField,  } from '@mui/material';
import { categories, formDataInfo, localData } from '../../types/types';
import ImageIcon from '@mui/icons-material/Image'; 
import { getAllCategories, getAllLocals, getCards, handleCreateCard } from '@/services/backendCalls';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import SensorsIcon from '@mui/icons-material/Sensors';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DescriptionIcon from '@mui/icons-material/Description';
import LinkIcon from '@mui/icons-material/Link';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useFileContext } from "@/contexts/FileContext";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import KeyIcon from '@mui/icons-material/Key';
import BadgeIcon from '@mui/icons-material/Badge';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import ApartmentIcon from '@mui/icons-material/Apartment';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import SearchIcon from '@mui/icons-material/Search';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '75%',
    height: '85%',
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

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 22,
    },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
        backgroundImage:
            'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
        backgroundImage:
            'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        height: 3,
        border: 0,
        backgroundColor:
        theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
        borderRadius: 1,
    },
}));

const ColorlibStepIconRoot = styled('div')<{
    ownerState: { completed?: boolean; active?: boolean };
    }>(({ theme, ownerState }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    ...(ownerState.active && {
        backgroundImage:
        'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
        boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    }),
    ...(ownerState.completed && {
        backgroundImage:
        'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
    }),
}));

function ColorlibStepIcon(props: StepIconProps) {
const { active, completed, className } = props;

const icons: { [index: string]: React.ReactElement } = {
    1: <SettingsIcon />,
    2: <ContactPhoneIcon />,
    3: <KeyIcon />,
};

return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
    {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
);
}

const steps = ['Pricipais Dados', 'Dados Adicionais', 'Dados de Login'];


export default function RegisterComponent(){
    const { t } = useTranslation("global");
    const router = useRouter();
    const [loading, setLoading] = useState(true)
    const [showPassword, setShowPassword] = useState(false);
    const[fetchingCep, setFetchingCep] = useState(false);
    const[fetchedCep, setFetchedCep] = useState(false);
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const[activeStep, setActiveStep] = useState(0);
    const[allSignatures, setAllSignatures] = useState<Signatures[]>();
    const[signatureSelected, setSignatureSelected] = useState(1);
    const handleClickShowPassword = () => setShowPassword((show) => !show);   
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting, isValid }
    } = useForm<RegisterClientForm>({
        resolver: zodResolver(registerFormScheme),
        mode: 'all',
    });

    const handleRegisterUser = async (data: RegisterClientForm) => {
        const formData: RegisterForm = {
            cep: data.cep,
            cnpj: data.cnpj,
            name_users: data.username,
            surname_users: data.surname_username,
            nome_fantasia: data.name,
            razao_social: data.razao_s,
            pass_userdash: data.password,
            phone_pabx: data.phone_pabx,
            phone_user: data.phone_user,
            sig_id: signatureSelected,
            user_email: data.email,
            district: data.district,
            location: data.location,
            state: data.state,
            street: data.street,
        };

        const response = await registerClient(formData);
        console.log(response);
        if(response.status == 200){
            alert('Cadastro realizado com sucesso');
            router.push('/home');
            handleClose();
        }
        else if(response.status == 400){
            alert('Email já cadastrado, insira um email diferente')
        } else {
            alert('Erro ao realizar cadastro')
        }
    }

    const handleSignatureSelectChange = (event: SelectChangeEvent) => {
        const value = Number(event.target.value);
        setSignatureSelected(value);
    };

    useEffect(() => {
        const fetchData = async () => {
            const response = await getSignatures();
            setAllSignatures(response);
            setLoading(false);
        };
        fetchData();
    },[])

    let cep = watch('cep');

    const handleSearchCep = async () => {
        setFetchingCep(true);
        const response = await getCEP(cep);
        setValue('location', response.localidade);
        setValue('district', response.bairro);
        setValue('street', response.logradouro);
        setValue('state', response.uf);
        setFetchingCep(false);
        setFetchedCep(true);
        console.log(response);
    }

    return(
        <>
        {!loading && (
            <Box sx={style}>
            <Stepper sx={{width: '50%'}} alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
                {steps.map((label) => (
                <Step key={label}>
                    <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
                </Step>
                ))}
            </Stepper>
            {activeStep == 0 && (
                <>
                    <FormControl sx={{width: '50%' }} variant="outlined">
                    <InputLabel>Nome da empresa</InputLabel>
                    <OutlinedInput
                        endAdornment={
                        <InputAdornment position="end">
                            <AssignmentIndIcon sx={{justifySelf: 'flex-end'}}/>
                        </InputAdornment>
                        }
                        label="Nome da empresa"
                        {...register('name')}
                    />
                    {errors.name && <p style={{ color: 'red', marginTop:'0.5rem' }}>{errors.name.message}</p>}
                    </FormControl>
                    <FormControl sx={{width: '50%' }} variant="outlined">
                    <InputLabel>Razão Social</InputLabel>
                    <OutlinedInput
                        endAdornment={
                        <InputAdornment position="end">
                            <ApartmentIcon sx={{justifySelf: 'flex-end'}}/>
                        </InputAdornment>
                        }
                        label="Razão Social"
                        {...register('razao_s')}
                    />
                    {errors.razao_s && <p style={{ color: 'red', marginTop:'0.5rem' }}>{errors.razao_s.message}</p>}
                    </FormControl>
                    <FormControl sx={{width: '50%' }} variant="outlined">
                    <InputLabel>Cnpj</InputLabel>
                    <OutlinedInput
                        endAdornment={
                        <InputAdornment position="end">
                            <LocationCityIcon sx={{justifySelf: 'flex-end'}}/>
                        </InputAdornment>
                        }
                        label="Cnpj"
                        {...register('cnpj')}
                    />
                    {errors.cnpj && <p style={{ color: 'red', marginTop:'0.5rem' }}>{errors.cnpj.message}</p>}
                    </FormControl>
                    <FormControl sx={{width: '50%' }} variant="outlined">
                    <InputLabel>Nome do usuário</InputLabel>
                    <OutlinedInput
                        endAdornment={
                        <InputAdornment position="end">
                            <BadgeIcon sx={{justifySelf: 'flex-end'}}/>
                        </InputAdornment>
                        }
                        label="Nome do usuário"
                        {...register('username')}
                    />
                    {errors.username && <p style={{ color: 'red', marginTop:'0.5rem' }}>{errors.username.message}</p>}
                    </FormControl>
                    <FormControl sx={{width: '50%' }} variant="outlined">
                    <InputLabel>Sobrenome do usuário</InputLabel>
                    <OutlinedInput
                        endAdornment={
                        <InputAdornment position="end">
                            <BadgeIcon sx={{justifySelf: 'flex-end'}}/>
                        </InputAdornment>
                        }
                        label="Sobrenome do usuário"
                        {...register('surname_username')}
                    />
                    {errors.surname_username && <p style={{ color: 'red', marginTop:'0.5rem' }}>{errors.surname_username.message}</p>}
                    </FormControl>
                </>
            )}
            {activeStep == 1 && (
                <>
                    <div style={{
                        width: '50%',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space=between'
                    }}>
                        <FormControl sx={{width: '85%' }} variant="outlined">
                        <InputLabel>CEP</InputLabel>
                        <OutlinedInput
                            label="CEP"
                            {...register('cep')}
                        />
                        {errors.cep && <p style={{ color: 'red', marginTop:'0.5rem' }}>{errors.cep.message}</p>}
                        </FormControl>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '10%'
                        }}>
                            {fetchingCep && (
                                <CircularProgress/>
                            )}
                            {!fetchingCep && (
                                <SearchIcon onClick={() => {handleSearchCep()}}/>   
                            )}
                        </div>
                    </div>
                    <div style={{
                        width: '50%',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}>
                        <FormControl sx={{width: '48%' }} variant="outlined">
                        <OutlinedInput
                            disabled={!fetchedCep}
                            placeholder='Estado'
                            {...register('state')}
                        />
                        {errors.state && <p style={{ color: 'red', marginTop:'0.5rem' }}>{errors.state.message}</p>}
                        </FormControl>
                        <FormControl sx={{width: '48%' }} variant="outlined">
                        <OutlinedInput
                            endAdornment={
                            <InputAdornment position="end">
                                <GpsFixedIcon sx={{justifySelf: 'flex-end'}}/>
                            </InputAdornment>
                            }
                            disabled={!fetchedCep}
                            placeholder='Cidade'
                            {...register('location')}
                        />
                        {errors.location && <p style={{ color: 'red', marginTop:'0.5rem' }}>{errors.location.message}</p>}
                        </FormControl>
                    </div>
                    <div style={{
                        width: '50%',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}>
                        <FormControl sx={{width: '48%' }} variant="outlined">
                        <OutlinedInput
                            disabled={!fetchedCep}
                            placeholder='Bairro'
                            {...register('district')}
                        />
                        {errors.district && <p style={{ color: 'red', marginTop:'0.5rem' }}>{errors.district.message}</p>}
                        </FormControl>
                        <FormControl sx={{width: '48%' }} variant="outlined">
                        <OutlinedInput
                            endAdornment={
                            <InputAdornment position="end">
                                <GpsFixedIcon sx={{justifySelf: 'flex-end'}}/>
                            </InputAdornment>
                            }
                            disabled={!fetchedCep}
                            placeholder='Rua'
                            {...register('street')}
                        />
                        {errors.street && <p style={{ color: 'red', marginTop:'0.5rem' }}>{errors.street.message}</p>}
                        </FormControl>
                    </div>
                    <FormControl sx={{width: '50%' }} variant="outlined">
                    <InputLabel>Telefone PABX</InputLabel>
                    <OutlinedInput
                        endAdornment={
                        <InputAdornment position="end">
                            <LocalPhoneIcon sx={{justifySelf: 'flex-end'}}/>
                        </InputAdornment>
                        }
                        label="Telefone PABX"
                        {...register('phone_pabx')}
                    />
                    {errors.phone_pabx && <p style={{ color: 'red', marginTop:'0.5rem' }}>{errors.phone_pabx.message}</p>}
                    </FormControl>
                    <FormControl sx={{width: '50%' }} variant="outlined">
                    <InputLabel>Telefone do usuário</InputLabel>
                    <OutlinedInput
                        endAdornment={
                        <InputAdornment position="end">
                            <LocalPhoneIcon sx={{justifySelf: 'flex-end'}}/>
                        </InputAdornment>
                        }
                        label="Telefone do usuário"
                        {...register('phone_user')}
                    />
                    {errors.phone_user && <p style={{ color: 'red', marginTop:'0.5rem' }}>{errors.phone_user.message}</p>}
                    </FormControl>
                    <FormControl sx={{ minWidth: '50%' }}>
                        <InputLabel id="demo-simple-select-helper-label">Tipo de Assinatura</InputLabel>
                        <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        value={signatureSelected.toString()}
                        label="Tipo de Assinatura"
                        onChange={handleSignatureSelectChange}
                        
                        >
                            {allSignatures?.map((signature) => (
                                <MenuItem key={signature.sig_id} value={signature.sig_id}>
                                    {signature.desc_sig}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </>
            )}
            {activeStep == 2 && (
                <>
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
                    />
                    {errors.email && <p style={{ color: 'red', marginTop:'0.5rem' }}>{errors.email.message}</p>}
                    </FormControl>
                    <FormControl sx={{width: '50%' }} variant="outlined">
                    <InputLabel>Senha</InputLabel>
                    <OutlinedInput
                        endAdornment={
                        <InputAdornment position="end">
                            <KeyIcon sx={{justifySelf: 'flex-end'}}/>
                        </InputAdornment>
                        }
                        label="Senha"
                        {...register('password')}
                    />
                    {errors.password && <p style={{ color: 'red', marginTop:'0.5rem' }}>{errors.password.message}</p>}
                    </FormControl>
                </>
            )}
            <form onSubmit={handleSubmit(handleRegisterUser)}  style={{display: 'flex', flexDirection: 'row', gap: '1rem', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
                <LoadingButton onClick={(e)=>{e.preventDefault(); setActiveStep((prev) => prev -1)}} disabled={activeStep == 0} sx={buttonStyle}>Anterior</LoadingButton>
                {activeStep != 2 && (
                    <LoadingButton 
                        onClick={(e)=>{e.preventDefault(); 
                        setActiveStep((prev) => prev +1)}}
                        loading={isSubmitting}
                        sx={buttonStyle}
                        >Próximo
                    </LoadingButton>
                )}
                {activeStep == 2 && (
                    <LoadingButton 
                        disabled={!isValid || isSubmitting}
                        loading={isSubmitting}
                        type='submit' 
                        sx={buttonStyle}
                        >Enviar
                    </LoadingButton>
                )}
            </form>
            </Box>
        )}
        {loading && (
            <CircularProgress/>
        )}
        </>
    )
}

// onSubmit={handleSubmit(handleRegisterUser)}