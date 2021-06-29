import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SITE_URLS, VARS} from './constants.service';
import _ from 'lodash';
import {HelperService} from './helper.service';
import {SERVER_URL} from '../environment';
import {SERVER_URL_MAIN} from '../environment';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient,
              private helper: HelperService) { }
  static _successRes(res, dl = false, ddl = false) {
    // return ddl ? (res && res.status && res.code && _.includes([200, 201, 202, 203, 204], res.code) && res.data && res.data.data && res.data.data.length) : dl ? (res && res.status && res.code && _.includes([200, 201, 202, 203, 204], res.code) && res.data && res.data.length) : (res && res.status && res.code && _.includes([200, 201, 202, 203, 204], res.code));
    return ddl ? (res && res.status && _.includes([200, 201, 202, 203, 204], _.toNumber(res.status)) && res.data && res.data.data && res.data.data.length) : dl ? (res && res.status && _.includes([200, 201, 202, 203, 204], _.toNumber(res.status)) && res.data && res.data.length) : (res && res.status && _.includes([200, 201, 202, 203, 204], _.toNumber(res.status)));
  }
  static validateApiToken(url, userDetails) {
    if (_.includes([SITE_URLS.LOGIN], url)) {
      return true;
    } else { return !!(userDetails && userDetails.api_token); }
  }
  public postApi(url, data, showToast = false, toastTime = '1000', showAllToast = true, toastPos = 'bottom', isFormData = false, specialCheck = false) {
    return new Promise(resolve => {
      this.http.post(SERVER_URL + url, data).subscribe(async (res: any) => {
        console.log('res - data', res, data);
        if (ApiService._successRes(res)) {
          if (showToast && showAllToast) { await this.helper.presentNewToast(res.message, toastTime, toastPos); }
          return resolve(res);
        } else {
          await this.handleSuccessResponse(res, showToast, showAllToast, toastTime, toastPos, specialCheck);
          return resolve(res);
        }
      }, async e => {
        // await this.handleErrorResponse(e, toastTime, showAllToast);
        // return resolve(e);
      });
    });
  }
  public getApi(url,showToast = false, toastTime = '1000', showAllToast = true, toastPos = 'bottom', isFormData = false, specialCheck = false) {
    return new Promise(resolve => {
      this.http.get(SERVER_URL + url,).subscribe(async (res: any) => {
        console.log('res - data', res);
        if (ApiService._successRes(res)) {
          if (showToast && showAllToast) { await this.helper.presentNewToast(res.message, toastTime, toastPos); }
          return resolve(res);
        } else {
          await this.handleSuccessResponse(res, showToast, showAllToast, toastTime, toastPos, specialCheck);
          return resolve(res);
        }
      }, async e => {
        await this.handleErrorResponse(e, toastTime, showAllToast);
        return resolve(e);
      });
    });
  }
  public postApi2(url, data, showToast = false, toastTime = '1000', showAllToast = true, toastPos = 'bottom', isFormData = false, specialCheck = false) {
    return new Promise(resolve => {
      this.http.post(SERVER_URL_MAIN + url, data).subscribe(async (res: any) => {
        console.log('res - data', res, data);
        if (ApiService._successRes(res)) {
          if (showToast && showAllToast) { await this.helper.presentNewToast(res.message, toastTime, toastPos); }
          return resolve(res);
        } else {
          await this.handleSuccessResponse(res, showToast, showAllToast, toastTime, toastPos, specialCheck);
          return resolve(res);
        }
      }, async e => {
        await this.handleErrorResponse(e, toastTime, showAllToast);
        return resolve(e);
      });
    });
  }
  
  async handleSuccessResponse(res, successToast, allToast, toastTime, toastPos, specialCheck) {
    if (res.status === false && res.code === 401) {
      // this.auth.logout(true, false, res.message);
      return (res);
    } else {
      if (allToast) {
        await this.helper.presentNewToast(res.message, toastTime, toastPos);
      }
      return (res);
    }
  }
  async handleErrorResponse(e, toastTime, allToast) {
    if (allToast) {
      await this.helper.presentNewToast(((e.name === 'HttpErrorResponse') ? VARS.ON_HTTP_CONNECTION_LOST : e.error.message), toastTime, 'bottom');
    }
    setTimeout(() => {
      this.helper.dismissLoading();
    }, 100);
    return (e);
  }
}
