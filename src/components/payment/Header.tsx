/* eslint-disable @typescript-eslint/no-explicit-any */
import { useConfig } from "../../config/config";


export const Header = () => { 
  const config: any = useConfig();
  return (
    // <header className="d-flex justify-content-between">
    //   <h4>On boarding</h4>
    // </header>
    <header className="d-flex justify-content-between">
    {/* <h4>Add Item</h4> */}
    <div className="row">
        <div className="col-12">
          <div style={{background: `${config?.data[0]?.primary_color}`, color: `${config?.data[0]?.secondary_color}`}}>
          <h2 style={{color: `${config?.data[0]?.secondary_color}`}}>On boarding</h2>
          </div>
          {/* <div className="card my-4">
            <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3" style={{background: `${config?.data[0]?.primary_color}`, color: `${config?.data[0]?.secondary_color}`}}>
                <h4 className="text-white text-capitalize ps-3" style={{color: `${config?.data[0]?.secondary_color}`}}>On boarding</h4>
              </div>
            </div>
          </div> */}
        </div>
    </div>
  </header>
  );
};
