import styles from "./styles.module.css";
import useRouter from "next/router";
import { localData } from "@/types/types";
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
import { deleteLocals, getLocalsByClient } from "@/services/backendCalls";
import RefreshIcon from '@mui/icons-material/Refresh';
import { useUpdate } from "@/contexts/UpdateContext";

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
    const [dataArray, setDataArray] = useState<localData[]>([]);
    const [requestApi, setRequestApi] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [page, setPage] = useState(0);
    const [refresh, setRefresh] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [newRender, setNewRender] = useState(false);
    const [boxChecked, setBoxChecked] = useState<number | null>();
    const [inittialDataFetched, setInittialDataFetched] = useState(false);
    const [selectedLocalId, setSelectedLocalId] = useState(999);
    const [openUpdateLocalModal, setOpenUpdateLocalModal] = useState(false);
    const handleOpenUpdateModal = () => setOpenUpdateLocalModal(true);
    const handleCloseUpdateModal = () => {setOpenUpdateLocalModal(false); setRefresh(!refresh)};
    const { refreshState } = useUpdate();
    
    const router = useRouter;
    function handleEditUser() {
        router.push("/user/editUser");
    }

    useEffect(() => {
        const fetchData = async () => {
            const id_client = sessionStorage.getItem('id_client') || '';
            const response = await getLocalsByClient(id_client);
            if (response.status == 200) {
                setDataArray(response?.data);
            }
            if (response.status == 500) {
                alert("Erro ao realizar consulta no banco de dados");
            }
        };
        fetchData();
        setInittialDataFetched(true);
    }, [refresh, refreshState]);

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - dataArray.length) : 0;

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
        const response = await deleteLocals(id);
        if(response.status == 500){
            alert('Erro ao deletar local');
            setShowAlert(false);
            return;
        }
        if(response.status == 200){
            alert('Local e Cards associados deletados com sucesso!');
            setShowAlert(false);
            const updatedDataArray = dataArray.filter((local) => local.ibeacons_id_locals !== id);
            setDataArray(updatedDataArray);
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
                    <TableCell sx={{ fontSize: 29 }}>Nome</TableCell>
                    <TableCell sx={{ fontSize: 29 }}>CPF</TableCell>
                    <TableCell sx={{ fontSize: 29 }}>Endereço</TableCell>
                    <TableCell sx={{ fontSize: 29 }}>Telefone</TableCell>
                    <TableCell sx={{ fontSize: 29 }}>Email</TableCell>
                    <TableCell>Atualizar</TableCell>
                    <TableCell>Deletar</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                    {(rowsPerPage > 0
                        ? dataArray.slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                        )
                        : dataArray
                    ).map((row) => (
                        <TableRow key={row.ibeacons_id_locals}>
                            <TableCell>
                                {row.ibeacon_local}
                            </TableCell>
                            <TableCell>
                                {row.local_lat}
                            </TableCell>
                            <TableCell>
                                {row.local_lng}
                            </TableCell>
                            <TableCell>
                            <IconButton
                                aria-label="update"
                                onClick={() => {
                                    setSelectedLocalId(row.ibeacons_id_locals);
                                    handleOpenUpdateModal();
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
                                            handleDeleteLocals(row.ibeacons_id_locals); // Call handleDeleteLocals function passing the ID
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
                                    Ao deletar este local TODOS os CARDS associados a ele vão ser deletados, tem certeza que deseja deletar?
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

