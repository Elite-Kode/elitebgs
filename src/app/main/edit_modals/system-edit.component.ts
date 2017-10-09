import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { EBGSSystemChart, EBGSSystemFactionChart, EBGSSystemPostHistory } from '../../typings';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import cloneDeep from 'lodash-es/cloneDeep'
import { FDevIDs } from '../../utilities/fdevids';
import { ServerService } from '../../services/server.service';

@Component({
    selector: 'app-system-edit',
    templateUrl: './system-edit.component.html',
    styleUrls: ['./system-edit.component.scss']
})
export class SystemEditComponent implements OnChanges {
    @Input() system: EBGSSystemChart;
    @Input() set modalOpen(value: boolean) {
        this.systemEditModal = value;
    };
    @Output() modalOpenChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    systemUnderEdit: EBGSSystemChart;
    systemEditModal: boolean;
    factionStates: string[] = [];
    stateTrends: string[] = [];
    systemForm: FormGroup;
    constructor(
        private formBuilder: FormBuilder,
        private serverService: ServerService
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
        this.factions.controls.forEach((formGroup: FormGroup, index, Controls: FormGroup[]) => {
            this.systemUnderEdit.factions[index].influence = Math.round((formGroup.get('influence').value + 0.00001) * 10000) / 1000000;
            this.systemUnderEdit.factions[index].state = (formGroup.get('state').value as string);
        });
        this.serverService
            .postEdit(this.systemUnderEdit)
            .subscribe(response => {
                if (response === true) {
                    this.systemEditModal = false;
                }
            })
    }

    reset() {
        this.systemUnderEdit = cloneDeep(this.system);
        this.setFactions(this.systemUnderEdit);
    }

    ngOnChanges(changes: SimpleChanges) {
        for (const propName in changes) {
            if (propName === 'system' && changes[propName].currentValue) {
                this.systemUnderEdit = cloneDeep(this.system);
                this.setFactions(this.systemUnderEdit);
            }
        }
    }

    get factions(): FormArray {
        return this.systemForm.get('factions') as FormArray;
    }

    createForm() {
        this.systemForm = this.formBuilder.group({
            factions: this.formBuilder.array([])
        });
    }

    systemModal(state: boolean) {
        this.systemEditModal = state;
        this.modalOpenChange.emit(this.systemEditModal);
    }

    removePendingState(index: number, state: string) {
        const indexOfState = this.systemUnderEdit.factions[index].pending_states.findIndex(element => {
            return element.state === state;
        });
        if (indexOfState !== -1) {
            this.systemUnderEdit.factions[index].pending_states.splice(indexOfState, 1);
        }
    }

    removeRecoveringState(index: number, state: string) {
        const indexOfState = this.systemUnderEdit.factions[index].recovering_states.findIndex(element => {
            return element.state === state;
        });
        if (indexOfState !== -1) {
            this.systemUnderEdit.factions[index].recovering_states.splice(indexOfState, 1);
        }
    }

    addPendingState(index: number) {
        const pendingState: string = ((this.factions.controls[index] as FormGroup)
            .get('pending_state')).value;
        const pendingStateTrend: string = ((this.factions.controls[index] as FormGroup)
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
        this.systemUnderEdit.factions[index].pending_states.push({
            state: pendingState,
            trend: pendingStateTrendNumber
        });
    }

    addRecoveringState(index: number) {
        const recoveringState: string = ((this.factions.controls[index] as FormGroup)
            .get('recovering_state')).value;
        const recoveringStateTrend: string = ((this.factions.controls[index] as FormGroup)
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
        this.systemUnderEdit.factions[index].recovering_states.push({
            state: recoveringState,
            trend: recoveringStateTrendNumber
        });
    }

    removeFactionFromSystem(index: number) {
        this.systemUnderEdit.factions.splice(index, 1);
        this.setFactions(this.systemUnderEdit);
    }

    setFactions(system: EBGSSystemChart) {
        const formGroup: FormGroup[] = [];
        system.factions.forEach(faction => {
            formGroup.push(this.formBuilder.group({
                influence: Math.round(faction.influence * 1000000) / 10000,
                state: faction.state,
                is_controlling: this.isControlling(faction),
                pending_state: 'None',
                pending_state_trend: 'Trending Up',
                recovering_state: 'None',
                recovering_state_trend: 'Trending Up'
            }));
        });

        this.systemForm.setControl('factions', this.formBuilder.array(formGroup));
    }

    isControlling(faction: EBGSSystemFactionChart) {
        if (this.systemUnderEdit.controlling_minor_faction === faction.name_lower) {
            return true;
        } else {
            return false;
        }
    }
}
