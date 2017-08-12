import { Component, OnInit, HostBinding, Input } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Spec, Path, Schema } from 'swagger-schema-official';

@Component({
    selector: 'app-swagger-ui',
    templateUrl: './swagger-ui.component.html',
    styleUrls: ['./swagger-ui.component.scss']
})

export class SwaggerUIComponent implements OnInit {
    @HostBinding('class.content-container') contentContainer = true;
    @Input() docUrl: string;
    doc: Spec;
    paths: [string, Path][];
    definitions: [string, Schema][];
    methods: [string, string[]][];
    sideNavActive: {};

    constructor(private http: HttpClient) {
        this.sideNavActive = [];
        this.sideNavActive['Home'] = true;
        this.methods = [];
    }

    ngOnInit(): void {
        this.http.get<Spec>(this.docUrl).subscribe(doc => {
            this.doc = doc;
            this.paths = Object.entries(this.doc.paths);
            this.definitions = Object.entries(this.doc.definitions);
            for (let i = 0; i < this.paths.length; i++) {
                this.sideNavActive[this.paths[i][0]] = false;
                const methods = Object.entries(this.paths[i][1]);
                const methodArray: string[] = [];
                for (let j = 0; j < methods.length; j++) {
                    methodArray.push(methods[j][0]);
                }
                this.methods.push([this.paths[i][0], methodArray]);
            }
            for (let i = 0; i < this.definitions.length; i++) {
                this.sideNavActive[this.definitions[i][0]] = false;
            }
        })
    }

    makeActive(name: string) {
        Object.entries(this.sideNavActive).forEach(entry => {
            if (entry[0] === name) {
                this.sideNavActive[name] = true;
            } else {
                this.sideNavActive[entry[0]] = false;
            }
        })
    }
}
