import { Router } from '@angular/router';
import { StorageKeys } from './../../storage-keys';
import { Injectable } from '@angular/core';
import { map, tap, catchError, mergeMap } from 'rxjs/operators';
import { Observable, ReplaySubject, throwError, of } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { AUTHENTICATE_USER_MUTATION, SINGUP_USER_MUTATION, LoggedInUserQuery, LOGGED_IN_USER_QUERY } from './auth.graphql';

import { Base64 } from 'js-base64';
import { User } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    authUser: User;
    redirectUrl: string;
    manterLongado: boolean;
    lembrar_me: boolean;
    private _isAuthenticated = new ReplaySubject<boolean>(1);

    constructor(
        private apollo: Apollo,
        private router: Router
    ) {
        this.isAuthenticated.subscribe(is =>    {
            console.log('AuthState', is);
        });
        this.init();
    }

    init(): void {
        this.manterLongado = JSON.parse(window.localStorage.getItem(StorageKeys.MANTER_LONGADO));
        this.lembrar_me = JSON.parse(window.localStorage.getItem(StorageKeys.LEMBRAR_ME));
    }

    get isAuthenticated(): Observable<boolean> {
        return this._isAuthenticated.asObservable();
    }

    signinUser(variables: {email: string, password: string}): Observable<{id: string, token: string}> {
        return this.apollo.mutate({
            mutation: AUTHENTICATE_USER_MUTATION,
            variables,

        }).pipe(
            map(res => res.data.authenticateUser),
            tap(res =>  this.setAuthState({id: res && res.id, token: res && res.token, isAuthenticated: res != null})),
            catchError(error =>   {
                this.setAuthState({id: null, token: null, isAuthenticated: null});
                return throwError(error);
            })
        );
    }

    signupUser(variables: {name: string, email: string, password: string}): Observable<{id: string, token: string}> {
        return this.apollo.mutate({
            mutation: SINGUP_USER_MUTATION,
            variables,

        }).pipe(
            map(res => res.data.signupUser),
            tap(res =>  this.setAuthState({id: res && res.id, token: res && res.token, isAuthenticated: res != null})),
            catchError(error =>   {
                this.setAuthState({id: null, token: null, isAuthenticated: null});
                return throwError(error);
            })
        );
    }

    logout(): void {
        window.localStorage.removeItem(StorageKeys.AUTH_TOKEN);
        window.localStorage.removeItem(StorageKeys.MANTER_LONGADO);
        this.manterLongado = false;
        this._isAuthenticated.next(false);
        this.router.navigate(['/login']);
        this.apollo.getClient().resetStore();
    }

    toggleManterLongado(): void {
        this.manterLongado = !this.manterLongado;
        window.localStorage.setItem(StorageKeys.MANTER_LONGADO, this.manterLongado.toString());
    }

    toggleLembrarMe(): void {
        this.lembrar_me = !this.lembrar_me;
        window.localStorage.setItem(StorageKeys.LEMBRAR_ME, this.lembrar_me.toString());

        if (!this.lembrar_me) {
            window.localStorage.removeItem(StorageKeys.USUARIO_EMAIL);
            window.localStorage.removeItem(StorageKeys.USUARIO_SENHA);
        }
    }

    setLembrarMe(user: {email: string, password: string}): void {
        if (this.lembrar_me) {
            window.localStorage.setItem(StorageKeys.USUARIO_EMAIL, Base64.encode(user.email));
            window.localStorage.setItem(StorageKeys.USUARIO_SENHA, Base64.encode(user.password));
        }
    }

    getLembrarMe(): {email: string, password: string} {
        if (!this.lembrar_me) { return null; }

        return {
            email: Base64.decode(window.localStorage.getItem(StorageKeys.USUARIO_EMAIL)),
            password: Base64.decode(window.localStorage.getItem(StorageKeys.USUARIO_SENHA)),
        };

    }

    autoLogin(): Observable<void> {
        if (!this.manterLongado) {
            this._isAuthenticated.next(false);
            window.localStorage.removeItem(StorageKeys.AUTH_TOKEN);
            return of();
        }

        return this.validateToken()
            .pipe(
                tap(authData => {
                    const token = window.localStorage.getItem(StorageKeys.AUTH_TOKEN);
                    this.setAuthState({id: authData.id, token, isAuthenticated: authData.isAuthenticated});
                }),
                mergeMap(res => of()),
                catchError(error =>    {
                    this.setAuthState({id: null, token: null, isAuthenticated: false});
                    return throwError(error);
                })
            );
    }


    private validateToken(): Observable<{id: string, isAuthenticated: boolean}> {
        return this.apollo.query<LoggedInUserQuery>({
            query: LOGGED_IN_USER_QUERY
        }).pipe(
            map(res =>  {
                const user = res.data.loggedInUser;
                return {
                    id: user && user.id,
                    isAuthenticated: user !== null
                };
            })
        );
    }

    private setAuthState(authData: {id: string, token: string, isAuthenticated: boolean}): void {
        if (authData.isAuthenticated) {
            window.localStorage.setItem(StorageKeys.AUTH_TOKEN, authData.token);
            this.authUser = { id: authData.id };
        }
        this._isAuthenticated.next(authData.isAuthenticated);
    }
}
