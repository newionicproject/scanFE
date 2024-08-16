// import { useState } from "react";
import './Footer.scss';
// import Review from "./Review";
export const Footer = () => {
  // const [isShow, setisShow] = useState(false);
  // const isLogin = sessionStorage?.isLogin;
  // alert(isLogin)
  // const handleClickOpenReview = ()=>{
  //  setisShow(true);
  // };
  return (
    <div className='Footer'>
      
      <footer className="footer py-4">
      <div className="container-fluid">
          <div className="row align-items-center justify-content-lg-between">
            <div className="col-lg-12 mb-lg-0 mb-4">
              <div className="text-center text-lg-start">
                {/* {!isLogin && <p className='like_review'><span onClick={() => handleClickOpenReview()}>Like & Review</span></p>} */}
                © {new Date().getFullYear()} ,
                <i className="fa fa-heart"></i> &nbsp; 
                <a href="https://stealdeals.com.au/" className="font-weight-bold" target="_blank">Steal Deals </a>  <span> Powered by kodeclust technologies pty ltd.</span>               
              </div>
            </div>
            {/* <div className="col-lg-6">
              <ul className="nav nav-footer justify-content-center justify-content-lg-end">
                <li className="nav-item">
                  <a href="https://www.creative-tim.com" className="nav-link text-muted" target="_blank">Creative Tim</a>
                </li>
                <li className="nav-item">
                  <a href="https://www.creative-tim.com/presentation" className="nav-link text-muted" target="_blank">About Us</a>
                </li>
                <li className="nav-item">
                  <a href="https://www.creative-tim.com/blog" className="nav-link text-muted" target="_blank">Blog</a>
                </li>
                <li className="nav-item">
                  <a href="https://www.creative-tim.com/license" className="nav-link pe-0 text-muted" target="_blank">License</a>
                </li>
              </ul>
            </div> */}
          </div>
        </div>
        {/* {isShow &&     <Review /> } */}
      </footer>
    </div>
  )
}
