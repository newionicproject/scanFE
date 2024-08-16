/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { DrawerLayout } from "../Footer/DrawerLayout";
import LogoutIcon from "@mui/icons-material/Logout";
import "./MobileHeader.scss";
import { useConfig } from "../../../config/config";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export const MobileHeader = () => {
  const config: any = useConfig();
  // const {tenant} = useParams()
  const navigate = useNavigate();
  const url = config ? config?.data[0]?.url : "https://i.imgur.com/QQ8FTjR.png";
  const tenant = config?.data[0].name;
  const currentRoute = window.location.hash.split("/")?.[2];

  console.log("config from header", config?.data[0].url);

  const logout = () => {
    alert("Are you sure you want to log out?");
    setIsLogin(false);
    sessionStorage.clear();
    navigate(`../${tenant}/tenantlogin`, { replace: true });
  };
  const [isLogin, setIsLogin] = useState(
    sessionStorage.isLogin ? sessionStorage.isLogin : false
  );
  const [isTenant, setTenant] = useState(false);

  useEffect(() => {
    if (location.href.includes("dashBoard") || location.href.includes("home")) {
      setTenant(true);
    } else {
      setTenant(false);
    }
  }, [location.href]);
  // console.log("ee", setIsLogin(true))
  return (
    <header>
      <div>
        {isTenant ? (
          <div className="headerWrapper">
            <div
              className="col-11"
              style={{
                textAlign: "center",
                // left: "85px",
                textDecoration: "none",
              }}
            >
              <Link to="#">
                <div className="logoWrapper">
                  <span
                    className="tenant-name"
                    style={{
                      color: `${config?.data[0]?.secondary_color}`,
                      textDecoration: "none",
                    }}
                  >
                    {tenant}
                  </span>
                  <img className="headerLogo" src={url} alt="" />
                </div>{" "}
              </Link>
            </div>
            <div className="col-1" style={{ textAlign: "center" }}>
              <div className="drawerWrapper">
                {/* <DrawerLayout/> */}
                {/* <i className="fa fa-right-from-bracke"></i> */}

                {isLogin ? (
                  <button type="button" onClick={logout}>
                    <LogoutIcon style={{ fontSize: "20px" }} />
                  </button>
                ) : currentRoute == "latest" && (
                  <span>
                    <Link to={`/${tenant}/home`}>
                      <div className="backArrow">
                        <ArrowBackIcon />
                      </div>
                    </Link>
                  </span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="headerWrapper">
            <div className="col-10">
              <Link to="#">
                <div className="logoWrapper"> 
                  {/* <span className="tenant-name" style={{color: `${config?.data[0]?.secondary_color}`}}>{tenant}</span> */}
                  <img className="headerLogo" src={url} alt="" />
                </div>{" "}
              </Link>
            </div>
            <div className="col-2" style={{ textAlign: "right" }}>
              <div className="drawerWrapper">
                {currentRoute == "latest" && (
                  <span>
                    <Link to={`/${tenant}/home`}>
                      <div className="backArrow">
                        <ArrowBackIcon />
                      </div>
                    </Link>
                  </span>
                )}
              </div>
            </div> commented by anil
            <div
              className="col-12"
              style={{
                textAlign: "center",
                // left: "85px",
                textDecoration: "none",
              }}
            >
              <Link to="#">
                <div className="logoWrapper">
                  <span
                    className="tenant-name"
                    style={{
                      color: `${config?.data[0]?.secondary_color}`,
                      textDecoration: "none",
                    }}
                  >
                    {tenant}
                  </span>
                  <img className="headerLogo" src={url} alt="" />
                </div>{" "}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
