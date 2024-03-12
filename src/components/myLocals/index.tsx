import { Alert, Box, Button, Card, CircularProgress, Collapse, FormHelperText, MenuItem, Typography } from "@mui/material";
import styles from './styles.module.css';
import { buttonStyle, finishButtonStyle, ibeaconCardModel, mainCard } from "./stylesMui";
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
import { useEffect, useState } from 'react';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import { useTranslation } from 'react-i18next';
import {z} from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";
import { CardsInfo, LoginFormData, categories, formDataInfo, localData, loginFormShceme } from '../../types/types';
import EmailIcon from '@mui/icons-material/Email';
import logo from '../../assets/logo.png';
import ImageIcon from '@mui/icons-material/Image'; 
import { useRouter } from 'next/router';
import { deleteCard, getAllCategories, getAllLocals, getCards, handleCreateCard, handleEmailLogin } from '@/services/backendCalls';
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
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import Tooltip from '@mui/material/Tooltip';
import Modal from '@mui/material/Modal';
import UpdateCard from "../updateCard";
import RefreshIcon from '@mui/icons-material/Refresh';
import CancelIcon from '@mui/icons-material/Cancel';
import AirIcon from '@mui/icons-material/Air';
import CustomPaginationActionsTable from "./myLocalsTable";

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

const updateModalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    height: '90%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

export default function MyLocals() {
    const { t } = useTranslation("global");
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [dataFetched, setDatafetched] = useState(false);
    const {setFiles } = useFileContext();
    const [cardsData, setCardsData] = useState<CardsInfo[]>([]);
    const[deleteVerify, setDeleteVerify] = useState('');
    const[deleteCardId, setDeletecardId] = useState<number | null>();
    const[deleteResponse, setdeleteResponse] = useState<boolean | null>();
    const[showAlert, setShowAlert] = useState(true);
    const[selectedCardId, setSelectedcardId] = useState<number>(0);
    const[refresh, setRefresh] = useState(false)
    //Bloco relacionado a manuseio de Modais
    const [open, setOpen] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const handleOpenUpdateModal = () => setOpenUpdateModal(true);
    const handleCloseUpdateModal = () => {setOpenUpdateModal(false); setRefresh(!refresh)}
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // useEffect(()=> {
    //     const fetchData = async () => {
    //         const response = await getCards();
    //         setCardsData(response);
    //         setDatafetched(true);
    //     };
    //     fetchData();
    // },[refresh]);

    return (
        <div className={styles.mainContainer}>
            <CustomPaginationActionsTable/>
        </div>
    )
}