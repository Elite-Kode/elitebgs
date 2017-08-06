import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Spec, Path } from 'swagger-schema-official';

@Component({
    selector: 'app-swagger-ui',
    templateUrl: './swagger-ui.component.html',
    styleUrls: ['./swagger-ui.component.scss']
})

export class SwaggerUIComponent implements OnInit {
    @Input() docUrl: string;
    doc: Spec;
    paths: [string, Path][];
    sideNavActive: {};

    constructor(private http: HttpClient) {
        this.sideNavActive = [];
        this.sideNavActive['Home'] = true;
    }

    ngOnInit(): void {
        this.http.get<Spec>(this.docUrl).subscribe(doc => {
            this.doc = doc;
            const pathLocations = Object.keys(this.doc.paths);
            this.paths = Object.entries(this.doc.paths);
            for (let i = 0; i < this.paths.length; i++) {
                const path = this.paths[i];
                this.sideNavActive[pathLocations[i]] = false;
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
