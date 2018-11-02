export class Setting{

    constructor(endpoint, documentType, productArea){
        this.endpoint = endpoint;
        this.documentType = documentType;
        this.productArea = productArea;
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



