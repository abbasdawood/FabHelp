import { Setting } from '../util/init';
import { Content } from './content';
import { Card } from './card';

export class Base {

    constructor(configuration) {
        this.initialized = false;
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

    showCard() {
        this.card = new Card(this.setting);
        this.card.show(this.getBaseElement());
        this.card.getArticles();
        this.hideOnClickOutside(document.getElementById('help-card'));
    }

    destroyCard(){
        this.card.remove();
    }

    /**
     * Function to show the button on the page
     */
    showButton() {
        let button = document.createElement('button'); // Create the help button
        button.classList.add('fab-caller', 'float-right');
        button.innerHTML = '<i class="fas fa-question animated fadeIn fa-sm"></i>';

        let self = this;

        button.addEventListener('click', (event) => {
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

    hideOnClickOutside(element) {
        // source (2018-03-11): https://github.com/jquery/jquery/blob/master/src/css/hiddenVisibleSelectors.js 
        const isVisible = element => !!element && !!( element.offsetWidth || element.offsetHeight || element.getClientRects().length ) 

        let outsideClickListener = event => {
            if (!element.contains(event.target)) { // or use: event.target.closest(selector) === null
                if (isVisible(element)) {
                    element.style.display = 'none'
                    removeClickListener()
                }
            }
        }
    
        let removeClickListener = () => {
            document.removeEventListener('click', outsideClickListener)
        }
    
        document.addEventListener('click', outsideClickListener)
    }

    /**
     * Entry point, this starts the initialisation
     */
    init() {
        this.showButton();
        this.initialized = true;
    }

}