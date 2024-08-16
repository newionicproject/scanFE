/* eslint-disable @typescript-eslint/no-explicit-any */
import "./MainLayout.scss";
import { useRoutes } from "react-router-dom";
import { Routes } from "../../routes/Routes";
import { MobileHeader } from "../MobileHeader/MobileHeader";
import { useConfig } from "../../../config/config";
import { Footer } from "../Footer/Footer";
// import { Header } from "../Header/Header";
// import { ImageSlider } from "../../Slider/ImageSlider";
export const MainLayout = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const routeResult: any = useRoutes(Routes);

  const showHeader = Routes.find(
    (route: any) =>
      route.path.replace("/:tenant/", "") ===
      window.location.hash.split("/")?.[2]
  );
  // const isHeaderVisible = true
  const config = useConfig();
  // const showHeader = Routes.find((route:any) => {window.location.href.includes(route.path.replace('/:tenant/', '')) ;console.log("route",route.path.replace('/:tenant/', ''))});
  // console.log("routeddddddddddddddd",Routes.find((route:any) => {window.location.href.includes(route.path.replace('/:tenant/', ''))}))
  // Check if the current route has the showHeader property
  // const showHeader = currentRoute

  console.log("my path namer", window.location.hash.split("/")?.[2]);
  console.log("show headerrrrrrr", showHeader);
  // console.log(window.location.pathname.split('/')?.[1]);
  // console.log("pathhhh",isHeaderVisible);
  console.log("config", config);
  location.href.includes("adminLogin");
  const adminStyle = location.href.includes("adminLogin") ? {
    marginTop: "50px",
    background: "rgb(255, 255, 255)",
    padding: "5px",
    borderRadius: "15px",
    // backgroundColor: isHovered ? config?.data[0]?.primary_color : '',
    // color: isHovered ? config?.data[0]?.secondary_color : '',
    // // borderRadius: '15px',
    // padding: '10px'
  } : {};
  return (
    <div>
      {/* <Header /> */}
      {showHeader?.showHeader && <MobileHeader />}
      {/* {<MobileHeader/> } */}
      <div className="main-content container" style={adminStyle}>
        <div className="routing">
          <div className="layoutRouting">
            {routeResult}
            {/* <ImageSlider/> */}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
