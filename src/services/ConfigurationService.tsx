/* eslint-disable @typescript-eslint/no-explicit-any */
import HttpApiService from "./HttpApiService";

const IS_PROD: boolean = true;
const configAPI = IS_PROD ? "http://happserver-env-1.eba-xn6wqr76.ap-southeast-2.elasticbeanstalk.com" : "http://localhost:3000";
const configAPIs = `${configAPI}/getTenantByName`;
export class Configuration extends HttpApiService {
  constructor() {
    super(`${configAPI}`);
  }

  getConfiguration = () => {
    return this.get(`${configAPI}/config.json`)
  }
  getTenantDetails = (data: any) => {
    return this.get(`${configAPIs}/?name=${data}`)
  }
  getLangHindi = () => {
    return this.get(`${configAPI}/hi.json`)
  }
  getLangEnglish = () => {
    return this.get(`${configAPI}/en.json`)
  }

}
export const ConfigurationService = new Configuration();