import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { EBGSFactionV3Schema, EBGSSystemV3SchemaWOHistory, EBGSSystemV3Schema } from '../../typings';
import { FDevIDs } from '../../utilities/fdevids';
import { FormGroup, FormArray, FormControl, FormBuilder } from '@angular/forms';
import { SystemsService } from '../../services/systems.service';
import { FactionsService } from '../../services/factions.service';
import { HttpErrorResponse } from '@angular/common/http';
import cloneDeep from 'lodash-es/cloneDeep'

@Component({
    selector: 'app-faction-edit',
    templateUrl: './faction-edit.component.html',
    styleUrls: ['./faction-edit.component.scss']
})
export class FactionEditComponent implements OnChanges {
    @Input() faction: EBGSFactionV3Schema;
    @Input() set modalOpen(value: boolean) {
        this.factionEditModal = value;
    };
    @Output() modalOpenChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    factionUnderEdit: EBGSFactionV3Schema;
    factionEditModal: boolean;
    factionStates: string[] = [];
    stateTrends: string[] = [];
    factionForm: FormGroup;
    systemsPresent: Map<string, EBGSSystemV3SchemaWOHistory> = new Map();
    constructor(
        private formBuilder: FormBuilder,
        private systemService: SystemsService,
        private factionService: FactionsService
    ) {
        Object.keys(FDevIDs.state).forEach(state => {
            if (this.factionStates.indexOf(FDevIDs.state[state].name) === -1) {
                this.factionStates.push(FDevIDs.state[state].name);
            }
        });
        this.stateTrends = [
            'Trending Up',
            'Not Trending',
            'Trending Down'
        ]
        this.createForm();
    }

    save() {
        (this.factionForm.get('systems') as FormArray).controls.forEach((formGroup: FormGroup, index, Controls: FormGroup[]) => {
            this.factionUnderEdit
                .faction_presence[index].influence = Math.round((formGroup.get('influence').value + 0.00001) * 10000) / 1000000;
            this.factionUnderEdit.faction_presence[index].state = (formGroup.get('state').value as string).toLowerCase();
        });
        this.factionService
            .postFactions(this.factionUnderEdit)
            .subscribe(response => {
                if (response === true) {
                    this.factionModal(false);
                }
            });

        this.systemsPresent.forEach((system, systemName, systemsMap) => {
            if (this.factionUnderEdit.faction_presence.findIndex(element => {
                return element.system_name_lower === systemName.toLowerCase();
            }) === -1) {
                const factionIndex = system.factions.findIndex(element => {
                    return element.name_lower === this.factionUnderEdit.name_lower;
                });
                system.factions.splice(factionIndex, 1);

                this.systemService
                    .postSystems(system as EBGSSystemV3Schema)
                    .subscribe(response => { })
            }
        });
    }

    reset() {
        this.factionUnderEdit = cloneDeep(this.faction);
        this.setSystems(this.factionUnderEdit);
    }

    get systems(): FormArray {
        return this.factionForm.get('systems') as FormArray;
    }

    ngOnChanges(changes: SimpleChanges) {
        for (const propName in changes) {
            if (propName === 'faction' && changes[propName].currentValue) {
                this.factionUnderEdit = cloneDeep(this.faction);
                const systemPromiseArray: Promise<EBGSSystemV3SchemaWOHistory>[] = [];
                this.factionUnderEdit.faction_presence.forEach(system => {
                    systemPromiseArray.push(new Promise((resolve, reject) => {
                        this.systemService
                            .getSystems(system.system_name_lower)
                            .subscribe(systems => {
                                this.systemsPresent.set(system.system_name, systems.docs[0]);
                                resolve(systems.docs[0]);
                            }, (err: HttpErrorResponse) => {
                                reject(err);
                            });
                    }));
                });
                Promise.all(systemPromiseArray)
                    .then(systems => {
                        this.setSystems(this.factionUnderEdit);
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        }
    }

    factionModal(state: boolean) {
        this.factionEditModal = state;
        this.modalOpenChange.emit(this.factionEditModal);
    }

    createForm() {
        this.factionForm = this.formBuilder.group({
            systems: this.formBuilder.array([])
        });
    }

    removePendingState(index: number, state: string) {
        const indexOfState = this.factionUnderEdit.faction_presence[index].pending_states.findIndex(element => {
            return element.state === state;
        });
        if (indexOfState !== -1) {
            this.factionUnderEdit.faction_presence[index].pending_states.splice(indexOfState, 1);
        }
    }

    removeRecoveringState(index: number, state: string) {
        const indexOfState = this.factionUnderEdit.faction_presence[index].recovering_states.findIndex(element => {
            return element.state === state;
        });
        if (indexOfState !== -1) {
            this.factionUnderEdit.faction_presence[index].recovering_states.splice(indexOfState, 1);
        }
    }

    addPendingState(index: number) {
        const pendingState: string = (((this.factionForm.get('systems') as FormArray).controls[index] as FormGroup)
            .get('pending_state')).value;
        const pendingStateTrend: string = (((this.factionForm.get('systems') as FormArray).controls[index] as FormGroup)
            .get('pending_state_trend')).value;
        const pendingStateTrendNumber: number = function (trend, current) {
            if (trend === current.stateTrends[0]) {
                return 1;
            } else if (trend === current.stateTrends[1]) {
                return 0;
            } else if (trend === current.stateTrends[2]) {
                return -1;
            } else {
                return 0;
            }
        }(pendingStateTrend, this);
        this.factionUnderEdit.faction_presence[index].pending_states.push({
            state: pendingState.toLowerCase(),
            trend: pendingStateTrendNumber
        });
    }

    addRecoveringState(index: number) {
        const recoveringState: string = (((this.factionForm.get('systems') as FormArray).controls[index] as FormGroup)
            .get('recovering_state')).value;
        const recoveringStateTrend: string = (((this.factionForm.get('systems') as FormArray).controls[index] as FormGroup)
            .get('recovering_state_trend')).value;
        const recoveringStateTrendNumber: number = function (trend, current) {
            if (trend === current.stateTrends[0]) {
                return 1;
            } else if (trend === current.stateTrends[1]) {
                return 0;
            } else if (trend === current.stateTrends[2]) {
                return -1;
            } else {
                return 0;
            }
        }(recoveringStateTrend, this);
        this.factionUnderEdit.faction_presence[index].recovering_states.push({
            state: recoveringState.toLowerCase(),
            trend: recoveringStateTrendNumber
        });
    }

    removeFactionFromSystem(index: number) {
        this.factionUnderEdit.faction_presence.splice(index, 1);
        this.setSystems(this.factionUnderEdit);
    }

    setSystems(faction: EBGSFactionV3Schema) {
        const formGroup: FormGroup[] = [];
        faction.faction_presence.forEach(system => {
            formGroup.push(this.formBuilder.group({
                influence: Math.round(system.influence * 1000000) / 10000,
                state: FDevIDs.state[system.state].name,
                is_controlling: this.isControlling(system.system_name, faction),
                pending_state: 'None',
                pending_state_trend: 'Trending Up',
                recovering_state: 'None',
                recovering_state_trend: 'Trending Up'
            }));
        });

        this.factionForm.setControl('systems', this.formBuilder.array(formGroup));
    }

    isControlling(systemName: string, faction: EBGSFactionV3Schema) {
        return this.systemsPresent.get(systemName).controlling_minor_faction === faction.name_lower;
    }
}
