import { Injectable } from '@angular/core';
import {INPUT_TYPE_NAME, USER_DETAILS, VALIDATION_MSG, VARS} from './constants.service';
import {AbstractControl, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class StaticService {
  constructor() {}
  static formError(formControl, fieldName, type: INPUT_TYPE_NAME = 'OTHER', opts: any = null) {
    const options: any = {};
    options.isRequired          = !!(opts && opts.isRequired);
    options.equal               = (opts && opts.equal) ? opts.equal : null;
    options.min                 = (opts && opts.min) ? opts.min : 0;
    options.max                 = (opts && opts.max) ? opts.max : 1;
    options.minLength           = (opts && opts.minLength) ? opts.minLength : 0;
    options.maxLength           = (opts && opts.maxLength) ? opts.maxLength : 1;
    options.passwordEqualField  = (opts && opts.passwordEqualField) ? opts.passwordEqualField : 'password';
    const validationResponse = { msg: null, data: [] };
    if (formControl[fieldName].touched) {
      switch (type) {
        case '_EMAIL': {
          if (formControl[fieldName].hasError('required') || (options.isRequired) ? !_.toString(formControl[fieldName].value).trim() : false) {
            validationResponse.msg = VALIDATION_MSG.ERR_REQUIRED_FIELD;
          }
          if (formControl[fieldName].hasError('pattern')) {
            validationResponse.msg = VALIDATION_MSG.ERR_EMAIL_PATTERN;
          }
          break;
        }
        case '_PASSWORD': {
          if (formControl[fieldName].hasError('required') || (options.isRequired) ? !_.toString(formControl[fieldName].value).trim() : false) {
            validationResponse.msg = VALIDATION_MSG.ERR_REQUIRED_FIELD;
          }
          if (formControl[fieldName].hasError('minlength')) {
            validationResponse.msg = VALIDATION_MSG.ERR_PASS_MIN_LENGTH;
          }
          break;
        }
        case '_INPUT': {
          if (formControl[fieldName].hasError('required') || (options.isRequired) ? !_.toString(formControl[fieldName].value).trim() : false) {
            validationResponse.msg = VALIDATION_MSG.ERR_REQUIRED_FIELD;
          }
          break;
        }
        case '_SELECT': {
          if (formControl[fieldName].hasError('required')) {
            validationResponse.msg = VALIDATION_MSG.ERR_REQUIRED_SELECT;
          }
          break;
        }
        case '_EQUAL': {
          if (formControl[fieldName].hasError('required') || (options.isRequired) ? !_.toString(formControl[fieldName].value).trim() : false) {
            validationResponse.msg = VALIDATION_MSG.ERR_REQUIRED_FIELD;
          }
          if (formControl[fieldName].hasError('equalTo') || formControl[options.passwordEqualField].value !== formControl[fieldName].value) {
            validationResponse.msg = VALIDATION_MSG.ERR_FIELD_NOT_MATCH;
          }
          break;
        }
        case '_MINLENGTH_MAXLENGTH_SAME': {
          if (formControl[fieldName].hasError('required') || (options.isRequired) ? !_.toString(formControl[fieldName].value).trim() : false) {
            validationResponse.msg = VALIDATION_MSG.ERR_REQUIRED_FIELD;
          }
          if (formControl[fieldName].hasError('minlength') || formControl[fieldName].hasError('maxlength')) {
            validationResponse.msg = (options && options.minLength && options.maxLength) ? '*Enter ' + options.minLength + 'digit only.' : VALIDATION_MSG.ERR_LENGTH_NOT_MATCH;
          }
          break;
        }
        case '_PATTERN_NUM_MIN_MAX': {
          if (formControl[fieldName].hasError('required') || (options.isRequired) ? !_.toString(formControl[fieldName].value).trim() : false) {
            validationResponse.msg = VALIDATION_MSG.ERR_REQUIRED_FIELD;
          }
          if (formControl[fieldName].hasError('pattern')) {
            validationResponse.msg = VALIDATION_MSG.ERR_NUMERIC_ONLY;
          }
          if (formControl[fieldName].hasError('min')) {
            validationResponse.msg = VALIDATION_MSG.ERR_GREATER_OR_EQUAL + options.min;
          }
          if (formControl[fieldName].hasError('max')) {
            validationResponse.msg = VALIDATION_MSG.ERR_LESS_OR_EQUAL + options.max;
          }
          break;
        }
        case '_MAX_CHAR': {
          if (formControl[fieldName].hasError('required') || (options.isRequired) ? !_.toString(formControl[fieldName].value).trim() : false) {
            validationResponse.msg = VALIDATION_MSG.ERR_REQUIRED_FIELD;
          }
          if (formControl[fieldName].hasError('maxlength')) {
            validationResponse.msg = 'Max ' + options.maxLength + 'Character allowed!';
          }
          break;
        }
        case '_MIN_CHAR': {
          if (formControl[fieldName].hasError('required') || (options.isRequired) ? !_.toString(formControl[fieldName].value).trim() : false) {
            validationResponse.msg = VALIDATION_MSG.ERR_REQUIRED_FIELD;
          }
          if (formControl[fieldName].hasError('minlength')) {
            validationResponse.msg = 'Min ' + options.minLength + 'Character required!';
          }
          break;
        }
        case 'PASSWORD': { // not required
          if (formControl[fieldName].hasError('minlength')) {
            validationResponse.msg = VALIDATION_MSG.ERR_PASS_MIN_LENGTH;
          }
          break;
        }
        case 'MINLENGTH_MAXLENGTH_SAME': { // not required
          if (formControl[fieldName].hasError('minlength') || formControl[fieldName].hasError('maxlength')) {
            validationResponse.msg = (options && options.minLength && options.maxLength) ? '*Enter ' + options.minLength + 'digit only.' : VALIDATION_MSG.ERR_LENGTH_NOT_MATCH;
          }
          break;
        }
        case 'OTHER': {
          break;
        }
        default: {
          break;
        }
      }
    }
    return validationResponse;
  }
  static markFormGroupTouched(form, invalidElements = [], focusIndex = 1) {
    try {
      form.markAllAsTouched();
    } catch (e) {}
    if (invalidElements && invalidElements.length > focusIndex) {
      try {
        invalidElements[focusIndex].setFocus();
      } catch (e) {}
    }
  }
  static myCustomValidator(fieldNameOrVal, valType = 'equalTo'): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
      const input = control.value;
      const isValid = (valType === 'equalTo') ? (control.root.value[fieldNameOrVal] === input) : (valType === 'greaterThan') ? (input > fieldNameOrVal) : (valType === 'lessThan') ? (input < fieldNameOrVal) : false;
      if (!isValid) {
        return { [valType]: {isValid} };
      } else {
        return null;
      }
    };
  }
  static getThisInputForm(email = false) {
    const v = email ? [Validators.required, Validators.pattern(VARS.EMAIL_PATTERN)] : [Validators.required];
    return new FormGroup({
      this_input : new FormControl('', v),
    });
  }
  static getThisInputExtraForm() {
    return new FormGroup({
      this_input : new FormControl('', [Validators.required]),
      input_extra : new FormControl(''),
    });
  }
  static getLoginForm() {
    return new FormGroup({
      username : new FormControl('', [Validators.required]),
      password : new FormControl('', [Validators.required])
    });
  }
  static addNewFormControl(form, key, value) {
    form.addControl(key, new FormControl(value));
  }
  static getRandomNum(a, b: any = true) {
    return _.random(a, b)
  }
  static getNextLetter(char: string) {
    let code: number = char.charCodeAt(0);
    code++;
    return String.fromCharCode(code);
  }
  static setFormVal(formC, key, value) {
    try {
      formC[key].setValue(value);
      formC[key].markAsTouched();
    } catch (e) {}
  }
  static snapshotToArray = snapshot => {
    let returnArr = [];
    let item = snapshot.val();
    if (item) {
      _.forEach(item, childSnapshot => {
        returnArr.push(childSnapshot);
      });
    }
    return returnArr;
  };
  static dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], {type: mimeString});
  }
  downloadDataURI(dataURL, filename) {
    if (navigator.userAgent.indexOf('Safari') > -1 && navigator.userAgent.indexOf('Chrome') === -1) {
      window.open(dataURL);
    } else {
      const blob = StaticService.dataURItoBlob(dataURL);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    }
  }
  static setUserDetails(userDetails) {
    USER_DETAILS.DATA = userDetails;
  }
}
