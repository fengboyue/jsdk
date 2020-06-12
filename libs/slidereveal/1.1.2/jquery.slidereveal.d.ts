interface SlideRevealOptions {
    width?:number|string;
    push?:boolean;
    overlay?:boolean;
    overlayColor?:string;
    zIndex?:number;
    position?:'left'|'right';
    speed?:number;
    trigger?:JQuery;
    autoEscape?:boolean;
    top?:number;
    show?: (sidebar:JQuery, trigger:JQuery)=>void;
    shown?: (sidebar:JQuery, trigger:JQuery)=>void;
    hide?: (sidebar:JQuery, trigger:JQuery)=>void;
    hidden?: (sidebar:JQuery, trigger:JQuery)=>void;
}
interface JQuery {
    slideReveal(): JQuery;
    slideReveal(options: SlideRevealOptions): JQuery;
    slideReveal(method: 'show'|'hide'|'toggle', enableEvent?:boolean): any;   
}