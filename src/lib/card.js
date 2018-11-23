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
        this.page = 1;
        this.pagesize = 5;
        this.showMore = true;

        let card = document.createElement('div');
        card.setAttribute('id', 'help-card');
        card.classList.add('card', 'mb-2', 'd-block', 'animated', 'animateInFromRightBottom', 'w-100'); // this is the root card

        card.innerHTML = `
        <div class="card-header">
            Hi, How can we help?
        </div>
        <div class="card-body d-none" id="search">
            <form id="search-form" autocomplete="off">
                <div class="input-group">
                    <div class="input-group-prepend">
                    <span class="input-group-text bg-white" id="basic-addon1">
                        <i class="fa fa-search"></i>
                    </span>
                    </div>
                    <input type="search" id="search-box" class="form-control" placeholder="Search articles & documents" aria-describedby="basic-addon1" autocomplete="off">
                    <small class="form-text text-muted small">To refine your search, type in your question.</small>
                </div>
            </form>
        </div>
        <div class="card-body d-none" id="detail">
        </div>
        <div class="card-body d-none text-center" id="error">
        </div>
        <ul class="list-group list-group-flush" id="document-list">
        </ul>
        <div class="card-body text-center d-none" id="loader">
            <div class="lds-ripple my-3"><div></div><div></div></div>
        </div>
        <div class="card-footer bg-white d-none" id="card-footer">
            <button class="btn btn-sm btn-outline-primary text-capitalize" id="back-button">
                <i class="fa fa-sm fa-chevron-left mr-1"></i> Go Back
            </button>
        </div>
        `;

        this.card = card;
        this.setting = setting;
    }

    show(baseElement) {
        baseElement.appendChild(this.card); // Append the card to the DOM
        this.showElement('search');
        this.addScrollListener();
    }

    addScrollListener(){
        let self = this;
        let list = document.getElementById('document-list')
        list.addEventListener('scroll', (event) => {
            if(list.scrollHeight === (list.scrollTop + list.offsetHeight)){
                console.log('bottom reached');
                if(self.showMore){
                    self.page++;
                    self.getArticles(null, self.page, self.pagesize);
                }
            }

            if(list.scrollTop === 0){
                console.log('top reached');
            }
          });
    }

    addFormEventListener() {
        let self = this;
        let searchForm = document.getElementById('search-form');
        searchForm.addEventListener('submit', event => {
            event.preventDefault();
            let searchTerm = document.getElementById('search-box').value;
            if(searchTerm){
                self.page = 1;
                self.getArticles(searchTerm, self.page, self.pagesize);
                self.hideElement('detail');  
            }
        });
    }

    generateNullState(searchTerm){
        let self = this;
        self.removeArticles();
        let nullTemplate = `
            <i class="fa fa-exclamation-triangle fa-2x text-warning mb-3"></i>
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

    getArticles(searchTerm, page, pagesize) {
        let self = this;

        if(this.loading){
            console.log('Already loading..');
            return false;
        }

        this.loading = true;

        // Show the loader & document-list element
        this.showElement('loader');
        this.showElement('document-list');

        // Get the articles using the service
        this.content.getDocuments(
            self.setting.endpoint,
            self.setting.documentType,
            page || 1,
            pagesize || 10,
            searchTerm,
            self.setting.productArea
        ).then(response => {
            this.loading = false;
            // Hide the loader
            self.hideElement('loader');
            self.buildResponseDom(response, searchTerm);
        }).catch(error => {
            this.loading = false;
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
        while (ul.firstChild) {
            ul.removeChild(ul.firstChild);
        }
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
            self.getArticles(null, this.page);
        });
    }

    addError(error) {
        let alertTemplate = `
                    <div class="alert alert-danger" role="alert">
                    ${error.message || error}</div>
                `;
        document.getElementById('detail').innerHTML = alertTemplate;
    }

    generateRelatedArticles(related){
        let self = this;
        let content = new Content();

        if(related && related.length){
            let ul = document.createElement('ul');
            ul.setAttribute('id','related-articles');
            ul.className = 'list-group'
            ul.innerHTML = '<h6>See Also</h6><hr>'
            document.getElementById('detail').appendChild(ul);

            related.forEach(id => {
                content.getById(self.setting.endpoint, id).then(doc => {
                    let relatedDocument = new FaqDocument(doc).getSnapshot();
                    console.log(relatedDocument);
                    let e = document.createElement('li');
                    e.className = 'list-group-item';
                    e.innerHTML = `
                    <h6>${relatedDocument.title}</h6>
                    <small>${relatedDocument.snippet}</small>
                    <a class="read-more small float-right mt-1" href="#" data-document-id="${doc.id}">Read More</a>
                    `;
                    e.childNodes.forEach(node => {
                        if (doc.id) {
                            self.addListItemEventListener(node);
                        }
                    });
                    document.getElementById('related-articles').appendChild(e);
                }).catch(err => console.error(err))
            })
        }
    }

    generateDetailView(id) {
        let self = this;

        if (self.showDetail) {
            console.log('Detail view is already open');
            this.hideElement('detail');
        }

        // Hide these elements: document-list
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

                let faq = new FaqDocument(doc);
                let faqDocument = faq.getDocument();
                let related = faq.getRelatedArticles();
                let cardTemplateContent = `
                    <h5 class="card-title">${faqDocument.title}</h5><hr>
                    <div>${faqDocument.content}</div>
                `;
                document.getElementById('detail').innerHTML = cardTemplateContent;
                self.generateRelatedArticles(related);

            }).catch(error => {
                // Hide the loader
                self.hideElement('loader');
                self.addError(error);
            });
    }

    generateBadgeClass(productArea){
        var c;
        switch(productArea){
            case 'leadplus': c = 'badge-primary'; break;
            case 'catalogue': c = 'badge-warning'; break;
            default: c = 'badge-primary';
        }
        return c;
    }

    buildResponseDom(response, searchTerm) {
        let results = response.results;
        let self = this;

        if(response.next_page){
            self.showMore = true;
        } else {
            self.showMore = false;
        }

        if(!response.results_size){
            this.generateNullState(searchTerm);
        } else {
            let documentList = document.getElementById('document-list');
            if(searchTerm){
                self.removeArticles();
            }
            results.forEach(doc => {
                let listItem = document.createElement('li');
                listItem.classList.add('list-group-item');
                let faqItem = this.getListItemContent(doc);
                listItem.innerHTML = `
                <span class="badge text-uppercase ${self.generateBadgeClass(faqItem.productArea)}">${faqItem.productArea}</span>
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