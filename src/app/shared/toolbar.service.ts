import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { ToolbarButton } from './toolbar-button';

@Injectable()
export class ToolbarService {
    private buttonObjects: ToolbarButton[];
    private buttonSubject: Subject<ToolbarButton[]> = new Subject<ToolbarButton[]>();

    private title = "EliteBGS";
    private titleSubject: Subject<string> = new Subject<string>();

    private showBack = false;
    private showBackSubject: Subject<boolean> = new Subject<boolean>();

    makeButtons(buttonObjects: ToolbarButton[]): void {
        this.buttonObjects = buttonObjects;
        this.buttonSubject.next(this.buttonObjects);
    }
    getButtons(): Observable<ToolbarButton[]> {
        return this.buttonSubject.asObservable();
    }

    setTitle(title: string): void {
        this.title = title;
        this.titleSubject.next(this.title);
    }
    getTitle(): Observable<string> {
        return this.titleSubject.asObservable();
    }

    setShowBack(showBack: boolean): void {
        this.showBack = showBack;
        this.showBackSubject.next(this.showBack);
    }
    getShowBack(): Observable<boolean> {
        return this.showBackSubject.asObservable();
    }
}
