/* eslint-disable @typescript-eslint/no-explicit-any */
import HttpApiService from "./HttpApiService";

const API_BASE = "${config.API.BASEURI}";

const IS_PROD: boolean = true;
const scanAPPAPI = IS_PROD ? "http://happserver-env-1.eba-xn6wqr76.ap-southeast-2.elasticbeanstalk.com" : "http://localhost:3000";

export class ScanApp extends HttpApiService {
  constructor() {
    super(`${API_BASE}`);
  }

  onBoarding = (data: any) => {
    return this.post(`${scanAPPAPI}/onboard`, data)
  }
  tenantLogin = (data: any) => {
    return this.post(`${scanAPPAPI}/login`, data)
  }
  getItems = (tenant_id: any, is_special: boolean = true, is_all: boolean = false) => {
    return this.get(`${scanAPPAPI}/getitems?tenant_id=${tenant_id}&is_special=${is_special}&is_all=${is_all}`)
  }
  getTenantAddressByTenantId = (tenant_id: any) => {
    return this.get(`${scanAPPAPI}/getTenantAddressByTenantId?tenant_id=${tenant_id}`)
  }
  getTenants = (offset = 0, limit = 10) => {
    return this.get(`${scanAPPAPI}/gettenants?offset=${offset}&limit=${limit}`)
  }
  deleteItems = (data: any) => {
    return this.post(`${scanAPPAPI}/deleteItems`, data)
  }
  updateItem = (data: any) => {
    return this.post(`${scanAPPAPI}/updateItem`, data)
  }
  postItem = (data: any) => {
    return this.post(`${scanAPPAPI}/saveitem`, data)
  }
  genateQR = (data: any) => {
    return this.post(`${scanAPPAPI}/generateqrcode`, data)
  }
  updateTenant = (data: any) => {
    return this.post(`${scanAPPAPI}/updateTenant`, data)
  }
  deleteTenants = (data: any) => {
    return this.post(`${scanAPPAPI}/deleteTenants`, data)
  }
  updateASpecial = (data: any) => {
    return this.post(`${scanAPPAPI}/updateSpecial`, data)
  }
  deleteATenant = (id: any) => {
    return this.post(`${scanAPPAPI}/deleteById`, id)
  }
}

export const ScanAppService = new ScanApp();
