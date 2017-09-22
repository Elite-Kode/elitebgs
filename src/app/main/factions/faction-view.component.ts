import { Component, OnInit, HostBinding } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FactionsService } from '../../services/factions.service';
import { StringHandlers } from '../../utilities/stringHandlers';
import { IFaction } from './faction.interface';
import { EBGSFactionV3Schema } from '../../typings';
import { Options, IndividualSeriesOptions } from 'highcharts';

@Component({
    selector: 'app-faction-view',
    templateUrl: './faction-view.component.html'
})
export class FactionViewComponent implements OnInit {
    @HostBinding('class.content-area') contentArea = true;
    factionData: EBGSFactionV3Schema;
    options: Options;
    constructor(
        private factionService: FactionsService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.factionService
            .getHistoryById(
            this.route.snapshot.paramMap.get('factionid'),
            (Date.now() - 10 * 24 * 60 * 60 * 1000).toString(),
            Date.now().toString()
            )
            .subscribe(faction => {
                const doc = faction.docs[0];
                this.factionData = {
                    _id: doc._id,
                    name: doc.name,
                    government: StringHandlers.titlify(doc.government),
                    allegiance: StringHandlers.titlify(doc.allegiance),
                    history: doc.history
                } as EBGSFactionV3Schema;
            });
    }
}
