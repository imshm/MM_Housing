import {Injectable} from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  LoadingController,
  MenuController,
  ModalController,
  NavController,
  Platform,
  PopoverController,
  ToastController
} from '@ionic/angular';
import {Toast} from '@ionic-native/toast/ngx';
import {Keyboard} from '@ionic-native/keyboard/ngx';
import {DatePipe} from '@angular/common';
import _ from 'lodash';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {ActivatedRoute, Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';

declare var window;
@Injectable({
  providedIn: 'root'
})
export class HelperService {
  event$: BehaviorSubject<any> = new BehaviorSubject(null);

  DH: any = 0; DW: any = 0; _ = _;
  loading; toast;
  private cart = [];
  constructor(private platform: Platform,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              private actionSheetCtrl: ActionSheetController,
              private alertCtrl: AlertController,
              private modalCtrl: ModalController,
              private popOverCtrl: PopoverController,
              private menuCtrl: MenuController,
              private nativeToast: Toast,
              private keyboard: Keyboard,
              private statusBar: StatusBar,
              private datePipe: DatePipe,
              private navCtrl: NavController,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
    this.platform.ready().then(() => {
      this.DH = this.platform.height();
      this.DW = this.platform.width();
    }).catch(() => {});
  }
  eventPublish(eventName, data = null) {
    this.event$.next({eventName, data});
  }
  eventResMatch(eventName, res, isData = false) {
    return isData ? (res && res.eventName && res.data && (res.eventName === eventName)) : (res && res.eventName && (res.eventName === eventName));
  }
  getDatePipe(val, format = null) {
    return format ? this.datePipe.transform(val, format) : this.datePipe.transform(val);
  }
  async presentLoadingWithOptions(msg= 'Please wait a moment', customCssClass= 'myLoader') {
    this.dismissLoading();
    this.loading = await this.loadingCtrl.create({
      id: 'myLoader',
      spinner: 'bubbles',
      message: msg,
      translucent: true,
      cssClass: customCssClass
    });
    return await this.loading.present();
  }
  async presentNewToast(msg = 'No action required.', dur = '2000', pos = 'bottom') {
    this.dismissLoading();
    if (this.platform.is('android') || this.platform.is('ios')) {
      try {
        this.nativeToast.hide().catch(() => {
        });
      } catch (e) {
      }
      this.nativeToast.showWithOptions({
        message: msg,
        duration: _.toNumber(dur),
        position: pos,
        addPixelsY: pos === 'bottom' ? (-150) : 0,
      }).subscribe(() => {
      });
    } else {
      try {
        this.toastCtrl.dismiss().catch(() => {
        });
      } catch (e) {
      }
      this.toast = await this.toastCtrl.create({
        message: msg,
        duration: +dur,
        position: pos === 'center' ? 'middle' : pos === 'top' ? 'top' : 'bottom'
      });
      this.toast.present().catch(() => {
      });
    }
  }
  async presentAlert(head = '', msg = '', subHeader = '', cssClass = '', cancelText = 'Okay',) {
    this.onScrollCloseKeyBoard();
    return new Promise(async (resolve, reject) => {
      const alert = await this.alertCtrl.create({
        cssClass: cssClass,
        header: head,
        subHeader: subHeader,
        message: msg,
        buttons: [{
          text: cancelText,
          role: 'cancel',
          cssClass: 'cancelBtn ion-text-capitalize',
          handler: () => {
            return resolve('cancel');
          }
        }],
      });
      setTimeout(async () => {
        await alert.present();
      }, 100);
    }).catch(() => {});
  }
  presentAlertConfirm(head = 'Confirm!', msg = '', confirmText = 'Okay', cancelText = 'Cancel', cancelBtnClass = '', confirmBtnClass = '', subHeader = '') {
    this.onScrollCloseKeyBoard();
    return new Promise(async (resolve, reject) => {
      const alert = await this.alertCtrl.create({
        header: head,
        subHeader: subHeader,
        message: msg,
        cssClass: 'myAlert',
        buttons: [
          {
            text: cancelText,
            role: 'cancel',
            cssClass: 'cancelBtn ion-text-capitalize ' + cancelBtnClass,
            handler: () => {
              return reject(false);
            }
          }, {
            text: confirmText,
            cssClass: 'confirmBtn ion-text-capitalize ' + confirmBtnClass,
            handler: () => {
              return resolve(true);
            }
          }
        ]
      });
      setTimeout(async () => {
        await alert.present();
      }, 100);
    }).catch(() => {});
  }
  dismissLoading() {
    try { this.loading.dismiss().catch(() => {}); } catch (e) {}
  }
  onScrollCloseKeyBoard() {
    if (this.platform.is('android')) {
      try { window.Keyboard.hide(); } catch (e) { }
    }
    if (this.platform.is('ios')) {
      try { this.keyboard.hide(); } catch (e) { }
    }
  }
  async closeAllPopups() {
    try {
      const element = await this.loadingCtrl.getTop();
      if (element) { element.dismiss().catch(() => {}); }
    } catch (error) {}
    try {
      const element = await this.actionSheetCtrl.getTop();
      if (element) { element.dismiss().catch(() => {}); }
    } catch (error) {}
    try {
      const element = await this.popOverCtrl.getTop();
      if (element) { element.dismiss().catch(() => {}); }
    } catch (error) {}
    try {
      const element = await this.modalCtrl.getTop();
      if (element) { element.dismiss().catch(() => {}); }
    } catch (error) {}
    try {
      const element = await this.menuCtrl.getOpen();
      if (element) { this.menuCtrl.close().catch(() => {}); }
    } catch (error) {}
  }
  setStatusBar() {
    try {
      this.statusBar.overlaysWebView(true);
      this.statusBar.overlaysWebView(false);
    } catch (e) {}
  }
  pushRootPage(page, navData = null) {
    return new Promise(resolve => {
      navData ? this.navCtrl.navigateRoot(page, {state: navData }).then(() => {
        return resolve(true);
      }).catch((e) => {
        console.log('Page push error - ', e);
        return resolve(false);
      }) : this.navCtrl.navigateRoot(page).then(() => {
        return resolve(true);
      }).catch((e) => {
        console.log('Page push error - ', e);
        return resolve(false);
      });
    });
  }
  pushPage(page, navData = null) {
    return new Promise(resolve => {
      navData ? this.navCtrl.navigateForward(page, {state: navData }).then(() => {
        return resolve(true);
      }).catch((e) => {
        console.log('Page push error - ', e);
        return resolve(false);
      }) : this.navCtrl.navigateForward(page).then(() => {
        return resolve(true);
      }).catch((e) => {
        console.log('Page push error - ', e);
        return resolve(false);
      });
    });
  }
  popPage() {
    return new Promise(resolve => {
      this.navCtrl.pop().then(() => {
        return resolve(true);
      }).catch((e) => {
        return resolve(false);
      });
    });
  }
  navParams() {
    return new Promise(resolve => {
      this.activatedRoute.queryParams.subscribe(async () => {
        try {
          const routParams = this.router.getCurrentNavigation().extras.state || null;
          return resolve(routParams);
        } catch (e) {
          return resolve(undefined);
        }
      });
    });
  }

}

