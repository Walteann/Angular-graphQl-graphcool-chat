import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '../../../../../node_modules/@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { takeWhile } from 'rxjs/operators';
import { ErrorService } from '../../../core/services/error.service';
import { MatSnackBar } from '../../../../../node_modules/@angular/material';
import { Router } from '@angular/router';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

    @HostBinding('class.app-login-spinner') private applySpinnerClass = true;

    loginForm: FormGroup;

    configs = {
        isLogin: true,
        actionText: 'Sign In',
        buttonActionText: 'Create account',
        isLoading: false
    };

    private nameControl = new FormControl('', [Validators.required, Validators.minLength(5)]);
    private alive = true;

    constructor(
        public authService: AuthService,
        private errorService: ErrorService,
        private router: Router,
        private formBuilder: FormBuilder,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit() {
        this.createForm();

        const userData = this.authService.getLembrarMe();
        if (userData) {
            this.email.setValue(userData.email);
            this.password.setValue(userData.password);
        }
    }

    createForm(): void {
        this.loginForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(5)]]
        });
    }

    onSubmit(): void {
        console.log(this.loginForm.value);
        this.configs.isLoading = true;

        const operation =
            (this.configs.isLogin)
                ? this.authService.signinUser(this.loginForm.value)
                : this.authService.signupUser(this.loginForm.value);

        operation
            .pipe(
                takeWhile(() => this.alive)
            ).subscribe(
                res => {
                    this.authService.setLembrarMe(this.loginForm.value);
                    const redirect: string = this.authService.redirectUrl || '/dashboard';
                    // redirect com router
                    console.log('redirecionando..', res);
                    this.router.navigate([redirect]);
                    this.authService.redirectUrl = null;
                    this.configs.isLoading = false;

                },
                err => {
                    console.log(err);
                    this.snackBar.open(this.errorService.getErrorMessage(err), 'OK', { duration: 5000, verticalPosition: 'top' });
                    this.configs.isLoading = false;

                },
                () => console.log('observable completado')
            );
    }

    onKeepSingned(): void {
        this.authService.toggleManterLongado();
    }

    changeAction(): void {
        this.configs.isLogin = !this.configs.isLogin;
        this.configs.actionText = !this.configs.isLogin ? 'Sign Up' : 'Sign In';
        this.configs.buttonActionText = !this.configs.isLogin ? 'Already have account' : 'Create account';
        !this.configs.isLogin ? this.loginForm.addControl('name', this.nameControl) : this.loginForm.removeControl('name');
    }

    onLembrarMe(): void {
        this.authService.toggleLembrarMe();
    }

    get name(): FormControl { return <FormControl>this.loginForm.get('name'); }
    get email(): FormControl { return <FormControl>this.loginForm.get('email'); }
    get password(): FormControl { return <FormControl>this.loginForm.get('password'); }

    ngOnDestroy() {
        this.alive = false;
    }

}
