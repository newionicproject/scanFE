/* eslint-disable @typescript-eslint/no-explicit-any */
// import { menuItems } from '../../../Appconstant';
import './Latest.scss';


export const Latest = () => {
  const menuItems = sessionStorage.tenant_items ? JSON.parse(sessionStorage.tenant_items) : [];
  // const config = sessionStorage.appConfig ? JSON.parse(sessionStorage.appConfig) : [];
  // const tenantName = config?.data[0]?.name;
  // const display_name = config?.data[0]?.display_name;
  console.log("menu Items", menuItems)
  return (
    <div className='Latest'>
      <section className="section menu" id="menu">
        <div className='Items-tenant' style={{"textAlign":"center","fontSize":"20px"}}>
        {/* {display_name ? display_name : tenantName} :: <i>Items</i> */}
        </div>
        <div className="menu-container container">
          <div className="menu-content" style={{"overflowY":"auto","height":"calc(100vh - 290px)"}}>
            <div className="menu-items">
              {menuItems.length ? menuItems.map((menuItem:any, index:number) => (
                <div className="menu-item flex" key={index}>
                  <div className="menu-item-list-wrapper">
                    <div className="list-item-img">
                      <img src={menuItem.url} alt="" className="menu-img" />
                    </div>
                    <div className="list-item-description">
                      <div className="menuItem-details"> 
                        <h4 className="menuItem-topic">{menuItem.name}</h4>
                        <p className="menuItem-des" style={{lineHeight:"15px", fontSize: "15px"}}>{menuItem.item_desc}</p>
                        <div className="spices-price-wraper" style={{paddingTop:"10px"}}>
                          {/* <div className='spice'>
                            {[...Array(menuItem.spicy_level)].map((_, index) => (
                              <img key={index} src='https://h-app-scanner.s3.ap-southeast-2.amazonaws.com/img/chilli.png' alt='hi'/>
                            ))}
                          </div> */}
                          <div className="menuItem-price">
                            <span className="badge badge-success" style={{fontSize: "15px", marginRight:"10px"}}>  {menuItem.currency_code == "AUD" ||
                                          menuItem.currency_code == "US"
                                            ? "$"
                                            : "$"}{menuItem.promotional_price}</span>
                            <span className="real-price" style={{color:"#b85a5a"}}>  {menuItem.currency_code == "AUD" ||
                                          menuItem.currency_code == "US"
                                            ? "$"
                                            : "$"}{menuItem.item_price}</span>
                          </div>
                        </div>
                        <div className="spices-price-wraper">
                          <div className='spice'>
                            {menuItem.spicy_level > 0 && [...Array(menuItem.spicy_level)].map((_, index) => (
                              <img key={index} src='http://h-app-scanner.s3.ap-southeast-2.amazonaws.com/img/chilli.png' alt='hi'/>
                            ))}
                          </div>
                          </div>
                      </div>
                    </div>
                  </div>
                </div>
              )): <div className="container"> <img src='https://www.shutterstock.com/image-photo/restaurant-blackboard-announcing-reopening-after-600nw-1735273409.jpg' className='img'/></div>}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
