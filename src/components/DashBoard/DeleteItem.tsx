/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DeleteIcon from "@mui/icons-material/Delete";
import { ScanAppService } from "../../services/ScanAppService";
import { useConfig } from "../../config/config";
import { Alert } from "react-bootstrap";
import { useFormData } from "../Items/stateManagement/FormDataContext";

export default function DeleteItem({ data }: any) {
  const config: any = useConfig();
  const tdata = config?.data[0];
  const [open, setOpen] = React.useState(false);
  const [disabled, setDisabled]= React.useState(false)
  const [statusFlag, setStatusFlag] = React.useState("");
  const { menuItems, updateMenuItems } = useFormData();
  console.log("data from item", data);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const deleteItem = async () => {
    try {
      setDisabled(true)
      const res = await ScanAppService.deleteItems({
        _ids: [data._id],
        status: false,
        updated_by: tdata?._id,
      });

      console.log("res", res);
      // setMenuItems(res.data.data);
      if (res && res.data) {
        // setRows(res.data.data);
        if (res?.data?.statusCode === 200) {
          setStatusFlag("success");
          setTimeout(() => {
          setStatusFlag("");
          setOpen(false);
          const data = res?.data?.data[0];
          // setMenuItems(menuItems.filter((item: any) => {
          //   if (item._id == data._id) {
          //       item.status = data.status;
          //   }
          // }))

          updateMenuItems((items: any) => {
            const updatedItems = items.map((item: any) => {
              if (item._id === data._id) {
                // Use a single "=" to update the status property
                item.status = data.status;
              }
              return item;
            });

            return updatedItems;
          });
          console.log("menu Items 111", menuItems);
          // const menuItems = sessionStorage.menuItem
          //   ? JSON.parse(sessionStorage.menuItem)
          //   : [];
          //   console.log(menuItems, menuItems.length);
          //   console.log("2nd ", data);
          // if (menuItems.length && data) {
          //   console.log(" menuitems length");
          // menuItems.filter((item: any) => {
          //   console.log(item._id, data._id);
          //   if (item._id == data._id) {
          //     console.log(item.status);
          //       item.status = data.status;
          //       console.log("item status :: ",item.status);
          //   }
          // });
          //   // sessionStorage.menuItem = JSON.stringify(menuItems);
          // }
          }, 4000);
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
      <Button onClick={handleClickOpen}>
        <DeleteIcon />
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {/* {"Confirmation"} */}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <h4>Are you sure want to Delete an item?</h4>
            {statusFlag != "" && (
              <div>
                <Alert onClose={() => {}}>{`${statusFlag}`}</Alert>
              </div>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={deleteItem} disabled={disabled}>Yes</Button>
          <Button onClick={handleClose} autoFocus>
            No
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
