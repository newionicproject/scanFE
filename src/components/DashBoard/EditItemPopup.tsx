/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import './Styles.scss'
import EditIcon from '@mui/icons-material/Edit';
import { EditItem } from "./EditItem";
import { useFormData } from "../Items/stateManagement/FormDataContext";
import dayjs from "dayjs";
type Anchor = "top" | "left" | "bottom" | "right";

export const EditItemPopup = ({data}:any) => {
  console.log("EditItemPopup :: data: " + JSON.stringify(data));
  const {  setItemDetails ,setText,setFileSrc , setExpiredOn , setHeader , setShow} = useFormData();
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  console.log("EditItemPopup :: setItemDetails: 2222222");
  React.useLayoutEffect(() => {
      console.log("Edit item details:", data);
      
      setExpiredOn(dayjs(data.expired_on))
      setFileSrc(data.url)
      setItemDetails({ itemName: data.name, mongoId:data._id, amount: data.item_price , offerPrice:data.promotional_price, description:data.item_desc, spiceLevel:data.spicy_level,isSpecial:data.is_special
,is_veg:data.is_veg
      })
      setText("Update")
  }, [data,state]);

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      if (!open) {
        // Reset itemDetails when the drawer is closed
        setItemDetails({ itemName: "", amount: "" , offerPrice:"", cuponCode:"", description:"", spiceLevel:""});
        setHeader("Item Creation")
        setShow(false)
      }
      else{
        setShow(true)

        setHeader("Update Item")
      }
      setState({ ...state, [anchor]: open });
    };

  const list = (
    <Box
      //   sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }},
      height="87vh"
      // width="120px"
      role="presentation"
      // onClick={toggleDrawer("bottom", false)}
      // onKeyDown={toggleDrawer("bottom", false)}
      // style={{background:"#000"}}
    >
      <button
       className="closeicon"
        onClick={toggleDrawer("bottom", false)}
      >
        <CloseIcon  />
      </button>
     <EditItem item={data}/>
    </Box>
  );

  return (
    <div>
      <React.Fragment key={"bottom"}>
        <Button onClick={toggleDrawer("bottom", true)}><EditIcon sx={{ fontSize: 20 }}/></Button>
        <Drawer
          anchor={"bottom"}
          open={state["bottom"]}
          onClose={toggleDrawer("bottom", false)}
                >
          {list}
        </Drawer>
      </React.Fragment>
    </div>
  );
};
