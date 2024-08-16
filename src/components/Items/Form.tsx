/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import * as React from "react";
import {
  Alert,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  TextareaAutosize,
} from "@mui/material";

import { SelectChangeEvent } from "@mui/material/Select";
import { useFormData } from "./stateManagement/FormDataContext";
import { ScanAppService } from "../../services/ScanAppService";
import { useParams, Link, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useConfig } from "../../config/config";
// import {decode as base64_decode, encode as base64_encode} from 'base-64';
import { RippleLoader } from "../Loader/RippleLoader";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
export const Form = () => {
  const { tenant } = useParams();
  const config: any = useConfig();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // let encoded = base64_encode('YOUR_DECODED_STRING');
  // let decoded = base64_decode('YOUR_ENCODED_STRING');
  const {
    itemDetails,
    setItemDetails,
    fileSrc,
    setFileSrc,
    expiredOn,
    setExpiredOn,
    text,
    setText,
  } = useFormData();
  const [response, setResponse] = useState({ message: "", statusCode: 0 });
  const tdata = config?.data[0];
  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    const fileReader = new FileReader();

    fileReader.onload = (e: any) => {
      const src = e.target.result;
      setFileSrc(src);
    };

    if (file) {
      fileReader.readAsDataURL(file);
    }
  };
  // let isFormFieldValid = false;
  // const [isFormFieldValid, setIsFormFieldValid] = useState(false);
  const [errors, setErrors] = useState({
    itemDetails: {
      itemName: "",
      amount: "",
      offerPrice: "",
      description: "",
      spiceLevel: "",
      isSpecial: false,
    },
  });
  const onBlurItemDetails = (fieldName: any) => () => {
    if (!itemDetails[fieldName]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        itemDetails: {
          ...prevErrors.itemDetails,
          [fieldName]: "This field is required.",
        },
      }));
    } else if (fieldName === "offerPrice") {
      if (Number(itemDetails.amount) <= Number(itemDetails.offerPrice)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          itemDetails: {
            ...prevErrors.itemDetails,
            [fieldName]: "Offer Price should be less than Item Price",
          },
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          itemDetails: {
            ...prevErrors.itemDetails,
            [fieldName]: "",
          },
        }));
      }
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        itemDetails: {
          ...prevErrors.itemDetails,
          [fieldName]: "",
        },
      }));
    }
  };
  function dateStringToMilliseconds(dateString: string) {
    // Convert to Date object
    const dateObject = new Date(dateString);

    // Get the Unix timestamp in seconds
    const unixTimestampInSeconds = dateObject.getTime() / 1000;

    // Convert to milliseconds
    const timestampInMilliseconds = unixTimestampInSeconds * 1000;

    return timestampInMilliseconds + "";
  }
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const hoverStyle = {
    backgroundColor: isHovered ? config?.data[0]?.primary_color : '',
    color: isHovered ? config?.data[0]?.secondary_color : '',
    // borderRadius: '15px',
    padding: '10px'
  }
  React.useEffect(() => {
    // console.log("path333333333", location.hash.includes('/addItems'))
    // Check if the URL contains "/addItems"
    if (sessionStorage.isLogin) {
      if (location.hash.includes("/addItems")) {
        // Update itemDetails state with an empty object
        setText("Save");
        setFileSrc(
          "http://h-app-scanner.s3-website-ap-southeast-2.amazonaws.com/food_img.png"
        );
        setItemDetails({
          itemName: "",
          amount: "",
          offerPrice: "",
          description: "",
          spiceLevel: "",
          isSpecial: false,
          is_veg: false,
          mongoId: "",
        });
        // const newDate = new Date();
        // let cus_exp_date = `${(newDate.getMonth() + 1) <= 9 ? '0'+(newDate.getMonth() + 1) : (newDate.getMonth() + 1)}/${(newDate.getDate() + 1) <= 9 ? '0'+(newDate.getDate() + 1) : (newDate.getDate() + 1)}/${newDate.getFullYear()}`;
        // setExpiredOn(cus_exp_date)
      }
    } else {
      alert("You are not authorized to access!!");
      if (location.href.includes("addItems")) {
        window.location.href = location.href.replace("addItems", "tenantLogin");
      }
    }
  }, [location.pathname]);
  const handleSubmit = async () => {
    let isFormValid = false;
    // event.preventDefault();
    // Perform onBlur validation for all fields
    onBlurItemDetails("itemName")();
    onBlurItemDetails("amount")();
    onBlurItemDetails("offerPrice")();
    onBlurItemDetails("description")();
    onBlurItemDetails("spiceLevel")();
    // If there are any validation errors, prevent form submission
    if (
      itemDetails.itemName == "" ||
      itemDetails.amount == "" ||
      itemDetails.offerPrice == "" ||
      itemDetails.description == "" ||
      Number(itemDetails.offerPrice) >= Number(itemDetails.amount)
      // ||
      // itemDetails.spiceLevel == ""
    ) {
      isFormValid = false;
    } else {
      isFormValid = true;
    }
    try {
      if (isFormValid) {
        setIsLoading(false);
        if (itemDetails?.mongoId) {
          const res = await ScanAppService.updateItem({
            _id: itemDetails.mongoId,
            updated_by: tdata?._id,
            tenant_id: tdata?._id,
            name: itemDetails.itemName,
            url: fileSrc,
            // "is_special": itemDetails.isSpecial,
            item_price: itemDetails.amount,
            promotional_price: itemDetails.offerPrice,
            is_promotional_applicable: false,
            is_coupon_applicable: false,
            coupon_code: "",
            created_by: tdata?._id,
            item_desc: itemDetails.description,
            expired_on: dateStringToMilliseconds(expiredOn.toString()),
            spicy_level: itemDetails.spiceLevel,
            is_special: itemDetails.isSpecial,
            is_veg: itemDetails.is_veg,
          });
          if (res) {
            setResponse({
              message: "Item updated successfully",
              statusCode: res.status,
            });
            setTimeout(() => {
              navigate(`../${tenant}/dashBoard`, { replace: true });
            }, 3000);
            // setItemDetails({
            //   itemName: "",
            //   amount: "",
            //   offerPrice: "",
            //   description: "",
            //   spiceLevel: "",
            //   isSpecial: false,
            //   is_veg: false,
            //   mongoId: "",
            // });
          }
        } else {
          const res = await ScanAppService.postItem({
            tenant_id: tdata?._id,
            name: itemDetails.itemName,
            url: fileSrc,
            // "is_special": itemDetails.isSpecial,
            item_price: itemDetails.amount,
            promotional_price: itemDetails.offerPrice,
            is_promotional_applicable: false,
            is_coupon_applicable: false,
            coupon_code: "",
            created_by: tdata?._id,
            item_desc: itemDetails.description,
            expired_on: dateStringToMilliseconds(expiredOn.toString()),
            spicy_level: itemDetails.spiceLevel,
            is_special: itemDetails.isSpecial,
            is_veg: itemDetails.is_veg,
          });
          if (res) {
            setResponse({
              message: " Item Added successfully",
              statusCode: res.status,
            });
            setItemDetails({
              itemName: "",
              amount: "",
              offerPrice: "",
              description: "",
              spiceLevel: "",
              isSpecial: true,
            });
          }
          setTimeout(() => {
            navigate(`../${tenant}/dashBoard`, { replace: true });
          }, 3000);
        }
      }

      // Frame the formData object based on the form field values
    } catch (error: any) {
      console.log("Error posting or updating data:", error);
      console.log(error?.response?.data);
      // Handle errors while posting or updating data
    } finally {
      setIsLoading(true);
    }
  };
  console.log(
    "expired on",
    dateStringToMilliseconds(expiredOn.toString()),
    expiredOn
  );
  const [age, setAge] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value);
  };
  const handlerForVeg = (event: any) => {
    setItemDetails({ ...itemDetails, is_veg: event.target.checked });
    // Perform any additional actions based on the status here
  };
  const handlerForSpecial = (event: any) => {    
    // Perform any additional actions based on the status here
    const all_specials = JSON.parse(sessionStorage?.all_special_items);
    const total_specials = all_specials.length;
    sessionStorage.totalActiveItems = total_specials;    
    if(total_specials < 5) {
      errors.itemDetails.isSpecial = false;
      setItemDetails({ ...itemDetails, isSpecial: event.target.checked });
    } else if(total_specials == 5 && !event.target.checked){      
      errors.itemDetails.isSpecial = false;
      setItemDetails({ ...itemDetails, isSpecial: event.target.checked });
    } else {
      errors.itemDetails.isSpecial = true;
    }
  };
  return (
    <div className="register-form p-5 needs-validation" id="register-form">
      {response.statusCode == 200 && (
        <Alert onClose={() => {}}>{`${response.message}`}</Alert>
      )}
      <div>
        {isLoading ? (
          <div>
            <fieldset className="scheduler-border">
              <legend className="scheduler-border">Item Details</legend>
              <div className="control-group">
                <div className="row g-3">
                  <div className="col-md-6">
                    <FormControl sx={{ m: 1, width: "100%" }}>
                      <TextField
                        required
                        id="outlined-basic"
                        fullWidth
                        label="Item Name"
                        multiline
                        variant="outlined"
                        value={itemDetails.itemName}
                        onChange={(e) => {
                          const id = e.target.value
                            .replace(/^\s+/, "")
                            .replace(/\s{2,}/g, " ")
                            .replace(/[^a-zA-Z0-9 ]/g, "");
                          // const id = e.target.value.trim().replace(/\s{2,}/g, ' ').replace(/[^a-zA-Z0-9 ]/g, '')
                          setItemDetails({ ...itemDetails, itemName: id });
                        }}
                        size="small"
                        onBlur={onBlurItemDetails("itemName")}
                        error={!!errors.itemDetails.itemName}
                        helperText={errors.itemDetails.itemName}
                        inputProps={{ maxLength: 50 }}
                      />
                    </FormControl>
                  </div>
                  <div className="col-md-6">
                    <FormControl sx={{ m: 1, width: "100%" }}>
                      <TextField
                        required
                        id="outlined-basic"
                        fullWidth
                        label="Item Price"
                        multiline
                        variant="outlined"
                        value={itemDetails.amount}
                        
                        onChange={(e) => {
                          const amount = e.target.value.replace(
                            /^[^0-9]/g,
                            ""
                          );
                          setItemDetails({ ...itemDetails, amount: amount });
                        }}
                        // onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                        size="small"
                        onBlur={onBlurItemDetails("amount")}
                        error={!!errors.itemDetails.amount}
                        helperText={errors.itemDetails.amount}
                        inputProps={{ maxLength: 5 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              {" "}
                              {tdata.currency_code == "AUD" ||
                              tdata.currency_code == "US"
                                ? "$"
                                : "₹"}
                            </InputAdornment>
                          ),
                        }}
                      />
                    </FormControl>
                  </div>
                  <div className="col-md-6">
                    <FormControl sx={{ m: 1, width: "100%" }}>
                      <TextField
                        required
                        id="outlined-basic"
                        fullWidth
                        label="Offer Price"
                        multiline
                        variant="outlined"
                        value={itemDetails.offerPrice}
                        onChange={(e) => {
                          const offerPrice = e.target.value.replace(
                            /^[^0-9]/g,
                            ""
                          );
                          // if(itemDetails.offerPrice < itemDetails.amount) {
                          setItemDetails({
                            ...itemDetails,
                            offerPrice: offerPrice,
                          });
                          // }
                        }}
                        // onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                        size="small"
                        onBlur={onBlurItemDetails("offerPrice")}
                        error={!!errors.itemDetails.offerPrice}
                        helperText={errors.itemDetails.offerPrice}
                        inputProps={{ maxLength: 5 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              {tdata.currency_code == "AUD" ||
                              tdata.currency_code == "US"
                                ? "$"
                                : "₹"}
                            </InputAdornment>
                          ),
                        }}
                      />
                    </FormControl>
                  </div>
                  <div className="col-md-6">
                    <FormControl sx={{ m: 1, width: "100%" }}>
                      <TextareaAutosize
                        required
                        id="outlined-basic"
                        minRows={4} // Adjust the number of rows as needed
                        placeholder="Description"
                        style={{
                          width: "100%",
                          padding: "8px",
                          // border: itemDetails.description == "" && !isFormFieldValid ? "1px solid red" : "1px solid #ccc",
                          borderRadius: "5px",
                          fontSize:"14px",
                          borderColor:
                            errors.itemDetails.description != ""
                              ? "red"
                              : "#ccc",
                        }}
                        value={itemDetails.description}
                        onChange={(e) => {
                          const description = e.target.value;
                          setItemDetails({
                            ...itemDetails,
                            description: description,
                          });
                        }}
                        onBlur={onBlurItemDetails("description")}
                        // error={!!errors.itemDetails.description}
                        // helperText={errors.itemDetails.description}
                        maxLength={250} // You can set the maxLength directly on TextareaAutosize
                      />
                      {errors.itemDetails.description && (
                        <FormHelperText error>
                          {errors.itemDetails.description}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </div>

                  <div className="col-md-6">
                    <FormControl sx={{ m: 1, width: "100%" }}>
                      <TextField
                        id="outlined-basic"
                        fullWidth
                        label="Spice Level on a scale of 1-5"
                        multiline
                        variant="outlined"
                        value={itemDetails.spiceLevel}
                        onChange={(e) => {
                          const spiceLevel = e.target.value.replace(
                            /[^1-5]/g,
                            ""
                          );
                          // const spiceLevel = e.target.value.trim().replace(/\s{2,}/g, ' ').replace(/[^a-zA-Z0-9 ]/g, '')
                          setItemDetails({
                            ...itemDetails,
                            spiceLevel: spiceLevel,
                          });
                        }}
                        size="small"
                        // onBlur={onBlurItemDetails("spiceLevel")}
                        // error={!!errors.itemDetails.spiceLevel}
                        // helperText={errors.itemDetails.spiceLevel}
                        inputProps={{ maxLength: 1 }}
                      />
                    </FormControl>
                  </div>
                  <div className="col-md-6">
                    <FormControl sx={{ m: 1, width: "100%" }} size="small">
                      <InputLabel id="demo-select-small-label">
                        Coupoun codes
                      </InputLabel>
                      <Select
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        value={age}
                        label="Coupoun code"
                        onChange={handleChange}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                      </Select>
                    </FormControl>
                  </div>

                  <div className="col-md-6">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["DatePicker"]}>
                        <DatePicker
                          label="Expired On"
                          value={expiredOn}
                          disablePast
                          // value={value}
                          className="datePickerWrapper"
                          onChange={(newValue) => {
                            setExpiredOn(newValue);
                            console.log("new", newValue);
                          }}
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </div>
                  <div className="switchWrapper">
                    <div className="col-md-6">
                      <FormControlLabel
                        sx={{ m: 1, width: "100%" }}
                        control={
                          <Switch
                            checked={itemDetails.isSpecial}
                            onChange={handlerForSpecial}
                          />
                        }
                        label="Is Special"
                      />
                      {sessionStorage.totalActiveItems == 5 && (
                        <Alert severity="info">Maximum 5 special items are allowed.</Alert>
                      )}
                      
                    </div>
                    <div className="col-md-6">
                      <FormControlLabel
                        sx={{ m: 1, width: "100%" }}
                        control={
                          <Switch
                            checked={itemDetails.is_veg}
                            onChange={handlerForVeg}
                          />
                        }
                        label={itemDetails.is_veg ? "Is Veg" : "Non Veg"}
                      />
                    </div>
                  </div>
                  <div
                    className="col-md-12"
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <FormControl sx={{ m: 1 }}>
                      <div className="avatar-upload">
                        <div className="avatar-edit">
                          <input
                            type="file"
                            id="imageUpload"
                            accept=".png, .jpg, .jpeg"
                            onChange={handleFileChange}
                          />
                          <label htmlFor="imageUpload"></label>
                        </div>
                        <div className="item-preview">
                          {/* <div id="imagePreview" style={{background: "url(http://i.pravatar.cc/500?img=7);"}}> */}
                          {console.log(fileSrc)}
                          {fileSrc && (
                            <img
                              src={fileSrc}
                              id="imagePreview"
                              alt="Selected file"
                            />
                          )}
                          {/* </div> */}
                        </div>
                      </div>
                    </FormControl>
                  </div>
                </div>
              </div>
            </fieldset>
            <div className="col-12">
              {!itemDetails?.mongoId && (
                <FormControl sx={{ m: 1 }}>
                  <Link to={`/${tenant}/dashBoard`}>
                    <div className="backArrow" onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave} style={hoverStyle}>
                      <ArrowBackIcon />
                    </div>
                  </Link>
                </FormControl>
              )}
              <FormControl sx={{ m: 1, float: "right" }}>
                <button
                  type="button"
                  className="btn custom-primary-btn"
                  onClick={handleSubmit}
                  style={{
                    background: `${config?.data[0]?.primary_color}`,
                    color: `${config?.data[0]?.secondary_color}`,
                  }}
                >
                  <span>{text}</span>
                </button>
              </FormControl>
            </div>
          </div>
        ) : (
          <div>
            {" "}
            <RippleLoader />
          </div>
        )}
      </div>
    </div>
  );
};
