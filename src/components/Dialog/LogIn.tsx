/* eslint-disable @typescript-eslint/no-explicit-any */
import  React , { useState } from 'react';

  import { Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput ,  FormHelperText} from '@mui/material'
import './LogIn.scss'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { ScanAppService } from '../../services/ScanAppService';
import { useNavigate } from 'react-router-dom';
export const LogIn = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  const [response, setResponse]= useState("")
  const [itemDetails, setItemDetails] = useState<any>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    itemDetails: { email: "", password: "" },
  });
  const [isLoading, setIsLoading] = useState(false);
  const onBlurItemDetails = (fieldName: any) => () => {
    if (!itemDetails[fieldName]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        itemDetails: {
          ...prevErrors.itemDetails,
          [fieldName]: "This field is required.",
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
  };
  const handleSubmit = async (event: any) => {
    // let isFormFieldValid = false;
    event.preventDefault();
    setIsLoading(true);
    // Perform onBlur validation for all fields
    onBlurItemDetails("email")();
    onBlurItemDetails("password")();

    // If there are any validation errors, prevent form submission
    if (errors.itemDetails.email || errors.itemDetails.password) {
      // return;
      // isFormFieldValid = false;
    } else {
      // isFormFieldValid = true;
    }
    // setReview(false)
    try {

      const res = await ScanAppService.tenantLogin({
        email:itemDetails.email,
        password:itemDetails.password,
        tenant_id: ""
      })

      console.log("res", res);
      if(res) {
        setIsLoading(false);
      }
      if (res?.status == 200) {     
        sessionStorage.isLogin = true;  
        sessionStorage.isAdmin = "true";  
        sessionStorage.tenantdetails = JSON.stringify(res.data);
        navigate(`/adminDashBoard`, { replace: true });
      } else {
        setResponse("Pls. check your credentials")
        errors.itemDetails.email = "Pls. check email";
        errors.itemDetails.password = "Pls. check the password";
      }
      // Frame the formData object based on the form field values
    } catch (error) {
      setResponse("Pls. check your credentials")
      console.error("Error posting or updating data:", error);
      setIsLoading(false);
      // Handle errors while posting or updating data
    } 
  };
  return (
    <div style={{margin:"25px"}}>
        <h3 style={{textAlign:"center", marginBottom:"20px"}}>Admin LogIn</h3>
        {response && <h6 style={{color: "#d32f2f",textAlign:"center"}}>{response}</h6>}
        <FormControl  fullWidth  style={{marginBottom:"18px"}} variant="outlined" size="small">
          <InputLabel htmlFor="outlined-adornment-password">Email</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            label="Email"
            onBlur={onBlurItemDetails("email")}
            value={itemDetails.email}
            onChange={(e) => {
              const emailValue = e.target.value
              .replace(/[^a-zA-Z0-9@.]/g, "")
              // .replace(/\.com.*$/, ".com");
              // const id = e.target.value.trim().replace(/\s{2,}/g, ' ').replace(/[^a-zA-Z0-9 ]/g, '')
              setItemDetails({ ...itemDetails, email: emailValue });
            }}
          />
              {errors.itemDetails.email && <FormHelperText error>{errors.itemDetails.password}</FormHelperText>}

        </FormControl>
        <FormControl  fullWidth  variant="outlined" size="small">
          <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
            onBlur={onBlurItemDetails("password")}
            value={itemDetails.password}
            onChange={(e) => {
              const id = e.target.value
                .replace(/^\s+/, "")
              // const id = e.target.value.trim().replace(/\s{2,}/g, ' ').replace(/[^a-zA-Z0-9 ]/g, '')
              setItemDetails({ ...itemDetails, password: id });
            }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
              {errors.itemDetails.password && <FormHelperText error>{errors.itemDetails.password}</FormHelperText>}

        </FormControl>
        <Button disabled={isLoading} variant="contained" style={{ width: "100%" , marginTop:"20px", borderRadius: "15px"}}  onClick={handleSubmit}>
       Log In
      </Button>
        
    </div>
  )
}
