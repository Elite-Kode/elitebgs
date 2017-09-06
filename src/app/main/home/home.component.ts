import { Component, OnInit, HostBinding } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    @HostBinding('class.flex') flex = true;
    private isAuthenticated = false;
    constructor(
        private authenticationService: AuthenticationService
    ) { }

    ngOnInit(): void {
        this.getAuthentication();
    }

    getAuthentication() {
        this.authenticationService
            .isAuthenticated()
            .subscribe(status => { this.isAuthenticated = status });
    }
}
