import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AuthenticationService } from '../../services/authentication.service';
import { EBGSStationSchemaDetailed, EBGSUser } from '../../typings';
import { StationsService } from '../../services/stations.service';
import { IngameIdsService } from '../../services/ingameIds.service';

@Component({
    selector: 'app-station-view',
    templateUrl: './station-view.component.html'
})
export class StationViewComponent implements OnInit {
    @HostBinding('class.content-area') contentArea = true;
    isAuthenticated: boolean;
    stationData: EBGSStationSchemaDetailed;
    successAlertState = false;
    failureAlertState = false;
    user: EBGSUser;

    constructor(
        private stationService: StationsService,
        private route: ActivatedRoute,
        private authenticationService: AuthenticationService,
        private titleService: Title,
        private ingameIdsService: IngameIdsService
    ) {
    }

    async ngOnInit() {
        this.getAuthentication();
        const FDevIDs = await this.ingameIdsService.getAllIds().toPromise();
        const station = await this.stationService
            .parseStationDataId([this.route.snapshot.paramMap.get('stationid')]);
        this.stationData = station[0];
        this.stationData.type = FDevIDs.station[this.stationData.type].name;
        this.stationData.government = FDevIDs.government[this.stationData.government].name;
        this.stationData.allegiance = FDevIDs.superpower[this.stationData.allegiance].name;
        this.stationData.economy = FDevIDs.economy[this.stationData.economy].name;
        this.stationData.all_economies = this.stationData.all_economies ? this.stationData.all_economies : [];
        this.stationData.all_economies.forEach(economy => {
            economy.name = FDevIDs.economy[economy.name].name;
        });
        this.stationData.state = FDevIDs.state[this.stationData.state].name;
        this.titleService.setTitle(this.stationData.name + ' - Elite BGS');
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
