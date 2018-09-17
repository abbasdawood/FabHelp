export class Setting{

    constructor(endpoint, documentType){
        this.endpoint = endpoint;
        this.documentType = documentType;
    }

    getBaseElement(){
        document.getElementById('help-root').classList.add('d-block');
        return document.getElementById('help-root');
    }
    
    getPrismicEndpoint(){
        return this.endpoint;
    }

    getDocumentType(){
        return this.documentType;
    }

}



