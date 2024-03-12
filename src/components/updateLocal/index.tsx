import { Alert, Box, CircularProgress, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Typography } from "@mui/material";
import { BoxContainerStyle } from "./stylesMui";
import { useTranslation } from "react-i18next";
import { LoadingButton } from '@mui/lab';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import {z} from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";
import { CreateLocalFinalData, CreateLocalFormData, UpdateLocalData, createLocalFormScheme } from "@/types/types";
import { createLocal, getCepForCard, getLocalById, updateLocalById } from "@/services/backendCalls";
import { useEffect, useState } from "react";
import SearchIcon from '@mui/icons-material/Search';


import dynamic from "next/dynamic";
import { LatLngTuple } from "leaflet";
const DynamicMap = dynamic(() => import('../commons/mapComponent'))

interface UpdateLocalComponentProps {
    onClose: () => void;
    id_local: number;
}

export default function UpdateLocalComponent({onClose, id_local}: UpdateLocalComponentProps) {
    const {t} = useTranslation('global')
    const [inittialDataFetched, setInittialDataFetched] = useState(false);
    const[loading, setLoading] = useState(false);
    const [alertInfo, setAlertInfo] = useState({
        visible: false,
        message: ''
    })
    const handleDismissAlert = () => setAlertInfo({visible: false, message: ''})
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting, isValid }
    } = useForm<CreateLocalFormData>({
        resolver: zodResolver(createLocalFormScheme),
        mode: 'all',
    });

    const[latLngFromCep, setLatLngFromCep] = useState<LatLngTuple>([-15.793889, -47.882778])
    const[cep, setCep] = useState('');
    const[fetchingCep, setFetchingCep] = useState(false);


    const handleUpdateLocal = async (data: CreateLocalFormData) => {
        setLoading(true);
        const localInfo: UpdateLocalData = {
            ibeacon_local: data.name,
            id_locals: id_local,
            local_lat: data.local_lat,
            local_lng: data.local_lon
        } 
        const response = await updateLocalById(localInfo);
        if(response?.status == 200){
            alert(response.message);
            setLoading(false);
            onClose();
            return;
        }
        if(response?.status == 500){
            setAlertInfo({visible: true, message: response.message});
            setLoading(false)
            return;
        }
    }

    useEffect(()=>{
        const fetchData = async () => {
            const response = await getLocalById(id_local);
            if(response.status == 500){
                alert('Erro ao buscar dados do Card');
                onClose();
                setInittialDataFetched(true)
                return;
            }
            if(response.status == 200){
                const data = response.data;
                setValue('name', data.ibeacon_local);
                setValue('local_lat', data.local_lat.toString());
                setValue('local_lon', data.local_lng.toString());
                setInittialDataFetched(true);
                setLatLngFromCep([data.local_lat, data.local_lng]);
            }
        }
        fetchData();
    },[])

    const selectLocal = (latitude: number, longitude: number) => {
        setValue('local_lat', latitude.toString());
        setValue('local_lon', longitude.toString())
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

    return(
        <>
        {alertInfo.visible && (
            <Alert variant="filled" severity="error" onClose={() => {handleDismissAlert()}}>
                {alertInfo.message}
            </Alert>
        )}
        {inittialDataFetched && (
            <Box sx={BoxContainerStyle}>
                <Typography variant="h4">
                    Insira os dados do local
                </Typography>
                <form onSubmit={handleSubmit(handleUpdateLocal)} style={{display: 'flex', gap: '1rem', flexDirection: 'column', width: '100%'}}>
                    <FormControl sx={{ width: '100%' }} variant="outlined">
                        <InputLabel>Nome do local</InputLabel>
                        <OutlinedInput
                        label='Nome do local'
                        {...register('name')}
                        endAdornment={
                            <InputAdornment position="end">
                                <AssignmentIndIcon sx={{justifySelf: 'flex-end'}}/>
                            </InputAdornment>
                        }
                        
                        />
                        {errors.name && <p style={{ color: 'red', marginTop:'0.5rem' }}>{errors.name.message}</p>}
                    </FormControl>
                    <div style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space=between'
                    }}>
                        <FormControl sx={{width: '85%' }} variant="outlined">
                        <InputLabel>CEP</InputLabel>
                        <OutlinedInput
                            label="CEP"
                            placeholder="01153000"
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
                    <div style={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
                        <LoadingButton loading={loading} type="submit" sx={{backgroundColor: '#F46A29', color: '#fff', width: '35%', "&:hover": {backgroundColor: '#F46A29'} }}>
                            Atualizar Local
                        </LoadingButton>
                    </div>
                </form>
            </Box>
        )}
        {!inittialDataFetched && (
            <CircularProgress/>
        )}
        </>
    )
}