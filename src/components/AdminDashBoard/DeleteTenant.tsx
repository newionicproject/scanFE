/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import Button from '@mui/material/Button';
import IconButton from "@mui/material/IconButton";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteIcon from "@mui/icons-material/Delete";
import { ScanAppService } from '../../services/ScanAppService';
import { useConfig } from '../../config/config';
import { useTenantFormData } from '../payment/stateManagement/FormDataContext';
import { Alert } from '@mui/material';

export default function DeleteTenant({ data }: any) {
  const [open, setOpen] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false)
  const config: any = useConfig();
  const tdata = config?.data[0];
  const [statusFlag, setStatusFlag] = React.useState("");
  const { rows, setRows } = useTenantFormData();
  console.log("data from dete", data)
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const deleteTenant = async () => {
    try {
      setDisabled(true)
      // const res = await ScanAppService.deleteTenants({
      //   _ids: [data._id],
      //   status: false,
      //   updated_by: tdata?._id ? tdata._id : "superAdmin",
      // });
      const response = await ScanAppService.deleteATenant({
        _id: data._id,
        // status: false,
        updated_by: tdata?._id ? tdata._id : "superAdmin",
      });

      let fdata = data;
      console.log("res", rows);
      // setMenuItems(res.data.data);
      if (response && response.data) {
        // setRows(res.data.data);
        if (response?.data?.statusCode === 200) {
          setStatusFlag(`${fdata.name} Successfully deleted`);
          setTimeout(() => {
            setStatusFlag("");
            setOpen(false);
            setDisabled(false)
          }, 2000)
          const data = response?.data?.data;
          console.log("data 111", data)
          // setMenuItems(menuItems.filter((item: any) => {
          //   if (item._id == data._id) {
          //       item.status = data.status;
          //   }
          // }))

          setRows(data.filter((item: any) => item.status == true));
          // console.log("menu Items 111", rows.filter((item: any) => item.status == true));

        }
      }
      // Frame the formData object based on the form field values
    } catch (error) {
      console.error("Error posting or updating data:", error);
      // Handle errors while posting or updating data
    }
  };


  return (
    <React.Fragment>
      <IconButton color="primary" onClick={handleClickOpen}>
        <DeleteIcon />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you Sure Want to delete Tenant?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {statusFlag != "" && (
              <div>
                <Alert onClose={() => { }}>{`${statusFlag}`}</Alert>
              </div>
            )}
          </DialogContentText>
        </DialogContent>
        {!disabled && (
          <DialogActions>
            <Button onClick={deleteTenant} disabled={disabled}>Yes</Button>
            <Button onClick={handleClose} autoFocus>
              No
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </React.Fragment>
  );
}
