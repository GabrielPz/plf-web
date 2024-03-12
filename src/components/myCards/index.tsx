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

export default function MyCards() {
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
    
    useEffect(()=> {
        const fetchData = async () => {
            const response = await getCards();
            setCardsData(response);
            setDatafetched(true);
        };
        fetchData();
    },[refresh]);

    const handleDeleteCard = async () => {
        if(deleteCardId){
            const response = await deleteCard(deleteCardId);
            setdeleteResponse(response);
            const updatedCardData = cardsData.filter(card => card.id_cupom != deleteCardId);
            setCardsData(updatedCardData);
            setDeletecardId(null);
        }
    }
    return (
        <div className={styles.mainContainer}>
            {dataFetched ? (
                <>
                    {deleteResponse == true && (
                        <Collapse in={showAlert}>
                            <Alert sx={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}  variant="filled" severity="success" onClose={() => {setShowAlert(false)}}>
                                Card excluido com Sucesso !
                            </Alert>
                        </Collapse>
                    )}{deleteResponse == false && (
                        <Collapse in={showAlert}>
                            <Alert sx={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}} variant="filled" severity="error" onClose={() => {setShowAlert(false)}}>
                                Erro ao excluir o card
                            </Alert>
                        </Collapse>
                    )}
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Tem certeza que deseja excluir?
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            Escreva 'Deletar' para excluir o card:
                        </Typography>
                        <FormControl sx={{ width: '100%', mt: 2 }} variant="outlined">
                            <OutlinedInput
                                endAdornment={
                                <InputAdornment position="end">
                                    <DriveFileRenameOutlineIcon sx={{justifySelf: 'flex-end'}}/>
                                </InputAdornment>
                                }
                                onChange={(e) => {setDeleteVerify(e.target.value)}}
                            />
                        </FormControl>
                        <Button variant="contained" sx={{mt: 2}} onClick={(e) => {setOpen(false), setDeleteVerify(''), setDeletecardId(null)}}>Cancelar</Button>
                        <Button variant="contained" sx={{mt: 2, ml: 2, backgroundColor: 'red'}} onClick={(e) => {setOpen(false), setDeleteVerify(''),handleDeleteCard()}} disabled={deleteVerify != 'Deletar' ? true : false}>Deletar</Button>
                        </Box>
                    </Modal>
                    <Modal
                        open={openUpdateModal}
                        onClose={handleCloseUpdateModal}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={updateModalStyle}>
                            <CancelIcon onClick={ () => {handleCloseUpdateModal(); setFiles([])}} sx={{fontSize: '55', position: 'absolute', top: '5%', right: '3%', cursor: 'pointer'}}/> 
                            <UpdateCard id_card={selectedCardId} onClose={handleCloseUpdateModal}/>
                        </Box>
                    </Modal>
                    {cardsData.length == 0 && (
                        <div style={{ gap: '2rem', width: '100%', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                            <AirIcon sx={{fontSize: '10rem', color: '#F46A29'}}/>
                            <Typography variant="h4" color='#F46A29'>
                                Você não possui nenhum card
                            </Typography>
                        </div>
                    )}
                    {cardsData.length > 0 && (
                        <>
                            <Typography variant="h3">
                                Seus Cards
                            </Typography>
                            {cardsData.map((card) => (
                                <>
                                <div className={styles.buttonsRow}>
                                    <Tooltip title='Atualizar' arrow onClick={(e) => {e.preventDefault(); setSelectedcardId(card.id_cupom); handleOpenUpdateModal()}}>
                                        <RefreshIcon sx={{color: 'blue', cursor: 'pointer'}}/>
                                    </Tooltip>
                                    <Tooltip title='Deletar' arrow>
                                        <DeleteIcon sx={{color: 'red', cursor: 'pointer'}} onClick={(e)=>{e.preventDefault(); setOpen(true), setDeletecardId(card.id_cupom)}}/>
                                    </Tooltip>
                                </div>
                                <Card sx={ibeaconCardModel} >
                                    <div className={ card.has_price == 0 ? styles.ibeaconCardModelData : styles.ibeaconCardModelDataWhitoutPrice}>
                                        <Typography variant="body2" sx={{margin: '0 0 0 1rem'}}>
                                            Identificação: {card.name_cupom != '' ? card.name_cupom : 'XXXXXXXX'}
                                        </Typography>
                                        <Typography variant="body2" sx={{margin: '0 0 0 1rem'}}>
                                            Descrição: {card.desc_cupom != '' ? card.desc_cupom : 'XXXXXXXX'}
                                        </Typography>
                                        <Typography variant="body2" sx={{margin: '0 0 0 1rem'}}>
                                            Local: {card.local}
                                        </Typography>
                                        <Typography variant="body2" sx={{margin: '0 0 0 1rem'}}>
                                            Categoria: {card.category}
                                        </Typography>
                                        {card.has_price == 0 && (
                                            <>
                                            <Typography variant="body2" sx={{margin: '0 0 0 1rem'}}>
                                                Valor bruto: {card.brute_value}
                                            </Typography>
                                            <Typography variant="body2" sx={{margin: '0 0 0 1rem'}}>
                                                Desconto: {card.discount_value}
                                            </Typography>
                                            <Typography variant="body2" sx={{margin: '0 0 0 1rem'}}>
                                                Valor Final: {card.value_with_discount}
                                            </Typography>
                                            </>
                                        )}
                                    </div>
                                    <div className={styles.ibeaconCardModelImg}>
                                        <img src={card.img_url} className={styles.ibeaconCardImg}/>
                                    </div>
                                </Card>
                                </>
                            ))}
                        </>
                    )}
                </>
            ) : (
                <CircularProgress/>
            )}
        </div>
    )
}