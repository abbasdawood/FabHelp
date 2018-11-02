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
- Include the javascript and css files from the `/dist` directory of the project in your web app
```
<script src="/node_modules/fabhelp/dist/fabhelp.js"></script>
```
- In your `index.html`, place the following code after including all the dependencies
```html
  <!-- Add this immediately after the body tag -->
  <div id="help-root"></div> 
```
```javascript
<script type="text/javascript">
    document.addEventListener('DOMContentLoaded', function(){
      let bud = new Bud({
        endpoint: 'your prismic bucket endpoint',
        documentType: 'faq'
     });
      bud.init();
    });
</script>
```

## Initialisation Options
A new instance of Bud is created with the following options

Option | Mandatory | Description | Default Value
----|----|----|----
endpoint|Yes|The endpoint obtained from your prismic repository|
documentType|Yes|The document type in your prismic repository|`faq`
productArea|No|An added filter to choose FAQs only of a particular app|
orientation|No|Gradient orientation in the Floating Action Button| `-45deg`
colors|No|Array with the color of the button, if more than one color is defined, the button will have a linear-gradient|['#00bbf9', '#007eff']

Once the initialisation is done, you will need to call `bud.init()`. The `init()` method can be called with a single string parameter passed to it, this will open the help interface with any and all articles with the keyword.

For example. `bud.init('time')` will search for all articles with the phrase `time` in them. The search is a full text search, and does not account for typos.


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
