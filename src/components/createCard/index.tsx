import { Box, Card, CircularProgress, FormHelperText, MenuItem, Modal, Typography } from "@mui/material";
import styles from './styles.module.css';
import { BoxContainerStyle, buttonStyle, finishButtonStyle, ibeaconCardModel, mainCard, openMapButtonStyle } from "./stylesMui";
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
import { LoadingButton } from '@mui/lab';
import { useEffect, useState } from 'react';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import { useTranslation } from 'react-i18next';
import {z} from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";
import { LoginFormData, categories, formDataInfo, localData, loginFormShceme } from '../../types/types';
import EmailIcon from '@mui/icons-material/Email';
import logo from '../../assets/logo.png';
import ImageIcon from '@mui/icons-material/Image'; 
import { useRouter } from 'next/router';
import { getAllCategories, getAllLocals, getCards, getCepForCard, handleCreateCard, handleEmailLogin } from '@/services/backendCalls';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import SensorsIcon from '@mui/icons-material/Sensors';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DescriptionIcon from '@mui/icons-material/Description';
import LinkIcon from '@mui/icons-material/Link';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { FileInput } from "../DropZone";
import { useFileContext } from "@/contexts/FileContext";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { useUpdate } from "@/contexts/UpdateContext";
import CreateLocalComponent from "../createLocal";
import SearchIcon from '@mui/icons-material/Search';

import dynamic from "next/dynamic";
import { LatLngTuple } from "leaflet";
const DynamicMap = dynamic(() => import('../commons/mapComponent'))


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
    2: <AttachMoneyIcon />,
    3: <ImageIcon />,
};

return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
    {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
);
}

const steps = ['Principais Informações', 'Preços e Localização', 'Escolha uma Imagem'];

export default function CreateCard() {
    const[activeStep, setActiveStep] = useState(0);
    const { refreshState, toggleRefresh } = useUpdate();
    const { t } = useTranslation("global");
    const {files, setFiles} = useFileContext();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [dataFetched, setDatafetched] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [categorySelected, setcategorySelected] = useState(0);
    const [localSelected, setlocalSelected] = useState(0);
    const [hasPrice, setHasPrice] = useState(0);
    const[creatingCard, setCreatingCard] = useState(false);
    const[createdCard, setCreatedCard] = useState(false);
    const [allCategories, setAllCategoreis] = useState<categories[]>();
    const [allLocals, setAllLocals] = useState<localData[]>();
    const[localSelectedName, setLocalSelectedName] = useState('');
    const[categorySelectedName, setCategorySelectedName] = useState('');
    const[cep, setCep] = useState('');
    const[fetchingCep, setFetchingCep] = useState(false);
    const[latLngFromCep, setLatLngFromCep] = useState<LatLngTuple>([-15.793889, -47.882778])

    const [openCreateLocalModal, setOpenCreateLocalModal] = useState(false);
    const handleOpenCreateModal = () => setOpenCreateLocalModal(true);
    const handleCloseCreateModal = () => {setOpenCreateLocalModal(false); toggleRefresh()};

    const[openMapModal, setOpenMapModal] = useState(false);
    const handleOpenMapModal = () => setOpenMapModal(true);
    const handleCloseMapModal = () => setOpenMapModal(false);

    const [formInfo, setFormInfo] = useState<formDataInfo>({
        brute_value: 0,
        desc_cupom: '', 
        discount_value: 0, 
        expiration_data: '', 
        has_price: 0, 
        ibeacon_uuid: '', 
        id_category: 0, 
        id_client: 0, 
        id_local: 0, 
        lat_cupom: '', 
        link_cupom: '', 
        lon_cupom: '', 
        name_cupom: '', 
        value_with_discount: 0
    })
    const hasPriceOptions = [
        {
            key: 0,
            desc: t('yes')
        },
        {
            key: 1,
            desc: t('no')
        }
    ]
    useEffect(()=> {
        const fetchData = async () => {
            const response = await getAllCategories();
            setAllCategoreis(response);
            console.log(allCategories);
            const idClientFromSession = sessionStorage.getItem('id_client');
            setFormInfo((prev) => ({
                ...prev,
                id_client: Number(idClientFromSession)
            }))
            const localsResponse = await getAllLocals();
            getCards();
            setAllLocals(localsResponse);
            setDatafetched(true);
        };
        fetchData();
    },[refreshState]);

    const handleCategorySelectChange = (event: SelectChangeEvent) => {
        const value = Number(event.target.value);
        setcategorySelected(value);
        setFormInfo(prev => ({
            ...prev,
            id_category: value
        }))
    };

    const handleLocalSelectChange = (event: SelectChangeEvent) => {
        const value = Number(event.target.value);
        setlocalSelected(value);
        setFormInfo(prev => ({
            ...prev,
            id_local: value
        }))
    };
    const handlePriceSelectChange = (event: SelectChangeEvent) => {
        const value = Number(event.target.value);
        setHasPrice(value);
        setFormInfo(prev => ({
            ...prev,
            has_price: value
        }))
    };

    const sendData = async () => {
        setCreatingCard(true);
        setFormInfo((prev) => ({
            ...prev, value_with_discount: prev.brute_value - prev.discount_value
        }))
        const response = await handleCreateCard(formInfo, files);
        setCreatingCard(false);
        setCreatedCard(true);
    }

    const refreshData = () => {
        setActiveStep(0);
        setFormInfo({
            brute_value: 0, 
            desc_cupom: '', 
            discount_value: 0, 
            expiration_data: '', 
            has_price: 0, 
            ibeacon_uuid: '00:00:00:00', 
            id_category: 0, 
            id_client: 0, 
            id_local: 0, 
            lat_cupom: '', 
            link_cupom: '', 
            lon_cupom: '', 
            name_cupom: '', 
            value_with_discount: 0
        });
        setFiles([]);
        setCreatedCard(false);
    }

    const getCepForCardF = async () => {
        setFetchingCep(true);
        const response = await getCepForCard(cep);
        if(response.status == 200){
            const data = response.data;
            const lat = Number(data.lat) || -15.793889;
            const lng = Number(data.lng) || -47.882778;
            setLatLngFromCep([lat,lng]);
        }
        setFetchingCep(false);

    }

    const createImageUrl = (file: File) => {
        return URL.createObjectURL(file);
    };

    const selectLocal = (latitude: number, longitude: number) => {
        console.log(`Latitude na função: ${latitude}`);
        console.log(`Longitude na função: ${longitude}`);
        setFormInfo((prev) => ({
            ...prev,
            lat_cupom: latitude.toString(),
            lon_cupom: longitude.toString()
        }))
     
    }

    return (
        <div className={styles.body}>
            {dataFetched ? (
                <>
                <Modal
                    open={allLocals?.length == 0}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <CreateLocalComponent onClose={handleCloseCreateModal}/>
                </Modal>
                <Modal
                    open={openMapModal}
                    onClose={handleCloseMapModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={BoxContainerStyle}>
                        <Typography variant='h6'>
                            Selecione o Local do Card no Mapa
                        </Typography>
                        <div style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space=between'
                        }}>
                            <FormControl sx={{width: '85%' }} variant="outlined">
                            <InputLabel>CEP</InputLabel>
                            <OutlinedInput
                                placeholder="01153000"
                                label="CEP"
                                onChange={(e) => {setCep(e.target.value)}}
                            />
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
                                    <IconButton>
                                        <SearchIcon onClick={() => {getCepForCardF()}}/>   
                                    </IconButton>
                                )}
                            </div>
                        </div>
                            <DynamicMap latLng={latLngFromCep} onSelectLocal={selectLocal}/>
                        <LoadingButton onClick={handleCloseMapModal} sx={openMapButtonStyle}>
                            Finalizar
                        </LoadingButton>
                    </Box>
                </Modal>
                <div className={styles.mainContainer}>
                    <Card sx={ibeaconCardModel}>
                        <div className={ formInfo.has_price == 0 ? styles.ibeaconCardModelData : styles.ibeaconCardModelDataWhitoutPrice}>
                            <Typography variant="h6" sx={{margin: '0 0 0 1rem'}}>
                                Identificação: {formInfo.name_cupom != '' ? formInfo.name_cupom : 'XXXXXXXX'}
                            </Typography>
                            <Typography variant="h6" sx={{margin: '0 0 0 1rem'}}>
                                Descrição: {formInfo.desc_cupom != '' ? formInfo.desc_cupom : 'XXXXXXXX'}
                            </Typography>
                            <Typography variant="h6" sx={{margin: '0 0 0 1rem'}}>
                                Local: {localSelectedName != '' ? localSelectedName : 'XXXXXXXX'}
                            </Typography>
                            <Typography variant="h6" sx={{margin: '0 0 0 1rem'}}>
                                Categoria: {categorySelectedName != '' ? categorySelectedName : 'XXXXXXXX'}
                            </Typography>
                            {formInfo.has_price == 0 && (
                                <>
                                <Typography variant="h6" sx={{margin: '0 0 0 1rem'}}>
                                    Valor bruto: {formInfo.brute_value}
                                </Typography>
                                <Typography variant="h6" sx={{margin: '0 0 0 1rem'}}>
                                    Desconto: {formInfo.discount_value}
                                </Typography>
                                <Typography variant="h6" sx={{margin: '0 0 0 1rem'}}>
                                    Valor Final: { formInfo.brute_value - formInfo.discount_value}
                                </Typography>
                                </>
                            )}
                        </div>
                        <div className={styles.ibeaconCardModelImg}>
                            {files[0] ? (
                                <img src={files[0] ? createImageUrl(files[0]) : ''} className={styles.ibeaconCardImg}/>
                            ) : (<AddPhotoAlternateIcon sx={{ fontSize: 75}}/>)}
                        </div>
                    </Card>
                    <Card sx={mainCard}>
                    <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
                        {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
                        </Step>
                        ))}
                    </Stepper>
                        {createdCard ? (
                            <div className={styles.refreshContainer}>
                                <Typography variant="h5">
                                    Card Criado com sucesso!
                                </Typography>
                                <CheckCircleIcon sx={{fontSize: '3rem', color: '#F46A29'}}/>
                                <LoadingButton loading={loading} onClick={(e)=>{e.preventDefault(); refreshData()}} sx={finishButtonStyle}>{t("newCard")}</LoadingButton>
                            </div>
                        ) : (
                            <>
                                {activeStep == 0 && (
                                    <form className={styles.formContainer}>
                                    <div className={styles.formContentRow}>
                                        <div className={styles.formDataContent}>
                                            <FormControl sx={{minWidth: '100%' }}>
                                                <InputLabel id="demo-simple-select-helper-label">{t("local")}</InputLabel>
                                                <Select
                                                labelId="demo-simple-select-helper-label"
                                                id="demo-simple-select-helper"
                                                value={localSelected.toString()}
                                                label={t("local")}
                                                onChange={handleLocalSelectChange} 
                                                >
                                                    {allLocals?.map((local) => (
                                                        <MenuItem key={local.ibeacons_id_locals} value={local.ibeacons_id_locals} onClick={(e) => {setLocalSelectedName(local.ibeacon_local)}}>
                                                            {local.ibeacon_local}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            <FormControl sx={{ minWidth: '100%' }}>
                                                <InputLabel id="demo-simple-select-helper-label">{t("category")}</InputLabel>
                                                <Select
                                                labelId="demo-simple-select-helper-label"
                                                id="demo-simple-select-helper"
                                                value={categorySelected.toString()}
                                                label="category"
                                                onChange={handleCategorySelectChange}
                                                
                                                >
                                                    {allCategories?.map((category) => (
                                                        <MenuItem key={category.id_cat} value={category.id_cat} onClick={(e) => {setCategorySelectedName(category.name_cat)}}>
                                                            {category.name_cat}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </div>
                                        <div className={styles.formDataContent2}>
                                            <FormControl  sx={{ width: '100%' }} variant="outlined">
                                                <OutlinedInput
                                                    value={formInfo.name_cupom}
                                                    endAdornment={
                                                    <InputAdornment position="end">
                                                        <DriveFileRenameOutlineIcon sx={{justifySelf: 'flex-end'}}/>
                                                    </InputAdornment>
                                                    }
                                                    placeholder={t("cardCode")}
                                                    onChange={(e) => {setFormInfo((prev) => ({...prev, name_cupom: e.target.value}))}}
                                                />
                                            </FormControl>
                                            <FormControl sx={{width: '100%' }} variant="outlined">
                                                <OutlinedInput
                                                    endAdornment={
                                                    <InputAdornment position="end">
                                                        <DescriptionIcon sx={{justifySelf: 'flex-end'}}/>
                                                    </InputAdornment>
                                                    }
                                                    placeholder="Descrição do Card"
                                                    value={formInfo.desc_cupom}
                                                    onChange={(e) => {setFormInfo((prev) => ({...prev, desc_cupom: e.target.value}))}}
                                                />
                                            </FormControl>
                                        </div>
                                    </div>
                                            <FormControl sx={{width: '100%' }} variant="outlined">
                                                <OutlinedInput
                                                    endAdornment={
                                                    <InputAdornment position="end">
                                                        <LinkIcon sx={{justifySelf: 'flex-end'}}/>
                                                    </InputAdornment>
                                                    }
                                                    value={formInfo.link_cupom}
                                                    placeholder="Link do Card"
                                                    onChange={(e) => {setFormInfo((prev) => ({...prev, link_cupom: e.target.value}))}}
                                                />
                                            </FormControl>
                                    <div style={{display: 'flex', flexDirection: 'row', gap: '1rem', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
                                        <LoadingButton loading={loading} type='submit' sx={buttonStyle}>{t("back")}</LoadingButton>
                                        <LoadingButton loading={loading} onClick={(e)=>{e.preventDefault(); setActiveStep((prev) => prev +1)}} sx={buttonStyle}>{t("next")}</LoadingButton>
                                    </div>
                                </form>
                                )}
                                {activeStep == 1 && (
                                    <form className={styles.formContainer}>
                                    <div className={styles.formContentRow}>
                                        <div className={styles.formDataContent}>
                                            <FormControl sx={{width: '100%' }} variant="outlined">
                                                <InputLabel shrink>{t("expireDate")}</InputLabel>
                                                <OutlinedInput
                                                    type='date'
                                                    label={t("expireDate")}
                                                    onChange={(e) => {setFormInfo((prev) => ({...prev, expiration_data: e.target.value}))}}
                                                />
                                            </FormControl>
                                            <FormControl sx={{minWidth: '100%' }}>
                                                <InputLabel id="demo-simple-select-helper-label">{t("hasPrice")}</InputLabel>
                                                <Select
                                                labelId="demo-simple-select-helper-label"
                                                id="demo-simple-select-helper"
                                                value={hasPrice.toString()}
                                                label={t("hasPrice")}
                                                onChange={handlePriceSelectChange} 
                                                >
                                                    {hasPriceOptions.map((option) => (
                                                        <MenuItem key={option.key} value={option.key}>
                                                            {option.desc}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            {/* <FormControl sx={{ width: '100%' }} variant="outlined">
                                                <InputLabel>{t("localLat")}</InputLabel>
                                                <OutlinedInput
                                                    endAdornment={
                                                    <InputAdornment position="end">
                                                        <LocationOnIcon sx={{justifySelf: 'flex-end'}}/>
                                                    </InputAdornment>
                                                    }
                                                    label={t("localLat")}
                                                    onChange={(e) => {setFormInfo((prev) => ({...prev, lat_cupom: e.target.value}))}}
                                                />
                                            </FormControl>
                                            <FormControl sx={{ width: '100%' }} variant="outlined">
                                                <InputLabel>{t("localLng")}</InputLabel>
                                                <OutlinedInput
                                                    endAdornment={
                                                    <InputAdornment position="end">
                                                        <LocationOnIcon sx={{justifySelf: 'flex-end'}}/>
                                                    </InputAdornment>
                                                    }
                                                    label={t("localLng")}
                                                    onChange={(e) => {setFormInfo((prev) => ({...prev, lon_cupom: e.target.value}))}}
                                                />
                                            </FormControl> */}
                                        </div>
                                        <div className={styles.formDataContent2}>
                                            <FormControl sx={{ width: '100%' }} variant="outlined" disabled={hasPrice == 1 ? true : false}>
                                                {formInfo.brute_value == 0  && (<InputLabel>{t("bruteValue")}</InputLabel>)}
                                                <OutlinedInput
                                                    endAdornment={
                                                    <InputAdornment position="end">
                                                        <AttachMoneyIcon sx={{justifySelf: 'flex-end'}}/>
                                                    </InputAdornment>
                                                    }
                                                    label={t("bruteValue")}
                                                    onChange={(e) => {setFormInfo((prev) => ({...prev, brute_value: Number(e.target.value)}))}}
                                                />
                                            </FormControl>
                                            <FormControl sx={{width: '100%' }} variant="outlined" disabled={hasPrice == 1 ? true : false}>
                                                <InputLabel>{t("discountValue")}</InputLabel>
                                                <OutlinedInput
                                                    endAdornment={
                                                    <InputAdornment position="end">
                                                        <AttachMoneyIcon sx={{justifySelf: 'flex-end'}}/>
                                                    </InputAdornment>
                                                    }
                                                    label={formInfo.brute_value == 0 ? t("discountValue") : ''}
                                                    onChange={(e) => {setFormInfo((prev) => ({...prev, discount_value: Number(e.target.value)}))}}
                                                />
                                            </FormControl>
                                        </div>
                                    </div>
                                    <div style={{
                                                display: 'flex',
                                                width: '100%',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}>
                                                <LoadingButton sx={openMapButtonStyle} onClick={(e) => {e.preventDefault(); handleOpenMapModal();}}>
                                                            Selecionar Local
                                                </LoadingButton>
                                            </div>
                                    {/* <DynamicMap onSelectLocal={selectLocal}/> */}
                                    <div style={{display: 'flex', flexDirection: 'row', gap: '1rem', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
                                        <LoadingButton loading={loading} onClick={(e)=>{e.preventDefault(); setActiveStep((prev) => prev -1)}} type='submit' sx={buttonStyle}>{t("back")}</LoadingButton>
                                        <LoadingButton loading={loading} onClick={(e)=>{e.preventDefault(); setActiveStep((prev) => prev +1)}} sx={buttonStyle}>{t("next")}</LoadingButton>
                                    </div>
                                </form>
                                )}
                                {activeStep == 2 && (
                                    <form className={styles.formContainer}>
                                        <Box sx={{backgroundColor: 'rgba(232, 232, 232, 0.5)'}}>
                                                <FileInput/>
                                        </Box>
                                        <div style={{display: 'flex', flexDirection: 'row', gap: '1rem', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
                                            <LoadingButton loading={loading} onClick={(e)=>{e.preventDefault(); setActiveStep((prev) => prev -1)}} type='submit' sx={buttonStyle}>{t("back")}</LoadingButton>
                                            <LoadingButton loading={creatingCard} onClick={(e)=>{e.preventDefault(); sendData()}} sx={buttonStyle}>{t("finish")}</LoadingButton>
                                        </div>
                                    </form>
                                )}
                                <div style={{}}>

                                </div>
                            </>
                        )}
                    </Card>
                </div>
                </>
            ) : (
                <CircularProgress/>
            )}
        </div>
    )
}