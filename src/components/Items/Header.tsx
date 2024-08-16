/* eslint-disable @typescript-eslint/no-explicit-any */

import { useConfig } from "../../config/config";
import { useFormData } from "./stateManagement/FormDataContext";

export const Header = () => {
  const config: any = useConfig();
  const { header} = useFormData();
  const myFunction = () => {
    //
  }
  return (
    <header>
      {/* <h4>Add Item</h4> */}
      <div className="row">
          <div className="col-2">
            <div style={{background: `${config?.data[0]?.primary_color}`, color: `${config?.data[0]?.secondary_color}`}}>Logo</div>
          </div>
          <div className="col-4">
            <h2 style={{color: `${config?.data[0]?.secondary_color}`}}>{header}</h2>
          </div>
          <div className="col-6">
            <div className="topnav" id="myTopnav">
              <a href="#home" className="active">Home</a>
              <a href="#news">News</a>
              <a href="#contact">Contact</a>
              <a href="#about">About</a>
              <a href="javascript:void(0);" className="icon" onClick={myFunction}>
                <i className="fa fa-bars"></i>
              </a>
            </div>
          </div>
            {/* <div className="card my-4">
              <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3" style={{background: `${config?.data[0]?.primary_color}`, color: `${config?.data[0]?.secondary_color}`}}>
                  <h4 className="text-white text-capitalize ps-3" style={{color: `${config?.data[0]?.secondary_color}`}}>{header}</h4>
                </div>
              </div>
            </div>   */}
        </div>
    </header>
  );
};
