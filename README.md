# FabHelp

Fabhelp is a javascript plugin that works with [Prismic](https://prismic.io) as a content management system. It can be used to trigger an in-app help from a floating action button in any of the web projects.

![alt text](https://github.com/abbasdawood/FabHelp/blob/master/recording.gif "How it works")

## QuickStart
To get started:
- Create a free account on [Prismic.io](https://prismic.io)
- Create a content model called `FAQ` in the project, with at least two fields:

Field Name | API Key / ID | What is this for? | Data Type
------------|--------------|---------------------|-----------
Title| title| This will hold the frequently asked question | Title
Answer| answer| This will hold the answer to the question asked above | Rich Text

- Install the peer dependencies of fontawesome, bootstrap and animate.css by using the following command:
```
npm i --save bootstrap @fortawesome/fontawesome-free animate.css
```
- In your `index.html`, place the following code after including all the dependencies
```html
  <!-- Add this immediately after the body tag -->
  <div id="help-root"></div> 
```
```javascript
<script type="text/javascript">
    function asyncBudInit(){
      bud.init({
        endpoint: 'https://auxil.cdn.prismic.io/api/v2',
        documentType: 'faq',
        orientation: '-45deg',
        colors: ['#0486ff'],
        productArea: 'leadplus'
      });
      
      bud.show(); // Shows the floating action button on the page
    }

    (function(d, s, id){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement(s); js.id = id;
      js.onload = asyncBudInit;
      js.src = "https://plugin.bizongo.in/bud.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'bud');
</script>
```

## Initialisation Options
Bud will need to be initialised with the following options

Option | Mandatory | Description | Default Value
----|----|----|----
endpoint|Yes|The endpoint obtained from your prismic repository|
documentType|Yes|The document type in your prismic repository|`faq`
productArea|No|An added filter to choose FAQs only of a particular app|
orientation|No|Gradient orientation in the Floating Action Button| `-45deg`
colors|Yes|Array with the color of the button, if more than one color is defined, the button will have a linear-gradient|['#00bbf9', '#007eff']

Once the initialisation is done, you will need to call `bud.show()`. The `show()` method can be called with a single string parameter passed to it, this will open the help interface with any and all articles with the keyword.

For example. `bud.show('time')` will search for all articles with the phrase `time` in them. The search is a full text search, and does not account for typos.


## Peer dependencies
This module depends on [Bootstrap](https://getbootstrap.com/), [FontAwesome](https://fontawesome.com) and [Animate.css](https://daneden.github.io/animate.css/)

## Todo
- Make the library more modular for scalability
- Write test suites
- Give more options for configuration
- Make it usable in any web app
- Build wrappers for AngularJS, Angular and React

## Changelog
All the changes to the project are maintained in the [Changelog](CHANGELOG.md)

## License
Fabhelp is licensed under the MIT license. (http://opensource.org/licenses/MIT)
