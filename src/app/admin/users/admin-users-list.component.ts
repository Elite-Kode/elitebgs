import { Component, HostBinding, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ClrDatagridStateInterface } from '@clr/angular';
import { IAdminUsers } from './admin-users.interface';
import { ServerService } from '../../services/server.service';
import { EBGSUsers } from '../../typings';
import { debounceTime, switchMap } from 'rxjs/operators';

@Component({
    selector: 'app-admin-users-list',
    templateUrl: './admin-users-list.component.html'
})
export class AdminUsersListComponent implements OnInit {
    @HostBinding('class.content-container') contentContainer = true;
    userData: IAdminUsers[] = [];
    totalRecords = 0;
    loading = true;
    private pageNumber = 1;
    private tableState: ClrDatagridStateInterface;
    userForm = new FormGroup({
        user: new FormControl()
    });
    constructor(private serverService: ServerService) { }

    showUser(users: EBGSUsers) {
        this.totalRecords = users.total;
        this.userData = users.docs.map(responseUser => {
            const id = responseUser._id;
            const username = responseUser.username;
            const access = responseUser.access;
            const discordId = responseUser.id;
            const discriminator = responseUser.discriminator;
            const email = responseUser.email;
            return <IAdminUsers>{
                id: id,
                username: username,
                access: access,
                discordId: discordId,
                discriminator: discriminator,
                email: email
            };
        });
    }

    refresh(tableState: ClrDatagridStateInterface) {
        let beginsWith = this.userForm.value.user;
        this.tableState = tableState;
        this.loading = true;
        this.pageNumber = Math.ceil((tableState.page.to + 1) / tableState.page.size);

        if (!beginsWith) {
            beginsWith = '';
        }

        this.serverService
            .getUsersBegins(this.pageNumber.toString(), beginsWith)
            .subscribe(users => this.showUser(users));
        this.loading = false;
    }

    ngOnInit() {
        this.userForm.valueChanges
            .pipe(debounceTime(300))
            .pipe(switchMap(value => {
                this.loading = true;
                this.pageNumber = Math.ceil((this.tableState.page.to + 1) / this.tableState.page.size);
                if (!value.user) {
                    value.user = '';
                }
                return this.serverService
                    .getUsersBegins(this.pageNumber.toString(), value.user)
            }))
            .subscribe(users => {
                this.showUser(users);
                this.loading = false;
            });
    }
}
