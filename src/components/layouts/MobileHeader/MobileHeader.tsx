/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { DrawerLayout } from "../Footer/DrawerLayout";
// import LogoutIcon from "@mui/icons-material/Logout";
import "./MobileHeader.scss";
import { useConfig } from "../../../config/config";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export const MobileHeader = () => {
  const config: any = useConfig();
  // const {tenant} = useParams()
  const navigate = useNavigate();
  const url = config ? config?.data[0]?.url : "https://i.imgur.com/QQ8FTjR.png";
  const tenant = config?.data[0].name;
  const display_name = config?.data[0]?.display_name;
  // const currentRoute = window.location.hash.split("/")?.[2];

  console.log("config from header", config?.data[0].url);

  const logout = () => {
    console.log(isLogin);
    alert("Are you sure you want to log out?");
    setIsLogin(false);
    sessionStorage.clear();
    navigate(`../${tenant}/tenantlogin`, { replace: true });
  };
  const [isLogin, setIsLogin] = useState(
    sessionStorage.isLogin ? sessionStorage.isLogin : false
  );
  const [isTenant, setTenant] = useState(false);
  const [isShow, setisShow] = useState(false);
  const showMenu = () => {
    setisShow(!isShow);
  };
  const hideMenu = () =>{
    if(isShow){
      setisShow(!isShow);
    }
  };
  useEffect(() => {
    console.log(isTenant);
    if (location.href.includes("dashBoard") || location.href.includes("home")) {
      setTenant(true);
    } else {
      setTenant(false);
    }
  }, [location.href]);
  // console.log("ee", setIsLogin(true))
  const navigateToPage = (pageName: String) => {
    navigate(`../${tenant}/${pageName}`, { replace: true });
  }

  return (
    <header>
      <div className={`headerWrapper ${isShow ? 'animateMenu' : ''}`}>
        <div className="logoWrapperContainer">
          <Link to="#">
            <div className="logoWrapper">
              {/* <span className="tenant-name" style={{color: `${config?.data[0]?.secondary_color}`}}>{tenant}</span> */}
              <img className="headerLogo" src={url} alt="" />
              <span className="mobileView" style={{ color: `${config?.data[0]?.secondary_color}` }}>{display_name ? display_name : tenant}</span>
            </div>
          </Link>
        </div>
        <div className="desktopview" style={{ color: `${config?.data[0]?.secondary_color}` }}><h2>{display_name ? display_name : tenant}</h2></div>
        <div className="desktopview">
          <nav>
            <ul>
              {!isLogin && (
                <li><a href="javascript:void(0)" className="active" onClick={() => navigateToPage("home")}>Home</a></li>
              )}
              {/* {!isLogin && (
              <li><a href="javascript:void(0)" className="">Top 5 Items</a></li>
            )} */}
              <li><a href="javascript:void(0)" className="">About</a></li>
              <li className="lastLi"><a href="javascript:void(0)">Contact</a></li>
              {isLogin && (<li><a href="javascript:void(0)" className="" onClick={logout}>Logout</a></li>)}
            </ul>
          </nav>
        </div>
        <div className="mobileView" onClick={hideMenu}>
          <a onClick={showMenu} className="icon">
            <i className="fa fa-bars"></i>
          </a>
          {isShow && <div className="mobIleNav">
            <ul>
              {!isLogin && (
                <li><a href="javascript:void(0)" className="active" onClick={() => navigateToPage("home")}>Home</a></li>
              )}
              {/* <li><a href="#top5" className="">Top 5 Items</a></li> */}
              <li><a href="javascript:void(0)" className="" >About</a></li>
              <li className="lastLi"><a href="javascript:void(0)" >Contact</a></li>
              {isLogin && (<li><a href="javascript:void(0)" className="" onClick={logout}>Logout</a></li>)}

            </ul>
          </div>}
        </div>
      </div>
    </header>
  );
};
