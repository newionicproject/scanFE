/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, AxiosPromise, AxiosResponse } from "axios";

class HttpApiService {
  private _axiosInstance: AxiosInstance | undefined;
  private _baseURL: string;
  private _token: string | null;

  constructor(baseURL: string) {
    this._baseURL = baseURL;
    this._token = null;
    this.createAxiosInstance();
  }

  private defaultOptions = (): any => {
    // Set the AUTH token for any request

    const authHttpHeader = "Bearer token"; // Token goes here
    this._token = authHttpHeader;

    const options = {
      baseURL: this._baseURL,
      // withCredentials: true, // Window Authentification
      headers: {
        Accept: "application/json",
        // 'Authorization': `${authHttpHeader}` // OAuth Authetification
      },
    };
    return options;
  };

  /**
   * Create instance
   */
  private createAxiosInstance() {
    this._axiosInstance = axios.create(this.defaultOptions());

    // this.checkAutorization()

    // Add a request interceptor
    this._axiosInstance.interceptors.request.use(
      (config) => config,
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add a response interceptor
    this._axiosInstance.interceptors.response.use(this.handleSuccess);
  }

  protected getToken() {
    return this._token;
  }

  protected get(endpoint: string, conf = {}): AxiosPromise {
    return new Promise((resolve, reject) => {
      // console.log(`get :: `, conf);
      this._axiosInstance!.get(`${endpoint}`, conf)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  protected create(endpoint: string, data: {}, conf = {}): AxiosPromise {
    return this.post(endpoint, data, conf);
  }

  protected post(endpoint: string, data: {}, conf = {}): AxiosPromise {
    return new Promise((resolve, reject) => {
      this._axiosInstance!.post(`${endpoint}`, data, conf)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  protected update(endpoint: string, data: {}, conf = {}): AxiosPromise {
    return new Promise((resolve, reject) => {
      this._axiosInstance!.put(`${endpoint}`, data, conf)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  protected delete(endpoint: string, id: any, conf = {}): AxiosPromise {
    return new Promise((resolve, reject) => {
      this._axiosInstance!.delete(`${endpoint}/${id}`, conf)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  protected deleteFile(endpoint: string, conf = {}): AxiosPromise {
    return new Promise((resolve, reject) => {
      this._axiosInstance!.delete(`${endpoint}`, conf)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  protected uploadFile(
    endpoint: string,
    data: FormData,
    conf = {}
  ): AxiosPromise {
    return this.post(endpoint, data, conf);
  }

  protected downloadFile(endpoint: string): AxiosPromise {
    const conf = {
      responseType: "blob", // important
      timeout: 30000,
    };
    return this.get(endpoint, conf);
  }

  handleSuccess(response: AxiosResponse) {
    // console.log("resp", response);
    sessionStorage.removeItem("errors");
    sessionStorage.removeItem("errorsdefault");
    return response;
  }

  redirectTo = (document: any, path: string) => {
    document.location = path;
  };
}

export default HttpApiService;
