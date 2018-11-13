import * as PrismicDOM from 'prismic-dom';

export class FaqDocument{

    constructor(document) {
        if (document) {
            let raw = document.rawJSON;
            this.title = PrismicDOM.RichText.asText(raw.title).trim();
            this.id = document.id;
            let post_content = [];
            post_content = raw.answer;
            this.content_text = PrismicDOM.RichText.asText(post_content).trim().substring(0, 72) + '…';
            post_content = post_content.map(content => {
                if (content.type === 'embed') {
                    content.oembed.html
                        .replace(/<iframe/g, '<iframe class="embed-responsive-item"')
                        .replace(/<script async defer src=\"\/\/www.instagram.com\/embed.js\"><\/script>/g, '')
                    if (!content.oembed.html.includes('embed-responsive') && !content.oembed.html.includes('twitter')) {
                        content.oembed.html = (`<div class="embed-responsive embed-responsive-4by3 mb-5">${content.oembed.html}</div>`)
                    }
                }

                return content;
            });
            this.content = PrismicDOM.RichText.asHtml(post_content).replace(/img/g, 'img class="img-fluid border"').replace(/class=" block-img class="img-fluid border""/g, '')
            this.publishedOn = document.firstPublicationDate;
            this.updatedOn = document.lastPublicationDate;
            this.related = raw.related.map(article => {
                return article.article.id
            });
            this.error = null;
        } else {
            this.error = new Error('Could not retreive the document');
        }
    }

    getDocument(){
        return {
            title: this.title,
            content: this.content,
            publishedOn: this.publishedOn,
            updatedOn: this.updatedOn,
            error: this.error
        }
    }

    getSnapshot(){
        return {
            title: this.title,
            snippet: this.content_text,
            id: document.id
        }
    }

    getRelatedArticles(){
        return this.related
    }

}