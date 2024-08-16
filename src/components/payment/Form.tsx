/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import * as React from "react";
import {
  Alert,
  // Button,
  FormControl,
  InputAdornment,
  TextField,
  AlertTitle,
  Box,
  Snackbar,
} from "@mui/material";
import { useTenantFormData } from "./stateManagement/FormDataContext";
import { ScanAppService } from "../../services/ScanAppService";
import { useNavigate } from "react-router-dom";
import { useConfig } from "../../config/config";
import { RippleLoader } from "../Loader/RippleLoader";
import './index.scss';
export const Form = () => {
  const {
    tenantDetails,
    setTenantDetails,
    userDetails,
    setUserDetails,
    location,
    setLocation,
    checked,
    setChecked,
    themeDetails,
    setThemeDetails,
    fileSrc,
    setFileSrc,
    disabled,
    setDisabled,
    text,
    tenantId,
  } = useTenantFormData();
  const { rows } = useTenantFormData();
  const navigate = useNavigate();
  const [response, setResponse] = useState({ message: "", statusCode: 0 });
  const [errors, setErrors] = useState({
    tenantDetails: { tenantName: "", email: "", displayName: "" },
    userDetails: {
      name: "",
      email: "",
      contact: "",
    },
    location: {
      address: "",
      country: "",
      city: "",
      state: "",
      postalCode: "",
    },
  });
  // const [isNotOnboarded, setIsNotOnboarded] = useState(false);
  // const [isChecked, setIsChecked] = useState(false);
  const [checkboxError, setCheckboxError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const countryCodes = {
    Australia: {
      country: "AU",
      acceptMobileLength: 9,
      code: "+61",
    },
  };
  const config: any = useConfig();
  const tdata = config?.data[0];
  // Other code (onBlur functions, handleSubmit, etc.)
  const navigateToAdminDash = () => {
    navigate(`../adminDashboard`, { replace: true });
  };
  const [state, setState] = React.useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  const { vertical, horizontal, open } = state;

  const handleClose = () => {
    setState({ ...state, open: false });
  };
  const handleCheckboxChange = (event: any) => {
    setChecked(event.target.checked);
    setCheckboxError("");
  };
  const onBlurtenantDetails = (fieldName: any) => () => {
    if (!tenantDetails[fieldName]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        tenantDetails: {
          ...prevErrors.tenantDetails,
          [fieldName]: "This field is required.",
        },
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        tenantDetails: {
          ...prevErrors.tenantDetails,
          [fieldName]: "",
        },
      }));
    }
  };

  const isEmptyFormValues = (formDetails: any, type = "tenant") => {
    if (type === "tenant")
      return formDetails?.name === "" || formDetails?.email === "";
    else if (type === "user")
      return formDetails?.contact === "";
    else if (type === "tAddress")
      return (
        formDetails?.address === "" ||
        formDetails?.country === "" ||
        formDetails?.city === "" ||
        formDetails?.state === "" ||
        formDetails?.postalCode === ""
      );
  };
  const onBlurUserDetails = (fieldName: any) => () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userDetails[fieldName]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        userDetails: {
          ...prevErrors.userDetails,
          [fieldName]: "This field is required.",
        },
      }));
    } else if (fieldName === "email" && !emailRegex.test(userDetails.email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        userDetails: {
          ...prevErrors.userDetails,
          email: "Invalid email format.",
        },
      }));
    } else if (fieldName === "contact" && userDetails.contact.length < 9) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        userDetails: {
          ...prevErrors.userDetails,
          contact: "Enter your 10 digits contact number",
        },
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        userDetails: {
          ...prevErrors.userDetails,
          [fieldName]: "",
        },
      }));
    }
  };

  const onBlurLocation = (fieldName: any) => () => {
    if (!location[fieldName]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        location: {
          ...prevErrors.location,
          [fieldName]: "This field is required.",
        },
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        location: {
          ...prevErrors.location,
          [fieldName]: "",
        },
      }));
    }
  };
  React.useEffect(() => {
    // Check if the URL contains "/addItems"
    if (window.location.hash.includes("/onboarding")) {
      // Update itemDetails state with an empty object
      setDisabled(false);
      setTenantDetails({ tenantName: "", email: "", displayName: "" });
      setUserDetails({
        name: "",
        email: "",
        contact: "",
      });
      setLocation({
        address: "",
        country: "",
        city: "",
        state: "",
        postalCode: "",
        googleBusinessUrl: "",
      });
      setFileSrc(
        "http://h-app-scanner.s3-website-ap-southeast-2.amazonaws.com/logo.jpg"
      );
    }

  }, [window.location.pathname]);
  const handleSubmit = async (event: any) => {
    let isFormFieldValid = false;
    event.preventDefault();

    // Perform onBlur validation for all fields
    onBlurtenantDetails("tenantName")();
    onBlurtenantDetails("displayName")();
    onBlurtenantDetails("email")();
    onBlurUserDetails("contact")();
    onBlurLocation("address")();
    onBlurLocation("country")();
    onBlurLocation("city")();
    onBlurLocation("state")();
    onBlurLocation("postalCode")();

    if (
      isEmptyFormValues(tenantDetails) ||
      isEmptyFormValues(userDetails, "user") ||
      isEmptyFormValues(location, "tAddress") ||
      errors.tenantDetails.tenantName != "" ||
      errors.tenantDetails.displayName != "" ||
      errors.tenantDetails.email != "" ||
      errors.userDetails.contact != "" ||
      errors.location.address != "" ||
      errors.location.country != "" ||
      errors.location.city != "" ||
      errors.location.state != "" ||
      errors.location.postalCode != ""
    ) {
      // return;                
      isFormFieldValid = false;
    } else {
      isFormFieldValid = true;
    }
    try {
      if (isFormFieldValid == true) {
        window.scrollTo(0, 0);
        setIsLoading(true);
        if (tenantId) {
          const res = await ScanAppService.updateTenant({
            _id: tenantId,
            name: tenantDetails.tenantName,
            displayName: tenantDetails.displayName,
            contact: userDetails.contact,
            url: fileSrc,
            primary_color: themeDetails.primaryColor,
            secondary_color: themeDetails.secondaryColor,
            updated_by: tdata?._id,
            address: location.address,
            country: location.country,
            city: location.city,
            state: location.state,
            postalCode: location.postalCode,
            business_url: location.googleBusinessUrl,
          });
          if (res) {

            setTimeout(() => {
              console.log(res?.data?.data);
              if (res.data) {
                // setRows()
                const rData = res?.data?.data;
                for (let row of rows) {
                  // console.log(row);
                  if (row._id == rData?._id) {
                    console.log(`Row Matched ==== ${row._id}`);
                    row.business_url = rData?.business_url;
                    row.name = rData?.name;
                    row.primary_color = rData?.primary_color;
                    row.secondary_color = rData?.secondary_color;
                    row.display_name = rData?.display_name;
                    row.url = rData?.url;
                    row.status = rData?.status;
                  }
                }
              }

              // navigate(`../adminDashboard`, { replace: true });
              setResponse({
                message: "Tenant updated successfully",
                statusCode: res.status,
              });
            }, 300);
          }

        } else {
          const res = await ScanAppService.onBoarding({
            name: tenantDetails.tenantName,
            displayName: tenantDetails.displayName,
            email: tenantDetails.email,
            contact: userDetails.contact,
            url: fileSrc,
            primary_color: themeDetails.primaryColor,
            secondary_color: themeDetails.secondaryColor,
            address: location.address,
            country: location.country,
            city: location.city,
            state: location.state,
            postalCode: location.postalCode,
            business_url: location.googleBusinessUrl,
          });

          console.log("res from teanant creation ", res);
          if (res?.data?.statusCode == 200) {
            // setIsNotOnboarded(false);
            setState({ ...state, open: true });
            setResponse({
              message: "On Boarderd successfully",
              statusCode: res?.data?.statusCode,
            });
            alert("On Boarded Successfully!!");
            setTimeout(() => {
              navigate(`../adminDashboard`, { replace: true });
            }, 300);
          } else {
            setResponse({
              message: res?.data?.message,
              statusCode: res?.data?.statusCode,
            });
          }
        }
      }
    } catch (error: any) {
      console.error("Error posting or updating data:", error);
      console.log(error?.response?.data);
      if (error?.response?.data?.statusCode === 501) {
        setResponse({
          message: error?.response?.data?.message,
          statusCode: error?.response?.data?.statusCode,
        });
      }
      // Handle errors while posting or updating data
    } finally {
      setIsLoading(false);
    }

  };

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

  return (

    <div className="register-form p-5 needs-validation" id="register-form">
      {response.statusCode == 200 && (
        <Alert onClose={() => { }}>{response.message}</Alert>
      )}
      {response.statusCode >= 400 && (
        <div style={{ paddingBottom: "10px" }}>
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {response.message}
          </Alert>
        </div>
      )}

      {isLoading && response.statusCode == 200 ? (
        <div>
          <Box sx={{ width: 500 }}>
            <Snackbar
              // anchorOrigin={{ vertical, horizontal }}
              open={open}
              onClose={handleClose}
              message={response.message}
              key={vertical + horizontal}
            />
          </Box>
        </div>
      ) : (

        <div>
          {isLoading ? (<RippleLoader />) : (<></>)}
          <fieldset className="scheduler-border">
            <legend className="scheduler-border">Tenant Details</legend>
            <div className="control-group">
              <div className="row g-3">
                <div className="col-md-6">
                  <FormControl sx={{ m: 1, width: "100%" }}>
                    <TextField
                      required
                      id="outlined-basic"
                      fullWidth
                      label="Tenant Name"
                      multiline
                      variant="outlined"
                      value={tenantDetails.tenantName}
                      onChange={(e) => {
                        const id = e.target.value
                          .replace(/^\s+/, "")
                          .replace(/\s+/g, "") // Remove all spaces
                          .replace(/[^a-zA-Z]/g, ""); // Remove non-alphabetic characters
                        // const id = e.target.value.trim().replace(/\s{2,}/g, ' ').replace(/[^a-zA-Z0-9 ]/g, '')
                        setTenantDetails({ ...tenantDetails, tenantName: id });
                      }}
                      size="small"
                      onBlur={onBlurtenantDetails("tenantName")}
                      error={!!errors.tenantDetails.tenantName}
                      helperText={errors.tenantDetails.tenantName}
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
                      label="Tenant Display Name"
                      multiline
                      variant="outlined"
                      value={tenantDetails.displayName}
                      onChange={(e) => {
                        const id = e.target.value
                          // .replace(/^\s+/, "")                          
                          .replace(/[^a-z A-Z]/g, ""); // Remove non-alphabetic characters
                        // const id = e.target.value.trim().replace(/\s{2,}/g, ' ').replace(/[^a-zA-Z0-9 ]/g, '')
                        setTenantDetails({ ...tenantDetails, displayName: id });
                      }}
                      size="small"
                      onBlur={onBlurtenantDetails("displayName")}
                      error={!!errors.tenantDetails.displayName}
                      helperText={errors.tenantDetails.displayName}
                      inputProps={{ maxLength: 50 }}
                    />
                  </FormControl>
                </div>
                <div
                  className="col-md-6"
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  {/* <FormControl sx={{ m: 1 }}>
              <input
                type="file"
                id="avatar"
                name="avatar"
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
                className="custom-file-input"
              />
               <label htmlFor="avatar"> <FileUploadIcon/>Choose Logo</label>
              </FormControl>
              <FormControl sx={{ m: 1, width: "100%" }}>

              {fileSrc && (
                <img
                  src={fileSrc}
                  alt="Selected file"
                  style={{ width: "100px", height: "100px" }}
                />
              )}
              </FormControl> */}
                  <FormControl sx={{ m: 1 }}>
                    <div className="avatar-upload">
                      <div className="avatar-edit">
                        <input
                          required
                          type="file"
                          id="imageUpload"
                          accept=".png, .jpg, .jpeg"
                          onChange={handleFileChange}
                        />
                        <label htmlFor="imageUpload"></label>
                      </div>
                      <div className="avatar-preview">
                        {/* <div id="imagePreview" style={{background: "url(http://i.pravatar.cc/500?img=7);"}}> */}
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
                <div
                  className="col-md-6"
                  style={{ display: "flex" }}>
                  <FormControl sx={{ m: 1, width: "100%" }}>
                    <TextField
                      required
                      type="email"
                      id="outlined-basic"
                      fullWidth
                      label="Email"
                      multiline
                      variant="outlined"
                      value={tenantDetails.email}
                      disabled={disabled}
                      onChange={(e) => {
                        const emailValue = e.target.value
                          .replace(/[^a-zA-Z0-9@.]/g, "")
                          .replace(/\.com.*$/, ".com");
                        setTenantDetails({
                          ...tenantDetails,
                          email: emailValue,
                        });
                      }}
                      // onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                      size="small"
                      onBlur={onBlurtenantDetails("email")}
                      error={!!errors.tenantDetails.email}
                      helperText={errors.tenantDetails.email}
                      inputProps={{ maxLength: 50 }}
                    />
                  </FormControl>
                </div>
              </div>
            </div>
          </fieldset>
          <fieldset className="scheduler-border">
            <legend className="scheduler-border">Theme Details</legend>
            <div className="control-group">
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="d-flex" style={{ marginLeft: "10px" }}>
                    <input
                      type="color"
                      id="head"
                      name="head"
                      value={themeDetails.primaryColor}
                      onChange={(e) => {
                        setThemeDetails({
                          ...themeDetails,
                          primaryColor: e.target.value,
                        });
                      }}
                    />
                    <p className="primarycolor">Primary Color</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex" style={{ marginLeft: "10px" }}>
                    <input
                      type="color"
                      id="head"
                      name="head"
                      value={themeDetails.secondaryColor}
                      onChange={(e) => {
                        setThemeDetails({
                          ...themeDetails,
                          secondaryColor: e.target.value,
                        });
                      }}
                    />
                    <p className="secondarycolor">Secondary Color</p>
                  </div>
                </div>
              </div>
            </div>
          </fieldset>
          <fieldset className="scheduler-border">
            <legend className="scheduler-border">Communication Details</legend>
            <div className="control-group">
              <div className="row g-3">
                {/* <div className="col-md-4">
              <FormControl sx={{ m: 1, width: "100%" }}>
                <TextField
                  id="outlined-basic"
                  fullWidth
                  label="Secondary color"
                  multiline
                  variant="outlined"
                  value={userDetails.email}
                  onChange={(e) => {
                    const emailValue = e.target.value
                      .replace(/[^a-zA-Z0-9@.]/g, "")
                      .replace(/\.com.*$/, ".com");
                    setUserDetails({ ...userDetails, email: emailValue });
                  }}
                  // onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                  size="small"
                  onBlur={onBlurUserDetails("email")}
                  error={!!errors.userDetails.email}
                  helperText={errors.userDetails.email}
                  inputProps={{ maxLength: 50 }}
                />
              </FormControl>
            </div> */}
                <div className="col-md-4">
                  <FormControl sx={{ m: 1, width: "100%" }}>
                    <TextField
                      required
                      id="outlined-basic"
                      fullWidth
                      label="Contact"
                      multiline
                      variant="outlined"
                      value={userDetails.contact}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            {countryCodes["Australia"].code}
                          </InputAdornment>
                        ),
                      }}
                      // onChange={(e) => setUserDetails({ ...userDetails, contact: e.target.value })}
                      onChange={(e) => {
                        const contactValue = e.target.value.replace(
                          /^0+|[^0-9]/g,
                          ""
                        );

                        // const contactValue = e.target.value.replace(/^[0]+([0-9]*)$/, "$1");
                        // const contactValue = e.target.value.replace(/[^0-9]/g, "");
                        setUserDetails({
                          ...userDetails,
                          contact: contactValue,
                        });
                      }}
                      size="small"
                      onBlur={onBlurUserDetails("contact")}
                      error={!!errors.userDetails.contact}
                      helperText={errors.userDetails.contact}
                      inputProps={{
                        maxLength: countryCodes.Australia.acceptMobileLength,
                      }}
                    />
                  </FormControl>
                </div>
                {/* <div className="col-md-4">
              <FormControlLabel
                sx={{ m: 1, width: "100%" }}
                control={<Switch defaultChecked />}
                label="Is WhatsApp Enabled"
              />
            </div> */}
              </div>
            </div>
          </fieldset>
          <fieldset className="scheduler-border">
            <legend className="scheduler-border">Location</legend>
            <div className="control-group">
              <div className="row g-3">
                <div className="col-md-6">
                  <FormControl sx={{ m: 1, width: "100%" }}>
                    <TextField
                      required
                      id="outlined-basic"
                      fullWidth
                      label="Address"
                      multiline
                      variant="outlined"
                      value={location.address}
                      // onChange={(e) => setLocation({ ...location, address: e.target.value })}
                      onChange={(e) => {
                        const addressValue = e.target.value
                          .replace(/^\s+/, "")
                          .replace(/\s{2,}/g, " ")
                          .replace(/[^a-zA-Z0-9 /,-]/g, "");
                        setLocation({ ...location, address: addressValue });
                      }}
                      size="small"
                      onBlur={onBlurLocation("address")}
                      error={!!errors.location.address}
                      helperText={errors.location.address}
                      inputProps={{ maxLength: 100 }}
                    />
                  </FormControl>
                </div>
                <div className="col-md-6">
                  <FormControl sx={{ m: 1, width: "100%" }}>
                    <TextField
                      required
                      id="outlined-basic"
                      fullWidth
                      label="City"
                      multiline
                      variant="outlined"
                      value={location.city}
                      onChange={(e) => {
                        const cityValue = e.target.value.replace(
                          /[^a-zA-Z ]/g,
                          ""
                        );
                        setLocation({ ...location, city: cityValue });
                      }}
                      size="small"
                      onBlur={onBlurLocation("city")}
                      error={!!errors.location.city}
                      helperText={errors.location.city}
                      inputProps={{ maxLength: 50 }}
                    />
                  </FormControl>
                </div>
                <div className="col-md-4">
                  <FormControl sx={{ m: 1, width: "100%" }}>
                    <TextField
                      required
                      id="outlined-basic"
                      fullWidth
                      label="State"
                      multiline
                      variant="outlined"
                      value={location.state}
                      onChange={(e) => {
                        const stateValue = e.target.value
                          .replace(/^\s+/, "")
                          .replace(/\s{2,}/g, " ")
                          .replace(/[^a-zA-Z ]/g, "");
                        setLocation({ ...location, state: stateValue });
                      }}
                      size="small"
                      onBlur={onBlurLocation("state")}
                      error={!!errors.location.state}
                      helperText={errors.location.state}
                      inputProps={{ maxLength: 50 }}
                    />
                  </FormControl>
                </div>
                <div className="col-md-4">
                  <FormControl sx={{ m: 1, width: "100%" }}>
                    <TextField
                      required
                      id="outlined-basic"
                      fullWidth
                      label="Country"
                      multiline
                      variant="outlined"
                      value={location.country}
                      onChange={(e) => {
                        const countryValue = e.target.value
                          .replace(/^\s+/, "")
                          .replace(/\s{2,}/g, " ")
                          .replace(/[^a-zA-Z ]/g, "");
                        setLocation({ ...location, country: countryValue });
                      }}
                      size="small"
                      onBlur={onBlurLocation("country")}
                      error={!!errors.location.country}
                      helperText={errors.location.country}
                      inputProps={{ maxLength: 50 }}
                    />
                  </FormControl>
                </div>
                <div className="col-md-4">
                  <FormControl sx={{ m: 1, width: "100%" }}>
                    <TextField
                      required
                      id="outlined-basic"
                      fullWidth
                      label="Postal Code"
                      multiline
                      variant="outlined"
                      value={location.postalCode}
                      onChange={(e) => {
                        const postalValue = e.target.value.replace(
                          /[^0-9]/g,
                          ""
                        );
                        setLocation({ ...location, postalCode: postalValue });
                      }}
                      size="small"
                      onBlur={onBlurLocation("postalCode")}
                      error={!!errors.location.postalCode}
                      helperText={errors.location.postalCode}
                      inputProps={{ maxLength: 6 }}
                    />
                  </FormControl>
                </div>
                <div className="col-md-12">
                  <FormControl sx={{ m: 1, width: "100%" }}>
                    <TextField
                      id="outlined-basic"
                      fullWidth
                      label="Google Business Url"
                      multiline
                      variant="outlined"
                      value={location.googleBusinessUrl}
                      onChange={(e) => {
                        const cityValue = e.target.value;
                        setLocation({
                          ...location,
                          googleBusinessUrl: cityValue,
                        });
                      }}
                      size="small"
                    // onBlur={onBlurLocation("city")}
                    // error={!!errors.location.city}
                    // helperText={errors.location.city}
                    //inputProps={{ maxLength: 50 }}
                    />
                  </FormControl>
                </div>
              </div>
            </div>
          </fieldset>
          <div className="row">
            <div className="col-md-12">
              <div className="checkboxInput">
                <input
                  type="checkbox"
                  name="tos"
                  id="tos"
                  value="terms"
                  checked={checked}
                  onChange={handleCheckboxChange}
                />
                <p>
                  I agree to the{" "}
                  <a href="https://www.cloud4c.com/terms">
                    terms and conditions
                  </a>{" "}
                  mentioned in the <a href="https://www.cloud4c.com/aup">AUP</a>
                  , <a href="https://www.cloud4c.com/msa">MSA</a>,{" "}
                  <a href="https://www.cloud4c.com/sla">SLA</a>.
                </p>
              </div>
              {checkboxError && (
                <span style={{ color: "#d32f2f", marginLeft: "25px" }}>
                  {checkboxError}
                </span>
              )}
            </div>
          </div>
          <div className="col-12">
            <FormControl sx={{ m: 1, float: "right" }}>
              <button
                type="button"
                className="custom-primary-btn"
                onClick={handleSubmit}
              >
                <span>{text}</span>
              </button>
            </FormControl>

            {!tenantId && (
              <FormControl sx={{ m: 1, float: "right" }}>
                <button
                  type="button"
                  className="custom-secondary-btn"
                  onClick={navigateToAdminDash}
                >
                  Cancel
                </button>
                {/* <Button variant="contained" onClick={navigateToAdminDash}>
                  
                </Button> */}
              </FormControl>
            )}
          </div>
        </div>
      )}
    </div>
  );

};
