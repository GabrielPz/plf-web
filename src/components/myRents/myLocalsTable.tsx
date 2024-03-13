import styles from "./styles.module.css";
import useRouter from "next/router";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import * as React from "react";
import { useTheme } from "@mui/material/styles";
import TableFooter from "@mui/material/TableFooter";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import Box from "@mui/material/Box";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "@/lib/axios";
import { Alert, Avatar, Button, Modal } from "@mui/material";
import { useState, useEffect } from "react";
import RefreshIcon from '@mui/icons-material/Refresh';
import { useUpdate } from "@/contexts/UpdateContext";
import { getAllClients, getAllEquipments, getAllRents } from "@/services/backendCalls";
import { clientData, equipmentData, parsedRentsData, rentsData } from "@/types/types";

const alertStyle = {
    position: 'absolute' as 'absolute',
    top: '20%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
};

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}
export default function CustomPaginationActionsTable() {
    const [dataArray, setDataArray] = useState<rentsData[]>([]);
    const [parsedData, setParsedData] = useState<parsedRentsData[]>([]);
    const [clientsDataArray, setClientsdataArray] = useState<clientData[]>([]);
    const [equipmentsDataArray, setEquipmentsDataArray] = useState<equipmentData[]>([]);
    const [requestApi, setRequestApi] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [page, setPage] = useState(0);
    const [refresh, setRefresh] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [newRender, setNewRender] = useState(false);
    const [inittialDataFetched, setInittialDataFetched] = useState(false);
    const { refreshState } = useUpdate();
    
    const router = useRouter;
    function handleEditUser() {
        router.push("/user/editUser");
    }

    useEffect(() => {
        const fetchData = async () => {
           const response = await getAllRents();
           const responseClients = await getAllClients();
           const responseEquipments = await getAllEquipments();
           if(response.status == 500){
            alert('Erro ao realizar consulta dos alugueis');
            return;
           }

           setDataArray(response?.data);
           setClientsdataArray(responseClients?.data);
           setEquipmentsDataArray(responseEquipments?.data);

        };
        fetchData();
        const parseData = parseEquipmentclientData();
        setParsedData(parseData);
        setInittialDataFetched(true);
    }, [refresh, refreshState]);


    const parseEquipmentclientData = () => {
      return dataArray.map((data) => {
        const client = clientsDataArray.find((client) => client.id === data.cliente_id);
        const equipment = equipmentsDataArray.find((equipment) => equipment.id == data.equipamento_id);
        let status = '';
        if(data.status == 1)status = 'Disponivel';
        if(data.status == 2)status = 'Alugado';
        if(data.status == 3)status = 'Pendente';
        const parsedData: parsedRentsData = {
          cliente: client!.nome_cliente,
          data_inicio: data.data_inicio,
          data_termino: data.data_termino,
          equipamento: equipment!.nome_equipamento,
          status: status,
          valor_total: data.valor_total,
          id: data.id
        }
        return parsedData;
      })
    }

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - parsedData.length) : 0;

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number
    ) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    const handleDeleteLocals = async (id: number) => {
        const response = {status: 500};
        if(response.status == 500){
            alert('Erro ao deletar local');
            setShowAlert(false);
            return;
        }
        if(response.status == 200){
            alert('Local e Cards associados deletados com sucesso!');
            setShowAlert(false);
        }
    };

    return (
        <div style={{width: '80%', maxHeight: '90%'}}>
            {dataArray && (
            <TableContainer component={Paper}>
            <Table sx={{ minWidth: 600, }} aria-label="custom pagination table">
                <TableHead
                    sx={{
                    backgroundColor: "#f0f0f0",
                    fontWeight: "bold",
                    height: "10vh",
                    }}
                >
                <TableRow>
                    <TableCell sx={{ fontSize: 29 }}>Cliente</TableCell>
                    <TableCell sx={{ fontSize: 29 }}>Equipamento</TableCell>
                    <TableCell sx={{ fontSize: 29 }}>Data Inicio</TableCell>
                    <TableCell sx={{ fontSize: 29 }}>Data Término</TableCell>
                    <TableCell sx={{ fontSize: 29 }}>Valor Total</TableCell>
                    <TableCell sx={{ fontSize: 29 }}>Status</TableCell>
                    <TableCell>Atualizar</TableCell>
                    <TableCell>Deletar</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                    {(rowsPerPage > 0
                        ? parsedData.slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                        )
                        : parsedData
                    ).map((row) => (
                        <TableRow key={row.id}>
                            <TableCell>
                                {row.cliente}
                            </TableCell>
                            <TableCell>
                                {row.equipamento}
                            </TableCell>
                            <TableCell>
                                {row.data_inicio}
                            </TableCell>
                            <TableCell>
                                {row.data_termino}
                            </TableCell>
                            <TableCell>
                                {row.valor_total}
                            </TableCell>
                            <TableCell>
                                {row.status}
                            </TableCell>
                            <TableCell>
                            <IconButton
                                aria-label="update"
                                onClick={() => {
                                    // setSelectedLocalId(row.id);
                                    // handleOpenUpdateModal();
                                }}
                                >
                                <RefreshIcon color="primary" />
                            </IconButton>
                            </TableCell>
                            <TableCell>
                                <IconButton
                                    aria-label="delete"
                                    onClick={() => {
                                        setShowAlert(true);
                                    }}
                                    >
                                    <DeleteIcon color="error" />
                                </IconButton>
                                {showAlert && (
                                    <Alert
                                    sx={alertStyle}
                                    variant="filled"
                                    onClose={() => {
                                        setShowAlert(false);
                                    }}
                                    severity="error"
                                    action={
                                        <div>
                                        <Button
                                            color="inherit"
                                            size="small"
                                            onClick={(e: any) => {
                                            e.preventDefault();
                                            handleDeleteLocals(row.id); // Call handleDeleteLocals function passing the ID
                                            setShowAlert(false);
                                            setNewRender(true); // Close the alert after deletion
                                            }}
                                        >
                                            Deletar
                                        </Button>
                                        <Button
                                            color="inherit"
                                            size="small"
                                            onClick={() => {
                                            setShowAlert(false); // Close the alert without deleting
                                            }}
                                        >
                                            Cancelar
                                        </Button>
                                        </div>
                                    }
                                    >
                                    Tem certeza que deseja excluir este cliente?
                                    </Alert>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                    {emptyRows > 0 && (
                        <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                        </TableRow>
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow
                    >
                        <TablePagination
                        rowsPerPageOptions={[5, 10]}
                        colSpan={3}
                        count={dataArray.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        SelectProps={{
                            inputProps: {
                            "aria-label": "rows per page",
                            },
                            native: true,
                        }}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        ActionsComponent={TablePaginationActions}
                        />
                        <TableCell>
                        </TableCell>
                        <TableCell>
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
            </TableContainer>
            )}
        </div>
    );
}
function toggleRefresh() {
    throw new Error("Function not implemented.");
}

