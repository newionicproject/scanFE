/* eslint-disable @typescript-eslint/no-explicit-any */
import "./AdminDashBoard.scss";

import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { ScanAppService } from "../../services/ScanAppService";
import { RippleLoader } from "../Loader/RippleLoader";
import { EditTenantPopup } from "./EditTenantPopup";
import DeleteTenant from "./DeleteTenant";
import { Alert, TextField, styled } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useTenantFormData } from "../payment/stateManagement/FormDataContext";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
// Dialog ...
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

interface Column {
  id:
    | "name"
    | "email"
    | "url"
    | "primary_color"
    | "secondary_color"
    | "action"
    | "generateQR";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (
    value: string | number,
    column: any
  ) => string | JSX.Element | undefined;
}

export const AdminDashBoard = () => {
  const { rows, setRows, setTenantId } = useTenantFormData();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [loading, setLoading] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  // const [searchText, setSearchText] = React.useState('');
  const [orgData, setOrgData] = React.useState([]);
  // const [offset, setOffset] = React.useState(0);
  const handleChangePage = async (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    console.log("event", event);
    // page scroll is going to set to top 
    setTimeout(() => { 
      window.scrollTo(0, 0);
    }, 200)
    
    // setOffset(offset + rows.length);
    // alert(`offset :: ${offset} newPage :: ${newPage}  rowsPerPage :: ${rowsPerPage}`);
    // await fetchTenantDetailsByPagination(0)
    setPage(newPage);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => { 
    setOpen(false);
  };
  

  const [indexed, setIndexed] = React.useState(1);
  const fetchTenantDetailsByPagination = async (offset: any) => {
    
    const res = await ScanAppService.getTenants(offset + rowsPerPage, rowsPerPage);

      console.log("res", res);
      if(res) {
        setLoading(false);
      }
      // setMenuItems(res.data.data);
      if (res && res?.data && res?.data?.data) {        
        const fdata = res.data.data;
        const filteredData = fdata.filter((item: any) => item.status == true);
        setRows(filteredData); 
        setOrgData(filteredData);
        // setOffset(offset + filteredData.length);
      }
  }
  const handleGenerateQR = async (column: any, index: number) => {
    setIndexed(index);
    setIsLoading(true);
    console.log("iyee", column, index);
    const res = await ScanAppService.genateQR({
      tenantName: column?.name,
      email: column?.email,
    });
    if (res?.data?.data) {
      // setIsNotOnboarded(false);
      setResponse({
        message: res.data.data.message,
        statusCode: res.data.statusCode,
      });
      setTimeout(() => {
        setResponse({ message: "", statusCode: 0 });
        setIsLoading(false);
      }, 3000);
    }
    console.log("res", res, column);
  };
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#6c7ae0",
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  React.useEffect(() => {}, [rows]);

  const columns: readonly Column[] = [
    { id: "name", label: "Name", minWidth: 170 },
    { id: "email", label: "Email", minWidth: 100 },
    {
      id: "url",
      label: "Logo",
      minWidth: 80,
      // align: "right",
      format: (value: string | number) => (
        <img src={String(value)} alt="Logo" />
      ),
    },
    /*{
      id: "currency_code",
      label: "Currency code",
      minWidth: 170,
      align: "right",
      // format: (value: number | string) => value.toLocaleString('en-US'),
    },*/
    // {
    //   id: "primary_color",
    //   label: "Primary Color",
    //   minWidth: 170,
    //   // align: "right",
    //   // format: (value: number | string) => value.toFixed(2),
    // },
    // {
    //   id: "secondary_color",
    //   label: "Secondary color",
    //   minWidth: 170,
    //   // align: "right",
    //   // format: (value: number) => value.toFixed(2),
    // },

    {
      id: "action",
      label: "Action",
      minWidth: 100,
      // align: "right",
      format: (item: any, column: any) => (
        <div style={{ display: "flex" }}>
          <EditTenantPopup item={item} data={column} />
          <DeleteTenant data={column} />
        </div>
      ),
    },
    // {
    //   id: "Delete",
    //   label: "Delete",
    //   minWidth: 170,
    //   align: "right",
    //   format: ( column:any) => <DeleteTenant data={column} />,

    // },
    {
      id: "generateQR",
      label: "Generate QR",
      minWidth: 100,
      // align: "right",
    },
  ];
  const [response, setResponse] = React.useState({
    message: "",
    statusCode: 0,
  });
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  // const [rows, setRows] = React.useState([]);
  const fetchData = async () => {
    try {
      setLoading(true);
      fetchTenantDetailsByPagination(0);
      
      // Frame the formData object based on the form field values
    } catch (error) {
      console.error("Error posting or updating data:", error);
      // Handle errors while posting or updating data
    } finally {
      // setLoading(false); // Set loading to false whether the API call succeeds or fails
    }
  };
  const routeToTenant = () => {
    setTenantId("");
    navigate(`../onboarding`, { replace: true });
  }
  React.useEffect(() => {
    fetchData();
    window.scrollTo(0, 0);
  }, []);

  const logout = () => {
    // alert("Are you sure you want to log out?");
    sessionStorage.clear();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate(`../adminLogin`, { replace: true });
    }, 1000);
  };
  return (
    <div className="adminDashBoard">
      <div className="floatRight">
        {/* Confirmation Dialog */}

        <Dialog
          open={open}
          onClose={handleClose}
          
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Confirmation!!"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <b>Are you sure you want to log out?</b>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>No</Button>
            <Button onClick={logout} autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
        {/* Confirmation Dialog */}

        <Button
          variant="outlined"
          style={{ float: "right", marginBottom: "10px" }}
          onClick={routeToTenant}
        >
          Create a Tenant
        </Button>
        <button type="button" onClick={handleClickOpen}>
          <LogoutIcon style={{ fontSize: "20px", marginBottom: "10px" }} />
        </button>
      </div>
      {loading ? ( // Show loading message or spinner when loading is true
        <RippleLoader />
      ) : (
        <Paper sx={{ width: "100%", overflow: "hidden", height: "calc(100vh - 150px)", overflowY: "scroll"  }}>
          {response.statusCode == 200 && (
            <Alert>QR code is sent to your Registerd Email ID</Alert>
          )}
          {/* sx={{ maxHeight: 440 }} */}
          <TableContainer>
            <div style={{paddingBottom: "10px"}}>
              <TextField id="search"
                        fullWidth
                        label="Search  Tenant/Email"                        
                        variant="outlined"
                        autoComplete="off"
                        onChange={(e: any) => {
                          if(e.target.value.length >= 3){                            
                          const searchTerm = e.target.value;
                          const jRows = rows.filter((row: any) => (row.email.toString().includes(searchTerm) || row.name.toString().includes(searchTerm)))
                          setRows(jRows);
                          console.log("rows...", jRows);              
                          } else {
                            setRows(orgData); 
                          }
                        }}
                        />
            </div>
            <Table stickyHeader aria-label="sticky table">
              <TableHead style={{ background: "red" }}>
                <TableRow>
                  {columns.map((column) => (
                    <StyledTableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </StyledTableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .filter((item: any) => item.status == true)
                  .map((row: any, index: number) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                      <TableCell align="left">{row.name}</TableCell>
                      <TableCell align="left">{row.email}</TableCell>
                      <TableCell >
                        <img src={row.url} alt="Logo" />
                      </TableCell>
                      {/* <TableCell align="right">{row.primary_color}</TableCell>
                      <TableCell align="right">{row.secondary_color}</TableCell> */}
                      <TableCell align="right">
                        <div style={{ display: "flex"}}>
                          <EditTenantPopup item={row} data={row} />
                          <DeleteTenant data={row} />
                        </div>
                      </TableCell>
                      <TableCell >
                        <button
                          className="btn btn-primary"
                          onClick={() => handleGenerateQR(row, index)}
                        >
                          <span>
                            {isLoading && indexed === index ? (
                              <div style={{ width: "50px" }}>
                                <CircularProgress
                                  color="secondary"
                                  size="16px"
                                />
                              </div>
                            ) : (
                              "Generate QR"
                            )}
                          </span>
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}            
            // showFirstButton={true}
            // showLastButton={true}
          />
        </Paper>
      )}
    </div>
  );
};
