import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceFinalService } from '../../services/login/service-final.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private router = inject(Router);
  private service = inject(ServiceFinalService);

  loginForm: FormGroup = new FormGroup({
    user: new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ])
  });

  onSubmitLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const { user, password } = this.loginForm.value;
    this.service.login(user, password).subscribe({
      next: (user) => {
        this.router.navigate(['/game']);
      },
      error: (error) => {
        console.error('fallo el login:', error);
      }
    });
  }
}