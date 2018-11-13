import { Setting } from '../util/init';
import { Content } from './content';
import { Card } from './card';

export class Base {

    constructor() {
        
    }

    getBaseElement() {
        return this.setting.getBaseElement();
    }

    showCard(content) {
        this.card = new Card(this.setting);
        this.card.show(this.getBaseElement());
        this.card.addFormEventListener();
        this.card.getArticles(content, 1, 5);
        this.hideOnClickOutside(document.getElementById('help-card'));
    }

    destroyCard() {
        this.card.remove();
    }

    getCssValuePrefix() {
        var rtrnVal = '';//default to standard syntax
        var prefixes = ['-o-', '-ms-', '-moz-', '-webkit-'];

        // Create a temporary DOM object for testing
        var dom = document.createElement('div');

        for (var i = 0; i < prefixes.length; i++) {
            // Attempt to set the style
            dom.style.background = prefixes[i] + 'linear-gradient(#000000, #ffffff)';

            // Detect if the style was successfully set
            if (dom.style.background) {
                rtrnVal = prefixes[i];
            }
        }

        return rtrnVal;
    }

    /**
     * Function to show the button on the page
     */
    show(searchTerm) {
        let button = document.createElement('button'); // Create the help button
        button.classList.add('fab-caller', 'float-right');
        button.innerHTML = '<i class="fa fa-question animated fadeIn fa-sm"></i>';

        if(this.colors.length > 1){
            let colorString = this.colors.join(',')
            button.style.backgroundImage = this.getCssValuePrefix() + `linear-gradient(${this.orientation}, ${colorString})`;
        } else {
            button.style.backgroundColor = this.colors[0];
        }

        let self = this;

        button.addEventListener('click', (event) => {
            if (!button.getAttribute('data-open') && button.getAttribute('data-open') !== 'open') {
                button.setAttribute('data-open', 'open');
                button.innerHTML = '<i class="fa fa-times animated rotateIn fa-xs"></i>'
                self.showCard(self.searchTerm);
            } else {
                button.innerHTML = '<i class="fa fa-question animated fadeIn fa-xs"></i>';
                button.removeAttribute('data-open');
                self.destroyCard();
                self.searchTerm = null;
            }
        });
        this.getBaseElement().appendChild(button);

        if(searchTerm){
            button.click();
        }
    }

    hideOnClickOutside(element) {
        // source (2018-03-11): https://github.com/jquery/jquery/blob/master/src/css/hiddenVisibleSelectors.js 
        const isVisible = element => !!element && !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length)

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
    init(configuration) {
        this.initialized = false;
        this.configuration = configuration || {
            ...configuration,
            documentType: 'faq'
        };
        this.setting = new Setting(configuration.endpoint, configuration.documentType, configuration.productArea);
        this.orientation = configuration.orientation;
        this.colors = configuration.colors
        this.initialized = true;
    }

}