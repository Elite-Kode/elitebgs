import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FactionsService } from './services/factions.service';
import { StringHandlers } from './utilities/stringHandlers';
import { IFaction } from './faction.interface';

@Component({
    selector: 'app-faction-view',
    templateUrl: './faction-view.component.html'
})
export class FactionViewComponent implements OnInit {
    private factionData: IFaction;
    constructor(
        private factionService: FactionsService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.factionService.getSingleFactionById(this.route.snapshot.paramMap.get('factionid')).subscribe(faction => {
            const id = faction.docs[0]._id;
            const name = faction.docs[0].name;
            const government = StringHandlers.titlify(faction.docs[0].government);
            const allegiance = StringHandlers.titlify(faction.docs[0].allegiance);

            this.factionData = <IFaction>{
                id: id,
                name: name,
                government: government,
                allegiance: allegiance
            }
        })
    }
}
