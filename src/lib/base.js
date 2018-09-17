import { Setting } from '../util/init';
import { Content } from './content';
import * as PrismicDOM from 'prismic-dom';
import { FaqDocument } from '../util/faqParser';

export class Base {

    constructor(configuration) {
        this.initialized = false;
        this.content = new Content();
        this.configuration = configuration || {
            ...configuration,
            documentType: 'faq'
        };
        console.log(configuration);
        this.setting = new Setting(configuration.endpoint, configuration.documentType);
    }

    getBaseElement() {
        return this.setting.getBaseElement();
    }

    showHideElement(element) {
        let e = document.getElementById(element);
        if (e) {
            if (e.style.display === 'none') {
                e.style.display = 'block';
            } else {
                e.style.display = 'none';
            }
        } else {
            console.log(`${e} does not exist`);
        }
    }

    getListItemContent(document) {
        return new FaqDocument(document).getSnapshot();
    }

    addBackButtonEvents() {
        let self = this;
        let backButton = document.getElementById('back-button');
        backButton.addEventListener('click', event => {
            document.getElementById('detail').innerHTML = '';
            self.showHideElement('card-footer');
            self.showHideElement('detail');
            self.showHideElement('search');
            self.showHideElement('document-list');
        });
    }

    generateDetailView(id, context) {
        context.showHideElement('search');
        context.showHideElement('document-list');
        context.showHideElement('loader');

        let content = new Content();
        content.getById(context.setting.endpoint, id)
            .then(doc => {
                context.showHideElement('detail');
                context.showHideElement('loader');
                context.showHideElement('card-footer');
                let faqDocument = new FaqDocument(doc).getDocument();
                let cardTemplateContent = `
                    <h5 class="card-title">${faqDocument.title}</h5><hr>
                    <div>${faqDocument.content}</div>
                `;
                document.getElementById('detail').innerHTML = cardTemplateContent;
            }).catch(error => {
                context.showHideElement('detail');
                context.showHideElement('loader');
                context.showHideElement('card-footer');
                let alertTemplate = `
                    <div class="alert alert-danger" role="alert">
                    ${error.message || error}</div>
                `;
                document.getElementById('detail').innerHTML = alertTemplate;
            });
    }

    buildResponseDom(response) {
        let results = response.results;
        let documentList = document.getElementById('document-list');
        let self = this;
        results.forEach(doc => {
            let listItem = document.createElement('li');
            listItem.classList.add('list-group-item');
            let faqItem = this.getListItemContent(doc);
            listItem.innerHTML = `<h6>${faqItem.title}</h6><small>${faqItem.snippet}</small><a class="read-more small float-right mt-1" href="#" data-document-id="${doc.id}">Read More</a>`;
            listItem.childNodes.forEach(node => {
                if(node.getAttribute('data-document-id')){
                    node.addEventListener('click', (event) => {
                        if (event.stopPropogation) {
                            event.stopPropogation();
                        }
                        if(event.target.getAttribute('data-document-id')){
                            self.addBackButtonEvents();
                            self.generateDetailView(event.target.getAttribute('data-document-id'), self);
                        }
                    }, false);
                }
            });
            documentList.appendChild(listItem);
        });
        this.showHideElement('search');
        this.showHideElement('document-list');
    }

    getArticles(searchTerm) {
        this.showHideElement('loader');
        this.content.getDocuments(
            this.setting.endpoint,
            this.setting.documentType,
            1,
            10,
            searchTerm
        ).then(response => {
            this.showHideElement('loader');
            this.buildResponseDom(response);
        }).catch(error => {
            this.showHideElement('loader');
        });
    }

    showCard() {
        console.log('Showing the card, post button click');
        let card = document.createElement('div');
        card.setAttribute('id', 'help-card');
        card.classList.add('card', 'mb-2', 'd-block', 'animated', 'fadeInRight', 'w-100'); // this is the root card

        card.innerHTML = `
        <div class="card-header">
            Hi, How can we help?
        </div>
        <div class="card-body" id="search">
            <form>
                <div class="input-group">
                    <div class="input-group-prepend">
                    <span class="input-group-text bg-white" id="basic-addon1">
                        <i class="fas fa-search"></i>
                    </span>
                    </div>
                    <input type="search" class="form-control" placeholder="Search articles & documents" aria-describedby="basic-addon1">
                    <small class="form-text text-muted small">To refine your search, type in your question.</small>
                </div>
            </form>
        </div>
        <div class="card-body" id="detail">
        </div>
        <div class="card-body text-center" id="loader">
            <div class="lds-ripple my-3"><div></div><div></div></div>
        </div>
        <ul class="list-group list-group-flush" id="document-list">
        </ul>
        <div class="card-footer bg-white" id="card-footer">
            <a class="btn btn-sm btn-outline-primary" id="back-button" href="#">
                <i class="fas fa-sm fa-chevron-left mr-1"></i> Go Back
            </a>
        </div>
        `;

        this.getBaseElement().appendChild(card);
        this.showHideElement('search');
        this.showHideElement('card-footer');
        this.showHideElement('document-list');
        this.showHideElement('loader');
        this.showHideElement('detail');
        this.getArticles();
    }

    destroyCard() {
        let card = document.getElementsByClassName('card')[0];
        if (card.classList.contains('fadeInRight')) {
            card.classList.remove('fadeInRight');
            card.classList.add('fadeOutRight');
        }
        setTimeout(() => {
            card.remove();
        }, 1500);
    }

    showButton() {
        let button = document.createElement('button'); // Create the help button
        button.classList.add('fab-caller', 'float-right');
        button.innerHTML = '<i class="fas fa-question animated fadeIn fa-sm"></i>';

        let self = this;

        button.addEventListener('click', () => {
            if (!button.getAttribute('data-open') && button.getAttribute('data-open') !== 'open') {
                button.setAttribute('data-open', 'open');
                button.innerHTML = '<i class="fas fa-times animated rotateIn fa-xs"></i>'
                self.showCard();
            } else {
                button.innerHTML = '<i class="fas fa-question animated fadeIn fa-xs"></i>';
                button.removeAttribute('data-open');
                self.destroyCard();
            }
        });
        this.getBaseElement().appendChild(button);
    }

    init() {
        this.showButton();
        this.initialized = true;
    }

}