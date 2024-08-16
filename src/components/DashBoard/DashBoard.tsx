/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useParams } from "react-router-dom";
// import { menuItems } from '../../Appconstant';
import "../layouts/Latest/Latest.scss";
import "./DashBoard.scss";
import { useEffect, useState } from "react";
import { ScanAppService } from "../../services/ScanAppService";
import { Button } from "react-bootstrap";
import { useConfig } from "../../config/config";
import { EditItemPopup } from "./EditItemPopup";
import DeleteItem from "./DeleteItem";
import { useFormData } from "../Items/stateManagement/FormDataContext";
import { RippleLoader } from "../Loader/RippleLoader";
import Switch from "@mui/material/Switch";
// import RefreshTwoToneIcon from '@mui/icons-material/RefreshTwoTone';
import {
  Alert,
  AlertTitle,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Icon
} from "@mui/material";

// import { menuItems } from '../../../Appconstant';
export const DashBoard = () => {
  const { tenant } = useParams();
  const { menuItems, setMenuItems } = useFormData();
  const [loading, setLoading] = useState(false);
  const config: any = useConfig();
  const tdata = config?.data[0];
  const [response, setResponse] = useState({ message: "", statusCode: 0 });
  const [open, setOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("Are you sure want to update?");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  // const [isExpirationStatus, setIsExpirationStatus] = useState(false);
  // let isExpirationStatus: boolean = false;
  
  // const checkExpiration = (expiration: any) => {
  //   try {
  //     // console.log(`<<<<<<<<<<checkExpiration :: ${expiration}`);
  //     if (!isNaN(expiration)) return true;
  //     console.log(`<<<<<<<<<<checkExpiration :: ${expiration}`);
  //     const currentTime: any = (new Date()).getTime();
  //     const expStatus = currentTime < prepareCustomDate(expiration);
  //     console.log(`<<<<<<<<<<prepareCustomDate :: ${prepareCustomDate(expiration)}======currentTime >= prepareCustomDate(expiration) ${expStatus}`);
  //     isExpirationStatus = expStatus
      
  //     return expStatus;
  //   } catch (err: any) {
  //     console.error(err);
  //     return false;
  //   }

  // }
  
  const prepareCustomDate = (nDate: any) => {
    if (!nDate) return (new Date()).getTime();
    const custDate = new Date(nDate);
    // return `${custDate.getFullYear()}-${custDate.getMonth()}-${custDate.getDate()}`;
    return custDate.getTime();
  };
  const findMenuItemsLength = (menuItems: any) => {
    return menuItems.filter((item: any) => {
      // console.log(`item 22222222222 ====> `, item, "(new Date()).getTime() >= prepareCustomDate(item.expired_on)==", (new Date()).getTime() >= prepareCustomDate(item.expired_on))
       return item.is_special && item.status && prepareCustomDate(item.expired_on) >= (new Date()).getTime() 
      }
    );
  }
  const handleClose = () => {
    updateMenuItems("handleClose");
    setIsButtonDisabled(false);
    setOpen(false);
  };
  const updateMenuItems = (type: String) => {
    const currentMenuItemFromSession = sessionStorage.currentMenuItem
      ? JSON.parse(sessionStorage.currentMenuItem)
      : "";
    console.log(
      `from ${type} :: currentMenuItemFromSession========>`,
      currentMenuItemFromSession
    );
    if (currentMenuItemFromSession != "") {
      menuItems[currentMenuItemFromSession?.currentIndex]["is_special"] = currentMenuItemFromSession?.isSpecial;
      setMenuItems(menuItems);
    }
  };
  const checkAllowedSpecials = (isSpecialNew: boolean) => {
    try {
      // alert(isSpecialNew)
      
      const menuItemsLength = findMenuItemsLength(menuItems).length;
      sessionStorage.totalActiveItems = menuItemsLength;
      // alert(`In checkAllowedSpecials---> ${sessionStorage.totalActiveItems}`);
      return (isSpecialNew && menuItemsLength < 5) || (!isSpecialNew && menuItemsLength <= 5);
    } catch (err) {

    }
  }
  const confirmToUpdateSpecial = async () => {
    const currentMenuItemFromSession = sessionStorage.currentMenuItem
      ? JSON.parse(sessionStorage.currentMenuItem)
      : "";
    console.log(
      `currentMenuItemFromSession========>`,
      currentMenuItemFromSession
    );
    // updateMenuItems("confirm");
    // return;
    try {
      if (currentMenuItemFromSession != "" && checkAllowedSpecials(currentMenuItemFromSession?.isSpecialNew)) {
        setLoading(true);
        const res = await ScanAppService.updateASpecial({
          _id: menuItems[currentMenuItemFromSession?.currentIndex]["_id"],
          is_special: currentMenuItemFromSession?.isSpecialNew,
          updated_by: tdata?._id,
          currentIndex: currentMenuItemFromSession?.currentIndex,
        });
        if (res?.data?.statusCode === 200) {
          setLoading(false);
          menuItems[currentMenuItemFromSession?.currentIndex]["is_special"] =
            currentMenuItemFromSession?.isSpecialNew;
          setMenuItems(menuItems);          
          const all_Special_items = findMenuItemsLength(menuItems);
          const menuItemsLength = all_Special_items.length;
          sessionStorage.totalActiveItems = menuItemsLength;
          sessionStorage.__specialMenuItemsLength = menuItemsLength;
          sessionStorage.all_special_items = JSON.stringify(all_Special_items);   
          // }
          // alert(`In ConfirmUpdate---> ${sessionStorage.totalActiveItems}`);
          setResponse({
            message: "Item updated successfully",
            statusCode: res?.data?.statusCode,
          });
          setTimeout(() => {

            setOpen(false);
            setResponse({ message: "", statusCode: 0 });
          }, 1000);
        }
      } else {
        setDialogTitle("Sorry, Max 5 special items are allowed.");
        setIsButtonDisabled(true);
        setTimeout(() => {
          setOpen(false);
        }, 1500)
      }
    } catch (err: any) {

    } finally {
      setLoading(false);
    }
  };
  const handleChange = (event: any, menuItems: any, index: any) => {
    console.log("handleChange -------------> ", event.target.checked);
    // if (isExpirationStatus) {
    //   setDialogTitle("You are not allowed to update as a 'special' for expired items");
    //   setIsButtonDisabled(true);
    // } else {
      setDialogTitle("Are you sure want to update?");
      setIsButtonDisabled(false);
      sessionStorage.currentMenuItem = JSON.stringify({
        currentIndex: index,
        isSpecial: menuItems[index]["is_special"],
        isSpecialNew: event.target.checked,
      });
      if (menuItems[index]["is_special"])
        menuItems[index]["is_special"] = event.target.checked;
      setMenuItems(menuItems);
    // }


    setOpen(true);

    // console.log(`menuItems handle change:::========================>>>>>>>`, menuItems[index])
  };

  const fetchData = async () => {
    try {
      if (sessionStorage.isLogin) {
        setLoading(true);
        const res = await ScanAppService.getItems(tdata?._id);

        console.log("res fro", res);
        if (res?.data?.data) {
          //check if data is defined ...
          const data = res.data.data;
          // setMenuItems(res.data.data);
          // sessionStorage.menuItem = JSON.stringify(data);
          setMenuItems(
            data
            // .filter((item: any) => item.is_special && item.status == true)
          );
          const all_Special_items = findMenuItemsLength(data);
          const menuItemsLength = all_Special_items.length;
          sessionStorage.totalActiveItems = menuItemsLength;
          sessionStorage.__specialMenuItemsLength = menuItemsLength;
          sessionStorage.all_special_items = JSON.stringify(all_Special_items);

          // alert(`In fetchData---> ${sessionStorage.totalActiveItems}`);
          console.log(`-----------------------sessionStorage.totalActiveItems==============${sessionStorage.totalActiveItems}`)
          setLoading(false);
          // setMenuItems(data);
        }
      } else {
        alert("You are not authorized to access!!");
        // let host = location.href;
        // host
        if (location.href.includes("dashBoard")) {
          window.location.href = location.href.replace(
            "dashBoard",
            "tenantLogin"
          );
        }
      }

      // Frame the formData object based on the form field values
    } catch (error) {
      setLoading(false);
      console.error("Error posting or updating data:", error);
      // Handle errors while posting or updating data
    }
  };
  const checkMenuItemsLength = (allowedLength: Number) => {
    return menuItems.length < allowedLength;
  }
  const refreshItems = () => {
    fetchData();
  }
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    console.log("menuu Items", menuItems);
  }, [menuItems]);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const hoverStyle = {
    backgroundColor: isHovered ? config?.data[0]?.primary_color : '',
    color: isHovered ? config?.data[0]?.secondary_color : '',
    borderRadius: '20px',
    padding: '10px'
  }


  return (
    <div className="Latest minHeight">
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {dialogTitle}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {/* {statusFlag != "" && (
              <div>
                <Alert onClose={() => {}}>{`${statusFlag}`}</Alert>
              </div>
            )} */}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {!isButtonDisabled && (
            <Button onClick={confirmToUpdateSpecial}>
              Yes
            </Button>
          )}

          <Button onClick={handleClose} autoFocus>
            {isButtonDisabled ? "Ok" : "No"}
          </Button>
        </DialogActions>
      </Dialog>
      <span style={{ paddingTop: "20px;" }}>
        {response.statusCode == 200 && (
          // <Alert onClose={() => {}} >{`${response.message}`}</Alert>
          <Alert severity="success">
            <AlertTitle>Success</AlertTitle>
            {response.message}
          </Alert>
        )}
      </span>
      {loading ? (
        <RippleLoader />
      ) : (
        <section className="section menu" id="menu">
          <div className="buttonWrapperr">

          </div>

          {/* <div className="menu-container container">
          <div className="menu-content">
            <div className="menu-items">
              {menuItems.slice(0,5).map((menuItem:any, index:any) => (
                <div className="menu-item flex" key={index}>
                  <img src={menuItem.url} alt="" className="menu-img" />
                  <div className="menuItem-details">
                    <h6 className="menuItem-topic">{menuItem.name}</h6>
                    <p className="menuItem-des">{menuItem.name}</p>
                    <div className='spice'>
                      {[...Array(menuItem.spiceLevel)].map((_, index) => (
                        <img key={index} src='https://h-app-scanner.s3.ap-southeast-2.amazonaws.com/img/chilli.png' alt='hi'/>
                      ))}
                    </div>
                  </div>
                  <div className="menuItem-price flex">
                    <span className="discount-price">{menuItem.item_price}{menuItem.currency_code}</span>
                    <span className="real-price">{menuItem.promotional_price}{menuItem.currency_code}</span>
                  </div>
                </div>
              ))}
            </div>
</div>
        </div> */}
          <div className="" style={{ margin: "50px" }}>
            <div className="row">
              <div className="col-12">
                <div className="card my-4 tableScroll">
                  <div className="card-header row p-0 position-relative  mx-3 z-index-2 border-radius-lg mt-4 pt-4 pb-3" style={{
                    background: `${config?.data[0]?.primary_color}`,
                    color: `${config?.data[0]?.secondary_color}  !important`,
                  }}>
                    <div
                      className="col-6"

                    >
                      <h4
                        className="text-capitalize ps-3"
                        style={{ color: `${config?.data[0]?.secondary_color}` }}
                      >
                        Manage Your Items
                      </h4>
                    </div>

                    <div className="col-6 text-right addItemBtn">
                      <div className="row">
                        <div className="col-12">
                          {checkMenuItemsLength(15) && (
                            <div className="add-refresh-container">
                              <div>
                            <Link style={{ "padding": "0px" }}  to={`/${tenant}/addItems`}>
                              {/* style={{background: `${config?.data[0]?.primary_color} !important`, color: `${config?.data[0]?.secondary_color}  !important`}}  */}
                              <Button title="Click to Add an Item"  onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                style={hoverStyle}
                                variant="contained"
                              // style={{
                              //   background: `${config?.data[0]?.primary_color}`,
                              //   color: `${config?.data[0]?.secondary_color} `,
                              // }}
                              >
                                {/* <AddIcon/> */}
                                <Icon baseClassName="fas" className="fa-plus-circle" color="primary" sx={{ color: `${config?.data[0]?.secondary_color}` }} />  Add Item
                              </Button>
                            </Link>
                            </div>
                            <div className="visible" style={{ "textDecoration": "pointer"}} onClick={refreshItems} title="Refresh to Load new Items" >
                          {/* <RefreshTwoToneIcon className="decor"></RefreshTwoToneIcon> */}
                          <Button className="decor"
                            variant="contained"><Icon baseClassName="fas" className="fa-sync" color="primary" sx={{ color: `${config?.data[0]?.secondary_color}`,paddingRight:"5px" }} />&nbsp;Refresh</Button>
                        </div>
                            </div>
                          )}
                        </div>
                        

                      </div>

                    </div>
                  </div>
                  <div className="card-body px-0 pb-2">
                    <div className="table-responsive p-0">
                      <table className="table align-items-center justify-content-center mb-0">
                        <thead>
                          <tr>
                            <th className="text-uppercase text-secondary text-lg font-weight-bolder opacity-7">
                              Item Name
                            </th>
                            <th className="text-uppercase text-secondary text-lg font-weight-bolder opacity-7 ps-2">
                              Item Price
                            </th>
                            <th className="text-uppercase text-secondary text-lg font-weight-bolder opacity-7 ps-2">
                              Promotional Price
                            </th>
                            <th className="text-uppercase text-secondary text-lg font-weight-bolder opacity-7 ps-2">
                              Status
                            </th>
                            <th className="text-uppercase text-secondary text-lg font-weight-bolder text-center opacity-7 ps-2">
                              Spicy level
                            </th>
                            <th className="text-uppercase text-secondary text-lg font-weight-bolder text-center opacity-7 ps-2">
                              Update To Special
                            </th>
                            <th className="text-uppercase text-secondary text-lg font-weight-bolder text-center opacity-7 ps-1">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {menuItems.length > 0 &&
                            menuItems
                              // .filter(
                              //   (item: any) =>
                              //     item.is_special && item.status == true
                              // )
                              .slice(0, 15)
                              .map((menuItem: any, index: any) => (
                                <tr>
                                  <td>
                                    <div className="d-flex px-2">
                                      <div>
                                        <img
                                          src={menuItem.url}
                                          alt={menuItem.name}
                                          className="avatar avatar-sm rounded-circle me-2"
                                        />
                                      </div>
                                      <div className="my-auto">
                                        <h6 className="mb-0 font-size-items"  style={{
                    // background: `${config?.data[0]?.primary_color}`,
                    color: `${config?.data[0]?.secondary_color}  !important`,
                  }}>
                                          {menuItem.name}
                                        </h6>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <p className="font-size-items mb-0"  style={{
                    // background: `${config?.data[0]?.primary_color}`,
                    color: `${config?.data[0]?.secondary_color}  !important`,
                  }}>
                                      {menuItem.currency_code == "AUD" ||
                                        menuItem.currency_code == "US"
                                        ? "$"
                                        : "$"}
                                      {menuItem.item_price}
                                    </p>
                                  </td>
                                  <td>
                                    <p className="font-size-items  mb-0"  style={{
                    // background: `${config?.data[0]?.primary_color}`,
                    color: `${config?.data[0]?.secondary_color}  !important`,
                  }}>
                                      {menuItem.currency_code == "AUD" ||
                                        menuItem.currency_code == "US"
                                        ? "$"
                                        : "$"}
                                      {menuItem.promotional_price}
                                    </p>
                                  </td>
                                  <td>
                                    <span className="text-m font-weight-bold font-size-items">
                                      <span className="badge badge-m" style={{ color: menuItem.status && menuItem.is_special ? '#66BB6A' : '#EF5350', border: menuItem.status && menuItem.is_special ? "1px solid #66BB6A" : "1px solid #EF5350" }}>
                                        {menuItem.status && menuItem.is_special
                                          ? "Active"
                                          : "In-Active"}
                                      </span>
                                    </span>
                                  </td>
                                  <td className="align-middle text-center">
                                    {/* <div className="d-flex align-items-center justify-content-center">
                          <span className="me-2 text-xs font-weight-bold">60%</span>
                          <div>
                            <div className="progress">
                              <div className="progress-bar bg-gradient-info" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style={{width: "60%;"}}></div>
                            </div>
                          </div>
                        </div> */}
                                    <div className="spice">
                                      {menuItem.spicy_level != null &&
                                        menuItem.spicy_level > 0 &&
                                        [...Array(menuItem.spicy_level)].map(
                                          (_, index) => (
                                            <img
                                              key={index}
                                              src="https://h-app-scanner.s3.ap-southeast-2.amazonaws.com/img/chilli.png"
                                              alt="hi"
                                            />
                                          )
                                        )}
                                    </div>
                                  </td>
                                  <td style={{ textAlign: "center" }}>
                                    <FormControlLabel
                                      control={
                                        <Switch
                                          checked={menuItem["is_special"]}
                                          onChange={(e) =>
                                            handleChange(e, menuItems, index)
                                          }
                                          name={index}
                                        />
                                      }
                                      label=""
                                    />
                                    {/* <Switch {...label} value={menuItem['is_special']}  defaultChecked={getDefaultChecked(menuItems, index)} onChange={(e) => handleChange(e, menuItems, index)}/> */}
                                    {/*
                                    <Switch
                                      checked={menuItem['is_special']}
                                      // value={menuItem['is_special']}
                                      // onChange={(e) => handleChange(e, menuItems, index)}
                                      inputProps={{ 'aria-label': 'controlled' }}
                                      size="small"
                                      
                                    />
                                    */}
                                  </td>
                                  <td className="align-middle text-center">
                                    <button className="btn btn-link text-secondary mb-0" title="Edit">
                                      {/* <i className="fa fa-edit text-xs"></i> */}
                                      <EditItemPopup
                                        data={menuItem}
                                        id={index}
                                      />
                                    </button>
                                    <button className="btn btn-link text-secondary mb-0" title="Delete">
                                      {/* <i className="fa fa-trash-can  text-xs"></i> */}
                                      <DeleteItem data={menuItem} />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                          {menuItems.length <= 0 && (
                            <tr>
                              <td>
                                <div className="d-flex px-2">
                                  You don't have items. Pls. add new item
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
