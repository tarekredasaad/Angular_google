// import { Component, NgZone, OnInit } from '@angular/core';
// import { AuthService } from 'src/app/Service/auth.service';
// import { SocialAuthService, GoogleLoginProvider, SocialUser } from '@abacritt/angularx-social-login';
// import { Subscription } from 'rxjs';

// import { GoogleAuth } from 'google-auth-library';

// declare const gapi: any;
// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.scss']
// })

// export class LoginComponent implements OnInit{
//   showError:any
//   user!: SocialUser;
//   private userSubscription: Subscription | undefined;

//   constructor(private authService: SocialAuthService,private ngZone: NgZone
//     ,private AuthService:AuthService) {}

//   ngOnInit(): void {
//     this.userSubscription = this.authService.authState.subscribe(user => {
//       this.user = user;
//     });

//     gapi.load('auth2', () => {
//       gapi.auth2.init({
//         client_id: '400690855047-gkqnu3ioohb9vbc0pevpoa5h5eis6oc6.apps.googleusercontent.com'

//       });
//     });
//   }

//   onSignIn(): void {
//     const auth2 = gapi.auth2.getAuthInstance();
//     auth2.signIn().then((googleUser: { getAuthResponse: () => { (): any; new(): any; id_token: any; }; }) => {
//       this.ngZone.run(() => {
//         const idToken = googleUser.getAuthResponse().id_token;
//         this.authService.signIn(GoogleLoginProvider.PROVIDER_ID, { idToken }).catch(error => {
//           console.error('Error signing in:', error);
//         });
//       });
//     });
//   }


//   signInWithGoogle(): void {
//     this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).catch(error => {
//       console.error('Error signing in:', error);
//     });
//   }

//   signOut(): void {
//     this.authService.signOut().catch(error => {
//       console.error('Error signing out:', error);
//     });
//   }
// //  async ngOnInit(){
// //   const auth = new GoogleAuth();
// //   const client = await auth.getClient();

// // }
//   externalLogin = () => {
//     this.showError = false;
//     this.AuthService.signInWithGoogle();
//   }
// }
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, NgZone } from '@angular/core';
import { SocialAuthService, GoogleLoginProvider , SocialUser } from '@abacritt/angularx-social-login';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/Service/auth.service';

declare const google: any;
declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy, AfterViewInit {
  user!: SocialUser;
  private userSubscription: any;
  showError:any
  @ViewChild('googleSignInButton', { static: false })
  googleSignInButton!: ElementRef;
  auth2: any;
    
  @ViewChild('loginRef', {static: false }) loginElement!: ElementRef;
     
  constructor(private AuthService :AuthService ,private authService: SocialAuthService, private ngZone: NgZone) {

    // this.AuthService.fetchData().subscribe(data => {
    //   console.log(data);
    // });
  }

  ngOnInit(): void {
     this.authService.authState.subscribe(user => {
      this.user = user;
    });
gapi.load('auth2', () => {
  gapi.auth2.init({
    client_id: '400690855047-gkqnu3ioohb9vbc0pevpoa5h5eis6oc6.apps.googleusercontent.com'

  });
});
    console.log(this.user)
    setInterval(() => {
      
  

      if(this.AuthService.user != null){
        console.log("good")

        console.log(this.AuthService.externalAuth)
        console.log(this.AuthService.user)
        this.AuthService.sendUserData(this.AuthService.user).subscribe({
          next: data => console.log(data),
          error: err => console.log(err),
        })
      }
    }
      
      ,3000)
  }
onSignIn(): void {
  const auth2 = gapi.auth2.getAuthInstance();
  auth2.signIn().then((googleUser: { getAuthResponse: () => { (): any; new(): any; id_token: any; }; }) => {
    this.ngZone.run(() => {
      const idToken = googleUser.getAuthResponse().id_token;
      this.authService.signIn(GoogleLoginProvider.PROVIDER_ID, { idToken }).catch(error => {
        console.error('Error signing in:', error);
      });
    });
  });
}
  callLoginButton() {
     
    this.auth2.attachClickHandler(this.loginElement.nativeElement, {},
      (googleAuthUser:any) => {
     
        let profile = googleAuthUser.getBasicProfile();
        console.log('Token || ' + googleAuthUser.getAuthResponse().id_token);
        console.log('ID: ' + profile.getId());
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail());
            
       /* Write Your Code Here */
    
      }, (error:any) => {
        alert(JSON.stringify(error, undefined, 2));
      });
 
  }
  
  googleAuthSDK() {
     
    (<any>window)['googleSDKLoaded'] = () => {
      (<any>window)['gapi'].load('auth2', () => {
        this.auth2 = (<any>window)['gapi'].auth2.init({
          client_id: '400690855047-gkqnu3ioohb9vbc0pevpoa5h5eis6oc6.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
          scope: 'profile email'
        });
        this.callLoginButton();
      });
    }

    (function(d, s, id){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement('script'); 
      js.id = id;
      js.src = "https://apis.google.com/js/platform.js?onload=googleSDKLoaded";
      fjs?.parentNode?.insertBefore(js, fjs);
    }(document, 'script', 'google-jssdk'));
  }

  onGoogleSignIn(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }
  externalLogin = () => {
    this.showError = false;
    this.AuthService.signInWithGoogle();
  }
  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }
  ngAfterViewInit(): void {
    this.renderGoogleSignInButton();
    this.googleAuthSDK();

  }

  renderGoogleSignInButton(): void {
    google.accounts.id.initialize({
      client_id: '400690855047-gkqnu3ioohb9vbc0pevpoa5h5eis6oc6.apps.googleusercontent.com',
      callback: (response:any) => this.onSignIn2()
    });
    console.log("reach")
    google.accounts.id.renderButton(this.googleSignInButton.nativeElement, {
      theme: 'outline',
      size: 'large',
      width: '240',
      height: '50',
      longtitle: true
    });
  }

  onSignIn2(): void {
    // this.ngZone.run(() => {
      console.log("reach on")

      // const idToken = response.credential;
      this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).catch(error => {
        console.error('Error signing in:', error);
      });
    // });
  }

  signOut(): void {
    this.authService.signOut().catch(error => {
      console.error('Error signing out:', error);
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
