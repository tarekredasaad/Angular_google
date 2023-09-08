import { Injectable } from '@angular/core';
import { SocialAuthService, SocialUser } from "@abacritt/angularx-social-login";
import { GoogleLoginProvider } from "@abacritt/angularx-social-login";
import { Subject, catchError, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ExternalAuthDto } from '../interfaces/ExternalAuthDto';
// import { EnvironmentUrlService } from './path/to/environment-url.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:7189/';
  private apiUrl2 = 'https://your-server.com/api/daapi/Account/ExternalLoginta';

  user:any
  externalAuth:ExternalAuthDto = {
    idToken:"",
    provider:""
  }
  private authChangeSub = new Subject<boolean>();
private extAuthChangeSub = new Subject<SocialUser>();
public authChanged = this.authChangeSub.asObservable();
public extAuthChanged = this.extAuthChangeSub.asObservable();
constructor(private http: HttpClient,
  //  private envUrl: EnvironmentUrlService, 
  // private jwtHelper: JwtHelperService,
   private externalAuthService: SocialAuthService) { 
    this.externalAuthService.authState.subscribe((user) => {
      console.log(user)
      this.user = user
      this.externalAuth.idToken = user.idToken
      this.externalAuth.provider = user.provider

      this.extAuthChangeSub.next(user);
    })
  }
  //'400690855047-gkqnu3ioohb9vbc0pevpoa5h5eis6oc6.apps.googleusercontent.com'
  fetchData() {
    return this.http.get(this.apiUrl2);
  }
  public signInWithGoogle = ()=> {
    this.externalAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }
  sendUserData(user: any) {
    
    console.log(user)
    this.externalAuth.idToken = this.user.idToken
    this.externalAuth.provider = this.user.provider
    console.log(this.externalAuth.idToken)
    console.log(this.user.idToken)
    console.log(this.user.provider)
    console.log(this.externalAuth)
    return this.http.post(this.apiUrl, this.externalAuth).pipe(catchError((err: { message: any; }) => {
      return throwError(() => err.message || "server error");
    }));;
  }
  sendUserDataToApi(userData: any): void {
    const user = {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      imageUrl: userData.imageUrl,
    };
  }
  public signOutExternal = () => {
    this.externalAuthService.signOut();
  }
}
