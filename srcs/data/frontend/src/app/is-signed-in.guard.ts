import { Injectable } from "@angular/core";
import { Router, UrlTree } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";

@Injectable()
export class IsSignedInGuard {
    constructor( private toastr: ToastrService, private router: Router) {}

    canActivate(): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        if (localStorage.getItem('JWT')) {
            return true;
        }
        this.toastr.error('Please log in');
        this.router.navigateByUrl('login');
        return false;
    }
    
}