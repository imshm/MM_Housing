import { Component, OnInit} from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router,} from '@angular/router';
import { LoadingController, Platform ,MenuController, IonRouterOutlet, } from '@ionic/angular';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import {NavController,AlertController,ToastController} from '@ionic/angular';
import {HelperService} from '../Services/helper.service';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import {ApiService} from '../Services/api.service';
import { EmailValidator } from '@angular/forms';
interface Marker {
	lat: number,
	lng: number,
  }
@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.page.html',
  styleUrls: ['./aboutus.page.scss'],
})
export class AboutusPage implements OnInit {
	pdfFiles = [
		{
		  name:'PDF File One',
		  startPage: 2,
		  path: '../new_document.pdf'
		},
		{
			name:'PDF File One',
			startPage: 2,
			path: '../new_document.pdf'
		  },
	  ]
	data: any = {};
	latitude: number;
    longitude: number;
    score_data: any;
	item: any;
	body: string;
	message: string;
	resultData: any;
	pdf: any;
	isChecked: any;
	postData = {
		email: ''
		};
	error: string;
	user_id:any;
  constructor( 
	public loadingCtrl: LoadingController,
	public toastController: ToastController ,
	  private router: Router,
	  private storage: Storage,
	  public navCtrl: NavController,
	  private alertDialog: AlertController,
	  private helper: HelperService,
	  private fileOpener: FileOpener,
	  private api: ApiService,
	  public file: File,
	  private platform: Platform,	
	  public transfer: FileTransfer,
	  public menu: MenuController,
	  private routerOutlet: IonRouterOutlet
	  ) 
  { 
	this.data.username = '';
	
  }
  ngOnInit() {
	this.helper.navParams().then((item: any) => {
		this.item = item;
		//this.item['userid'] = "1";
		// // console.log('longitude', item);
	  }).catch(() => {});
	
	this.storage.get('_SCORE_DATA').then((score_data) => {
		this.score_data = score_data;
		this.body = JSON.stringify({
			data: this.item,
			score_data: score_data});
			 this.submitscore(this.body);
		//this.score_data['data'] = this.item;
		// // console.log('type', this.body);
		
		//this.presentToastWithOptions(this.body);
	  });
	  this.routerOutlet.swipeGesture = false;
	
  }
  ionViewWillEnter() {
	// // console.log('ionViewDidLoad CartPage');
	 this.menu.enable(false);
	 this.routerOutlet.swipeGesture = false;
} 
ionViewDidEnter(){
    this.menu.enable(false);
	this.routerOutlet.swipeGesture = false;
  }

  ionViewWillLeave(){
    this.menu.enable(false);
	this.routerOutlet.swipeGesture = false;
  }
  submitscore(body_score){
	this.presentLoadingDefault();
	
		 console.log('cus_id ionViewDidLoad CartPage', body_score);
	 
	let body = {
		latlong :body_score,
		}
	// // console.log("score", body);
	this.api.postApi('getscore', body).then((data: any) => {
		//const status = data.message;
		// // console.log(data , "stataus");
		
		if(data.status  == '200'){
			this.resultData = data.score;
			this.pdf = data.pdf;
			this.user_id = data.userid;
			this.message= "Your Data successfully sent.";
			this.presentToastWithOptions(this.message);
			this.loadingCtrl.dismiss().catch(() => {});
		//this.helper.pushPage('/category').catch(() => {});
		 }else{
			
			//  // console.log(status, "stataus");
			
			//  this.user_id = data.status;
			 this.message= "Something went wrong, Please try again.";
			 if(this.message)
			{
				 this.helper.pushPage('/introduction').catch(() => {});
			}
		  this.presentToastWithOptions(this.message);
		  this.loadingCtrl.dismiss().catch(() => {});
		//  this.storage.remove('cus_id');	
		 // this.helper.pushPage('/login').catch(() => {});
		  //this.loadingCtrl.dismiss().catch(() => {});
		}
	  },
	  error => {
		// console.log(status, "stataus");
		this.message= "Something went wrong, Please try again.";
		if(this.message)
		{
			 this.helper.pushPage('/introduction').catch(() => {});
		}
	//  this.presentToastWithOptions(this.message);
	 this.loadingCtrl.dismiss().catch(() => {});
		// console.log("Error"+JSON.stringify(error));
		//this.loadingCtrl.dismiss().catch(() => {});
	  })
	
  }
  addValue(e): void {
	this.isChecked = e.currentTarget.checked;
	// console.log(this.isChecked);//undefined

}
validateInputs() {
	let email = this.postData.email.trim();
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return (
	this.postData.email &&
	email.length > 0 && re.test(this.postData.email)
	
	);
	}
login(form){
	
	if (this.validateInputs()) {
		// console.log(this.postData);//undefined
		this.error = ""
		 this.submitemail(this.pdf,this.postData.email,this.user_id);
		} else {
			this.error = "Please enter email."
		// console.log('Please enter email.');
		}
  }
  submitemail(pdf,email,user_id){
	this.presentLoadingDefault();
	
		// console.log('cus_id ionViewDidLoad CartPage', pdf,email);
	
	let body = {
		pdf:pdf,
		mail_id :email,
		user_id:user_id
		}
	// console.log("score", body);
	this.api.postApi('send_email', body).then((data: any) => {
		//const status = data.message;
		// console.log(data , "stataus");
		
		if(data.status  == '200'){
			
			this.message= "Your pdf sent successfully on your mail.Please check your email.";
			this.presentToastWithOptions(this.message);
			if(this.message)
			{
				this.helper.pushPage('/introduction').catch(() => {});
			}
			this.loadingCtrl.dismiss().catch(() => {});
		//this.helper.pushPage('/category').catch(() => {});
		 }else{
			
			 // console.log(status, "stataus");
			 this.message= "Something went wrong, Please try again.";
			 if(this.message)
			{
				this.helper.pushPage('/introduction').catch(() => {});
			}
		  this.presentToastWithOptions(this.message);
		  this.loadingCtrl.dismiss().catch(() => {});
		//  this.storage.remove('cus_id');	
		 // this.helper.pushPage('/login').catch(() => {});
		  //this.loadingCtrl.dismiss().catch(() => {});
		}
	  },
	  error => {
		// console.log(status, "stataus");
		this.message= "Something went wrong, Please try again.";
		if(this.message)
		{
			 this.helper.pushPage('/introduction').catch(() => {});
		}
	//  this.presentToastWithOptions(this.message);
	 this.loadingCtrl.dismiss().catch(() => {});
		// console.log("Error"+JSON.stringify(error));
		//this.loadingCtrl.dismiss().catch(() => {});
	  })
	
  }
  
	  async presentToastWithOptions(message) {
		const toast = await this.toastController.create({
		 // header: 'Toast header',
		  message: message,
		  position: 'bottom',
		  duration: 2000,
		  buttons: [
			{
			  handler: () => {
				// console.log('Favorite clicked');
			  }
			}, {
			//   text: 'Done',
			//   role: 'cancel',
			//   handler: () => {
			// 	// console.log('Cancel clicked');
			//   }
			}
		  ]
		});
		toast.present();
	  }
	
	  async presentLoadingDefault() {
        const loading = await this.loadingCtrl.create({

          message: 'Please wait for a moment...',
          translucent: true,
          spinner: 'crescent',
          showBackdrop: true,
          cssClass: 'loader',
        //  duration: 10000

        });
        return await loading.present();
      }
downloadImage() {	
		this.platform.ready().then(() => {
		let url = encodeURI("http://www.africau.edu/images/default/sample.pdf");
        const fileTransfer: FileTransferObject = this.transfer.create();
	//  this.http.downloadFile(url, {},{},this.file.externalRootDirectory + "DownloadFile.pdf").then((entry)
	    fileTransfer.download(url,this.file.externalRootDirectory + "DownloadFile.pdf").then((entry) => {
		// console.log("Download Succeeded!" + this.file.externalRootDirectory);
		// console.log('download completed: ' + entry.toURL());
		// console.log('success block...', entry);
   // open downloaded file 
  // this.downloadFile = entry.toURL();
		this.fileOpener.open(entry.toURL(), 'application/pdf')
			.then(() => 
			console.log('File is opened'))
			.catch(e => 
				console.log('Error opening file', e));
			}, (error) => {
				// console.log("Download Failed!");
				// console.log('error block ... ', error.status);
				});
			});
	}
	
//   downloadPdf(pdfUrl: string, pdfName: string ) {
//     //const pdfUrl = './assets/sample.pdf';
// 	//const pdfName = 'your_pdf_file';
// 	// console.log(pdfUrl);
//     FileSaver.saveAs(pdfUrl, pdfName);
//   }

//   openDoc(pdfUrl: string, startPage: number ) {
//     window.open(pdfUrl + '#page=' + startPage, '_blank', '', true);
//   }
//   download_dir()
//   {
//     this.platform.ready().then(() => {
// 		let url = "https://zvelo.com/wp-content/uploads/2018/11/anatomy-of-a-full-path-url-hostname-tld-path-protocol.jpg";
//       const fileTransfer: FileTransferObject = this.transfer.create();

//     this.file.createDir(this.file.externalRootDirectory, 'my_downloads', false).then(response => {
// 		// console.log('Directory created',response);
// 	//	const fileTransfer: TransferObject = this.transfer.create();
// 	    fileTransfer.download(url,this.file.externalRootDirectory + '/my_downloads/' + "name" + '.jpg').then((entry) => {
// 	    	// console.log('file download response',entry);
// 	    })
// 	    .catch((err) =>{
// 	    	// console.log('error in file download',err);
// 	    });

// 	}).catch(err => {
// 		// console.log('Could not create directory "my_downloads" ',err);
// 	}); 

//     });
// }

}
