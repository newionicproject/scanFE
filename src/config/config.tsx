/* eslint-disable @typescript-eslint/no-explicit-any */
// configContext.js
import  { createContext, useContext, useEffect, useState } from 'react';
import { ConfigurationService } from '../services/ConfigurationService';
import { RippleLoader } from '../components/Loader/RippleLoader';
import { useNavigate } from 'react-router-dom';

const ConfigContext:any = createContext(null);

const ConfigProvider = ({ children }:any) => {
  const [config, setConfig] = useState<any>(null);
  const navigate = useNavigate()
  console.log("path",window.location.hash.split('/')?.[1]);   
  console.log("pathhhh",window.location);   
  console.log(" current pathhhh", window.location.hash.replace('#', ''));   
 
  const data = window.location.hash.split('/')?.[1]
  const fetchConfig = async () => {
    try {
      
      const configData:any = await ConfigurationService.getTenantDetails(data)
      setConfig(configData.data);
      sessionStorage.setItem('appConfig', JSON.stringify(configData.data));

    //  if(config){ 
    //     navigate("/tenantLogin")
    //   // window.location.href = "http://localhost:8080/#/tenantLogin";
    // }
      console.log("configgggggggggggg", configData.data)
    } catch (error) {
      console.error('Error fetching config:', error);
    }
  };
  useEffect(() => {
  
    // const storedConfig = sessionStorage.getItem('appConfig');

    // if (storedConfig) {
    //   setConfig(JSON.parse(storedConfig));
    // } else {
    fetchConfig();
    // }
  }, [navigate , data]);

  return (
    <ConfigContext.Provider value={config}>
      {config ? children 
      : <RippleLoader/>
      }
    </ConfigContext.Provider>
  );
};

const useConfig = () => {
  const config = useContext(ConfigContext);
  return config;
};

export { ConfigProvider, useConfig };
