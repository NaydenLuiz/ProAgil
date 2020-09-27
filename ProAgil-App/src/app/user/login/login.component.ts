import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ChildActivationStart, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  titulo = 'Login';
  model: any = {};
  constructor(private authService: AuthService,
              public fb: FormBuilder,
              public toastr: ToastrService,
              public router: Router) { }

  ngOnInit() {
      if (localStorage.getItem('token')!= null)
      {
        this.router.navigate(['/dashboard']);
      }
  }

  login()
  {
    this.authService.login(this.model).subscribe(
      () =>{
        this.router.navigate(['/dashboard']);
        this.toastr.success('Logado com Sucesso');
      },
          error =>
          {
            this.toastr.error('Falha ao tentar Logar');
          }
    );

  }

}
