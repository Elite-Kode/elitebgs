import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { SystemsService } from './services/systems.service';
import { FDevIDs } from './fdevids';
import { ISystem } from './system.interface';

@Component({
    selector: 'app-system-view',
    templateUrl: './system-view.component.html',
    styleUrls: ['./system-view.component.scss']
})
export class SystemViewComponent implements OnInit {
    private systemData: ISystem;

    constructor(
        private systemService: SystemsService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.systemService.getSingleSystemById(this.route.snapshot.paramMap.get('systemid')).subscribe(system => {
            const id = system.docs[0]._id;
            const name = system.docs[0].name;
            const government = FDevIDs.government[system.docs[0].government].name;
            const allegiance = FDevIDs.superpower[system.docs[0].allegiance].name;
            const primary_economy = FDevIDs.economy[system.docs[0].primary_economy].name;
            const state = FDevIDs.state[system.docs[0].state].name;

            this.systemData = <ISystem>{
                id: id,
                name: name,
                government: government,
                allegiance: allegiance,
                primary_economy: primary_economy,
                state: state
            }
        })
    }

}
