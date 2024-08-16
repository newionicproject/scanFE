/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import{ useState } from "react";
import {
  FormHelperText
} from "@mui/material";
import "./TenantLogIn.scss";
import { ScanAppService } from "../../services/ScanAppService";
import { useNavigate, useParams } from "react-router-dom";
import { useConfig } from "../../config/config";
import { RippleLoader } from "../Loader/RippleLoader";
// import  Footer  from "../layouts/Footer/Footer";
export const TenantLogIn = () => {
  // const [showPassword, setShowPassword] = React.useState(true);
  const navigate = useNavigate();
  const { tenant } = useParams();
  const [response, setResponse]= useState("")
  // const [loginResponse, setLoginResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  console.log("s", setIsLoading);
  // const handleClickShowPassword = () => setShowPassword((show) => !show);
  // const handleMouseDownPassword = (
  //   event: React.MouseEvent<HTMLButtonElement>
  // ) => {
  //   event.preventDefault();
  // };
  const [itemDetails, setItemDetails] = useState<any>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    itemDetails: { email: "", password: "" },
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
  const config: any = useConfig();
  sessionStorage.appname = "Steal Deals Application";
  // console.log(window.location.pathname.split('/')?.[1]);
  // console.log("pathhhh",window.location);
  console.log("config from tenant", config);
  // const url = config ?config?.data[0]?.url :"./assets/img/cred.jpg";
  // const url = "./assets/img/cred.jpg";
  // setUrl(config.data[0].url)
  // console.log("config from tenant url",config.data[0].url)
  const handleSubmit = async (event: any) => {
    
    let isFormFieldValid = false;    
    event.preventDefault();
    // Perform onBlur validation for all fields
    onBlurItemDetails("email")();
    onBlurItemDetails("password")();
    // If there are any validation errors, prevent form submission
    if (errors.itemDetails.email || errors.itemDetails.password) {
      // return;
      isFormFieldValid = false;
    } else {
      isFormFieldValid = true;
    }
    // setReview(false)
    try {
      console.log(`itemDetails ::`, itemDetails);
      if (isFormFieldValid) {
        setIsLoading(false)
        const res = await ScanAppService.tenantLogin({
          email: itemDetails.email,
          password: itemDetails.password,
          tenant_id:  config?.data[0]?._id
        });
        console.log("tenant", tenant);
        if(res) {
          setIsLoading(true);
        }        
        console.log(res?.status,"res", res);
        if (res?.status == 200) {     
          sessionStorage.isLogin = true;     
          sessionStorage.tenantdetails = JSON.stringify(res.data);
          navigate(`../${tenant}/dashBoard`, { replace: true });
        } else {
          setResponse("Pls. check your credentials")
          errors.itemDetails.email = "Pls. check email";
          errors.itemDetails.password = "Pls. check the password";
        }
      }

      // Frame the formData object based on the form field values
    } catch (error) {
      setResponse("Pls. check your credentials")
      console.error("Error posting or updating data:", error);
      setIsLoading(true);
      // Handle errors while posting or updating data
    }
  };
  // const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
  //   if (event.key === "Enter") {
  //     event.preventDefault(); // Prevent form submission on Enter key
  //     handleSubmit(event);
  //   }
  // };
  return (

   <div>
        {isLoading ?( 
          <div className="container my-auto" style={{padding:"20px"}}>
        <div className="row">
          <div className="col-lg-4 col-md-8 col-12 mx-auto">
            <div className="card z-index-0 fadeIn3 fadeInBottom">
              <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                {/* backgroundImage: `linearGradient(195deg, ${config?.data[0]?.primary_color} 0%, ${config?.data[0]?.primary_color} 100%`); */}
                {/* style={{backgroundImage: `linearGradient(195deg, ${config?.data[0]?.primary_color} 0%, ${config?.data[0]?.primary_color} 100%) !important`}} */}
                <div className=" border-radius-lg py-3 pe-1" style={{background: `${config?.data[0]?.primary_color}`, color: `${config?.data[0]?.secondary_color}`}}>
                <h3 className=" font-weight-bolder text-center mt-2 mb-0" >{sessionStorage.appname}</h3>
                  <h4 className=" font-weight-bolder text-center mt-2 mb-0" style={{color: `${config?.data[0]?.secondary_color}`}}>Welcome to Tenant Login</h4>
                  <div className="row mt-3">
                    <div className="col-2 text-center ms-auto">
                      <a className="btn btn-link px-3" href="javascript:;">
                        <i className="fa fa-facebook text-white text-lg"  style={{color: `${config?.data[0]?.secondary_color} !important`}}></i>
                      </a>
                    </div> 
                    {/* <div className="col-2 text-center px-1">
                      <a className="btn btn-link px-3" href="javascript:;">
                        <i className="fa fa-github text-white text-lg"></i>
                      </a>
                    </div> */}
                    <div className="col-2 text-center me-auto">
                      <a className="btn btn-link px-3" href="javascript:;">
                        <i className="fa fa-google text-white text-lg"  style={{color: `${config?.data[0]?.secondary_color} !important`}}></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body">
              {response && <h6 style={{color: "#d32f2f",textAlign:"center"}}>{response}</h6>}

                <form role="form" className="text-start">
                  <div className="input-group input-group-outline my-3">
                    {/* <label className="form-label">Email</label> */}
                    <input autoComplete="false" type="email" placeholder="Email" className="form-control" value={itemDetails.email} onChange={(e) => {
                    const emailValue = e.target.value
                      .replace(/[^a-zA-Z0-9@.]/g, "")
                      .replace(/\.com.*$/, ".com");
                    setItemDetails({ ...itemDetails, email: emailValue });
                  }}
                  onBlur={onBlurItemDetails("email")}
                  />
                  
                  </div>
                  <div className="input-group input-group-outline mb-2">
                    {errors.itemDetails.email && (
                      <FormHelperText error>
                        {errors.itemDetails.email}
                      </FormHelperText>
                    )}
                  </div>
                  <div className="input-group input-group-outline mb-3">
                    {/* <label className="form-label">Password</label> */}
                    <input  autoComplete="false"  type="password" placeholder="Password" className="form-control" value={itemDetails.password}
                  onChange={(e) => {
                    const id = e.target.value
                      .replace(/^\s+/, "")
                      .replace(/\s{2,}/g, " ")
                      .replace(/[^a-zA-Z0-9 ]/g, "");
                    // const id = e.target.value.trim().replace(/\s{2,}/g, ' ').replace(/[^a-zA-Z0-9 ]/g, '')
                    setItemDetails({ ...itemDetails, password: id });
                  }} 
                  onBlur={onBlurItemDetails("password")}
                  />
                  
                  </div>
                  <div className="input-group input-group-outline mb-2">
                  {errors.itemDetails.password && (
                    <FormHelperText error>
                      {errors.itemDetails.password}
                    </FormHelperText>
                  )}
                  </div>
                  {/* <div className="form-switch d-flex align-items-center mb-3" style={{padding:"0px"}}>
                  <Switch defaultChecked size="small"/>
                    <label className="form-check-label mb-0 ms-3" >Remember me</label>
                  </div> */}
                  <div className="text-center">
                    <button type="button" disabled={!isLoading} className="btn  w-100 my-4 mb-2" onClick={handleSubmit} style={{borderRadius: '20px',padding:"10px",background: `${config?.data[0]?.primary_color}`, color: `${config?.data[0]?.secondary_color}`}}>Sign in</button>
                  </div>
                  {/* <p className="mt-4 text-sm text-center">
                    Don't have an account?
                    <a href="../pages/sign-up.html" className="text-primary text-gradient font-weight-bold">Sign up</a>
                  </p> */}
                </form>
              </div>
            </div>
          </div>
        </div> </div>
        ): 
        <div> <RippleLoader/></div>

        }
      </div>
  );
};
