import { FaqDocument } from '../util/faqParser';
import { Content } from './content';

export class Card {


    /**
     * Creates an instance of Card, that houses all the documents from the Prismic Backend
     * @param {*} setting The settings object received from the init script
     * @memberof Card
     */
    constructor(setting) {
        this.content = new Content();
        this.showDetail = false;

        let card = document.createElement('div');
        card.setAttribute('id', 'help-card');
        card.classList.add('card', 'mb-2', 'd-block', 'animated', 'animateInFromRightBottom', 'w-100'); // this is the root card

        card.innerHTML = `
        <div class="card-header">
            Hi, How can we help?
        </div>
        <div class="card-body d-none" id="search">
            <form id="search-form">
                <div class="input-group">
                    <div class="input-group-prepend">
                    <span class="input-group-text bg-white" id="basic-addon1">
                        <i class="fas fa-search"></i>
                    </span>
                    </div>
                    <input type="search" id="search-box" class="form-control" placeholder="Search articles & documents" aria-describedby="basic-addon1">
                    <small class="form-text text-muted small">To refine your search, type in your question.</small>
                </div>
            </form>
        </div>
        <div class="card-body d-none" id="detail">
        </div>
        <div class="card-body text-center d-none" id="loader">
            <div class="lds-ripple my-3"><div></div><div></div></div>
        </div>
        <div class="card-body d-none text-center" id="error">
        </div>
        <ul class="list-group list-group-flush" id="document-list">
        </ul>
        <div class="card-footer bg-white d-none" id="card-footer">
            <button class="btn btn-sm btn-outline-primary" id="back-button">
                <i class="fas fa-sm fa-chevron-left mr-1"></i> Go Back
            </button>
        </div>
        `;

        this.card = card;
        this.setting = setting;
    }

    show(baseElement) {
        baseElement.appendChild(this.card); // Append the card to the DOM
        this.showElement('search');
    }

    addFormEventListener() {
        let self = this;
        let searchForm = document.getElementById('search-form');
        searchForm.addEventListener('submit', event => {
            event.preventDefault();
            let searchTerm = document.getElementById('search-box').value;
            if(searchTerm){
                self.getArticles(searchTerm);  
            }
        });
    }

    generateNullState(searchTerm){
        let self = this;
        self.removeArticles();
        let nullTemplate = `
            <i class="fas fa-exclamation-triangle fa-2x text-warning mb-3"></i>
            <h5>Whoops!</h5>
            <p class="text-muted">We couldn't find any resource matching <em>${searchTerm}</em>. Try using another search term.</p>
            <button class="btn btn-outline-primary my-2" id="clear-search">Clear this search</button>
        `
        this.showElement('error');
        document.getElementById('error').innerHTML = nullTemplate;
        document.getElementById('clear-search').addEventListener('click', ()=> {
            self.hideElement('error');
            self.getArticles();
            document.getElementById('search-box').value = '';
        });
    }

    /** 
     * Function to destroy all instances of the card
     */
    remove() {
        if (this.card.classList.contains('animateInFromRightBottom')) {
            this.card.classList.remove('animateInFromRightBottom');
            this.card.classList.add('animateOutToRightBottom');
        }
        setTimeout(() => {
            this.card.remove();
        }, 100);
    }

    showElement(element) {
        let e = document.getElementById(element);
        if (e.classList.contains('d-none')) {
            e.classList.remove('d-none');
            e.classList.add('d-block');
        } else {
            e.classList.add('d-block');
        }
    }

    hideElement(element){
        let e = document.getElementById(element);
        if (e.classList.contains('d-block')) {
            e.classList.remove('d-block');
            e.classList.add('d-none');
        } else {
            e.classList.add('d-none');
        }
    }

    getArticles(searchTerm) {
        let self = this;

        console.log(`Searching using ${searchTerm}`);

        // Show the loader & document-list element
        this.showElement('loader');
        this.showElement('document-list');

        this.removeArticles(); // Reset the DOM first

        // Get the articles using the service
        this.content.getDocuments(
            self.setting.endpoint,
            self.setting.documentType,
            1,
            10,
            searchTerm
        ).then(response => {
            // Hide the loader
            self.hideElement('loader');
            self.buildResponseDom(response, searchTerm);
        }).catch(error => {
            // Hide the loader
            self.hideElement('loader');
            self.addError(error);
        });
    }

    /**
     * Removes the list of articles in the base card
     *
     * @memberof Card
     */
    removeArticles() {
        // Remove existing results
        let ul = document.getElementById('document-list');
        console.log(`Number of articles is ${ul.childElementCount}`)
        while (ul.firstChild) {
            ul.removeChild(ul.firstChild);
        }
        console.log(`Number of articles after removal is ${ul.childElementCount}`)
    }


    /**
     * Function to get the list items of the list view
     *
     * @param {*} document The Prismic document passed to the FaqDocument instance
     * @returns An instance of the FaqDocument
     * @memberof Card
     */
    getListItemContent(document) {
        return new FaqDocument(document).getSnapshot();
    }


    /**
     * Function to add the back button interaction
     *
     * @memberof Card
     */
    addBackButtonEvents() {
        let self = this;
        let backButton = document.getElementById('back-button');
        backButton.addEventListener('click', event => {
            // Hide the detail section and the footer
            self.hideElement('detail');
            self.hideElement('card-footer');
            self.showDetail = false;
            self.getArticles();
        });
    }

    addError(error) {
        let alertTemplate = `
                    <div class="alert alert-danger" role="alert">
                    ${error.message || error}</div>
                `;
        document.getElementById('detail').innerHTML = alertTemplate;
    }

    generateDetailView(id) {
        let self = this;

        if (self.showDetail) {
            console.log('Detail view is already open');
            return;
        }

        // Hide these elements: search, document-list
        this.hideElement('document-list');
        this.removeArticles();

        self.showDetail = true;

        // Show the loader, detail & footer
        this.showElement('loader');
        this.showElement('detail');
        this.showElement('card-footer');

        let content = new Content();
        content.getById(this.setting.endpoint, id)
            .then(doc => {
                // Hide the loader
                self.hideElement('loader');
                let faqDocument = new FaqDocument(doc).getDocument();
                let cardTemplateContent = `
                    <h5 class="card-title">${faqDocument.title}</h5><hr>
                    <div>${faqDocument.content}</div>
                `;
                document.getElementById('detail').innerHTML = cardTemplateContent;

            }).catch(error => {
                // Hide the loader
                self.hideElement('loader');
                self.addError(error);
            });
    }

    buildResponseDom(response, searchTerm) {
        let results = response.results;
        let self = this;

        if(!results.length){
            this.generateNullState(searchTerm);
        } else {
            let documentList = document.getElementById('document-list');
            results.forEach(doc => {
                let listItem = document.createElement('li');
                listItem.classList.add('list-group-item');
                let faqItem = this.getListItemContent(doc);
                listItem.innerHTML = `
                    <h6>${faqItem.title}</h6>
                    <small>${faqItem.snippet}</small>
                    <a class="read-more small float-right mt-1" href="#" data-document-id="${doc.id}">Read More</a>
                `;
                listItem.childNodes.forEach(node => {
                    if (doc.id) {
                        self.addListItemEventListener(node);
                    }
                });
                documentList.appendChild(listItem);
            });
        }
    }

    addListItemEventListener(node) {
        let self = this;
        node.addEventListener('click', (event) => {
            if (event.stopPropogation) {
                event.stopPropogation();
            }
            if (event.target.getAttribute('data-document-id')) {
                self.addBackButtonEvents();
                self.generateDetailView(event.target.getAttribute('data-document-id'), self);
            }
        }, false);
    }
}