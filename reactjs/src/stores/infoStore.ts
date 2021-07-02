import { action, observable } from "mobx";  

export default class InfoStore { 
    @observable visible: boolean = true;
    
    @action
    toggle() {
        this.visible = !this.visible;
    }
}