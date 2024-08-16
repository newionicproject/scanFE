/* eslint-disable @typescript-eslint/no-explicit-any */
import HttpApiService from "./HttpApiService";

const API_BASE = "${config.API.BASEURI}";


 const PaytmAPI = "https://secure.paytm.in/oltp-web"

export class Payment extends HttpApiService {
  constructor() {
    super(`${API_BASE}`);
  } 
 
  makePayment = (data:any)=>{
    return this.post(`${PaytmAPI}/create`, data)
  }
  makePaytmPayment = (data:any)=>{
    return this.post(`${PaytmAPI}/processTransaction`, data)
  }
  updatePaymentStatus  = (data:any)=>{
    return this.post(`${PaytmAPI}/updatePaymentStatus`, data)
  }
  paymentFormSubmit = (data:any)=>{
    return this.post(`${PaytmAPI}/paymentForm/submit`, data)
  }
  paymentFormUpdate = (data:any)=>{
    return this.post(`${PaytmAPI}/paymentForm/update`, data)
  }
}

export const PaymentService = new Payment();
