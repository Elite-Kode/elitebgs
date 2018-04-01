import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AuthenticationService } from '../../services/authentication.service';
import { FDevIDs } from '../../utilities/fdevids';
import { EBGSUser, EBGSStationV4Schema } from '../../typings';
import { StationsService } from '../../services/stations.service';

@Component({
    selector: 'app-station-view',
    templateUrl: './station-view.component.html'
})
export class StationViewComponent implements OnInit {
    @HostBinding('class.content-area') contentArea = true;
    isAuthenticated: boolean;
    stationData: EBGSStationV4Schema;
    editAllowed: boolean;
    editModal: boolean;
    successAlertState = false;
    failureAlertState = false;
    user: EBGSUser;
    constructor(
        private stationService: StationsService,
        private route: ActivatedRoute,
        private authenticationService: AuthenticationService,
        private titleService: Title
    ) { }

    ngOnInit() {
        this.getAuthentication();
        this.stationService
            .parseStationDataId([this.route.snapshot.paramMap.get('stationid')])
            .then(station => {
                this.stationData = station[0];
                this.stationData.type = FDevIDs.station[this.stationData.type].name;
                this.stationData.government = FDevIDs.government[this.stationData.government].name;
                this.stationData.allegiance = FDevIDs.superpower[this.stationData.allegiance].name;
                this.stationData.economy = FDevIDs.economy[this.stationData.economy].name;
                this.stationData.state = FDevIDs.state[this.stationData.state].name;
                this.titleService.setTitle(this.stationData.name + ' - Elite BGS');
                // this.getEditAllowed();
                this.editAllowed = false;   // Temporarily edit is disabled
            });
    }

    openStationEditModal() {
        this.editModal = true;
    }

    getEditAllowed() {
        this.authenticationService
            .isEditAllowed(this.stationData.name_lower)
            .subscribe(check => {
                this.editAllowed = check;
            })
    }

    getAuthentication() {
        this.authenticationService
            .isAuthenticated()
            .subscribe(status => {
                this.isAuthenticated = status;
                if (this.isAuthenticated) {
                    this.getUser();
                } else {
                    this.user = {} as EBGSUser;
                }
            });
    }

    monitor() {
        this.authenticationService
            .addStations([this.stationData.name])
            .subscribe(status => {
                if (status === true) {
                    this.successAlertState = true;
                    setTimeout(() => {
                        this.successAlertState = false;
                    }, 3000);
                } else {
                    this.failureAlertState = true;
                    setTimeout(() => {
                        this.failureAlertState = false
                    }, 3000);
                }
            });
    }

    getUser() {
        this.authenticationService
        .getUser()
        .subscribe(user => {
            this.user = user;
        });
    }
}
