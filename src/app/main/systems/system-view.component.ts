import { Component, OnInit, HostBinding } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { SystemsService } from '../../services/systems.service';
import { FactionsService } from '../../services/factions.service';
import { FDevIDs } from '../../utilities/fdevids';
import { ISystem } from './system.interface';
import { EBGSSystemV3Schema, EBGSFactionV3Schema } from '../../typings';
import { Options } from 'highcharts';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-system-view',
    templateUrl: './system-view.component.html'
})
export class SystemViewComponent implements OnInit {
    @HostBinding('class.content-area') contentArea = true;
    systemData: EBGSSystemV3Schema;
    options: Options;
    constructor(
        private systemService: SystemsService,
        private factionService: FactionsService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.systemService
            .getHistoryById(
            this.route.snapshot.paramMap.get('systemid'),
            (Date.now() - 10 * 24 * 60 * 60 * 1000).toString(),
            Date.now().toString()
            )
            .subscribe(system => {
                const doc = system.docs[0];
                this.systemData = doc;
                this.systemData.government = FDevIDs.government[doc.government].name;
                this.systemData.allegiance = FDevIDs.superpower[doc.allegiance].name;
                this.systemData.primary_economy = FDevIDs.economy[doc.primary_economy].name;
                this.systemData.state = FDevIDs.state[doc.state].name;
            });
    }
}
