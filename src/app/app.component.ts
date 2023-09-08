import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Dubbizel_Angular';
  user:any
  loggedIn:any
  constructor(private AuthService : SocialAuthService){
  }
  ngOnInit(){
    this.AuthService.authState.subscribe((user)=>{
      this.user = user
      this.loggedIn =(user != null)
      console.log(this.user)

    })
  }
}
