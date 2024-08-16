/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import './Styles.scss'
import { EditTenant } from "./EditTenant";
import EditIcon from '@mui/icons-material/Edit';
import { useTenantFormData } from "../payment/stateManagement/FormDataContext";
import { ScanAppService } from "../../services/ScanAppService";

type Anchor = "top" | "left" | "bottom" | "right";

export const EditTenantPopup = ({item, data}:any) => {

 console.log("EditTenant::: ", item)
  const {
    setTenantDetails,
    setThemeDetails,
    setUserDetails,
    setFileSrc,setDisabled ,setText ,setTenantId,setLocation , setChecked
    
  } = useTenantFormData();
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  React.useEffect(() => {
    console.log("Setting tenant details:", data);
    if(data){
      
    setTenantDetails({tenantName:data.name,email:data.email, displayName: data.display_name });
      
    setThemeDetails({ primaryColor: data.primary_color, secondaryColor: data.secondary_color })
    // setLocation({address: data.address,country: data.country,city: data.city,state:data.state,postalCode: data.postalCode,googleBusinessUrl:data.business_url})
    setLocation({
      googleBusinessUrl: data.business_url,
    });
    setFileSrc(data.url)
    setDisabled(true)
    // setText("update")
    setTenantId(data._id)
    }
  }, [data,state]);
    console.log("itemmm", data)
  

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

      setState({ ...state, [anchor]: open });
      if(open){
      setText("update")
      setChecked(true)
      handleIconClick()
      }
      else{
      setChecked(false)

      setText("Proceed")
      }
    };
    const handleIconClick = async () => {
      setUserDetails({contact:"response.data.data.contact"});
      setLocation({
        address: "response.data.data.address",
        country:" response.data.data.country",
        city: "response.data.data.city",
        state: "response.data.data.state",
        postalCode: "response.data.data.postalCode",
      });
      try {
        // Make an API call here using axios or fetch
        const response = await ScanAppService.getTenantAddressByTenantId(data._id);
        // Process the API response as needed
        console.log('API Response:', response.data.data);
  
        // Update state or perform other actions based on the API response
        if (response.data) {
          setUserDetails({contact:response.data.data.contact});
          setLocation({
            address: response.data.data.address,
            country: response.data.data.country,
            city: response.data.data.city,
            state: response.data.data.state,
            postalCode: response.data.data.postalCode,
          });
         
        }
  
        // Toggle the drawer state after the API call
       
      } catch (error) {
        // Handle errors if the API call fails
        console.error('API Error:', error);
      }
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
     <EditTenant item={item}/>
    </Box>
  );

  return (
    <div>
      <React.Fragment key={"bottom"}>
        <IconButton color="primary" onClick={toggleDrawer("bottom", true)}><EditIcon sx={{ fontSize: 20 }}/></IconButton>
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
