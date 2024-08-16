/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "react-bootstrap";
// import { ImageSlider } from '../Slider/ImageSlider'
import { Link } from "react-router-dom";
import "./Home.scss";
import "./../Slider/ImageSlider.scss";
// import { profile } from "../../Appconstant";
import { useState, useEffect } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { useConfig } from "../../config/config";
import DetailedView from "./DetailedView";
import { useFormData } from "../Items/stateManagement/FormDataContext";
import { ScanAppService } from "../../services/ScanAppService";
import Review from "./Review";
import { RippleLoader } from "../Loader/RippleLoader";
export const Home = () => {
  const { setOpen, setIndexedImage, isPopupOpen, setIsPopupOpen } =
    useFormData();
  const config: any = useConfig();
  const tdata = config?.data[0];
  const handleClickOpen = (index: number) => {
    setIndexedImage(index);
    setOpen(true);
    setIsPopupOpen(true);
  };
  const [profile, setProfile] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const currentProfile: any = profile[currentImageIndex];
  const [isLoading, setIsLoading] = useState(false);
  console.log("current", currentProfile, profile, currentImageIndex);
  const handleDashClick = (index: number) => {
    setCurrentImageIndex(index);
  };
  console.log("tdata", tdata);
  console.log("profile", profile);

  const [isShow, setisShow] = useState(false);
  // alert(isLogin)
  const handleClickOpenReview = ()=>{
   setisShow(true);
  };
  //prepare a customized date...
  const prepareCustomDate = (nDate: any) => {
    if (!nDate) return new Date();
    const custDate = new Date(nDate);
    // return `${custDate.getFullYear()}-${custDate.getMonth()}-${custDate.getDate()}`;
    return custDate.getTime();
  };
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await ScanAppService.getItems(tdata?._id);
      if (res) {
        setIsLoading(false);
      }
      const today = prepareCustomDate(new Date());
      // console.log("items data============================", res?.data?.data, "today ===>", today)
      // Filter out items with expiration date greater than today
      const nonExpiredItems = res?.data?.data.filter((item: any) => {
        const expirationDate = prepareCustomDate(item.expired_on);
        // console.log("expirationDate===============", expirationDate,"today=======", today);
        // console.log(`expirationDate >= today =========>>> ${expirationDate >= today}`);
        return item.is_special && expirationDate >= today;
      });
      setProfile(nonExpiredItems);
      sessionStorage.tenant_items = JSON.stringify(nonExpiredItems);
      // Frame the formData object based on the form field values
    } catch (error) {
      console.error("Error posting or updating data:", error);
      // Handle errors while posting or updating data
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    if (profile.length >= 1 && !isPopupOpen) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === profile.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000); // Change this value to adjust the interval time

      return () => clearInterval(interval);
    }
  }, [profile.length, isPopupOpen]);
  return (
    <div className="Home">
      {isLoading ? (
        <div>
          {" "}
          <RippleLoader />
        </div>
      ) : (
        <div className="imgWrapper">
          <div className="imageStyles">
            {/* <img  src='./../../../public/img/hero-bg.png'/> */}
            <div className="slider">
              <div
                className="slides"
                style={{
                  transform: `translateX(${-currentImageIndex * 100}%)`,
                  transition:
                    currentImageIndex === 0 ? "none" : "transform 0.5s ease",
                }}
              >
                {profile.map((image: any, index: any) => (
                  <div
                    key={index}
                    className="slide"
                    onClick={() => handleClickOpen(index)}
                  >
                    <img src={image.url} alt={`slider-${index}`} />
                  </div>
                ))}
              </div>
              <div className="dash-container">
                {profile.length ? (
                  profile.map((_: any, index: any) => (
                    <div
                      key={index}
                      onClick={() => handleDashClick(index)}
                      className={`dash ${
                        index === currentImageIndex ? "active" : ""
                      }`}
                    />
                  ))
                ) : (
                  <div className="container">
                    {" "}
                    <img
                      src="https://www.shutterstock.com/image-photo/restaurant-blackboard-announcing-reopening-after-600nw-1735273409.jpg"
                      className="img"
                    />
                  </div>
                )}
              </div>
            </div>
            {/* <ImageSlider data={profile}/> */}
          </div>
          <div className="description">
            {profile.length ? (
              <>
                <h3 className="firstH3">
                  {currentProfile && currentProfile.name}
                </h3>
                {/* <h3>great Sensation</h3> */}
                <p title={currentProfile && currentProfile.item_desc}>{currentProfile && currentProfile.item_desc} </p>
              </>
            ) : (
              <>
                <h2 className="" style={{ fontSize: "20px" }}>
                  <i> coming soon ...</i>
                </h2>
              </>
            )}
          </div>
        </div>
      )}

      {!isLoading && profile.length && (
        <>
          <div className="buttonWrapper">
            <Link to={`/${tdata?.name}/latest`}>
              {" "}
              <Button variant="contained">
                {" "}
                <MenuIcon /> Items{" "}
              </Button>
            </Link>
            {<p className='like_review'><span onClick={() => handleClickOpenReview()}><i className="fa fa-thumbs-up" aria-hidden="true"></i>
 &nbsp; Like & Review</span></p>}
          </div>
          <DetailedView />
          {isShow &&     <Review /> }
        </>
      )}
    </div>
  );
};
