import { Prismic } from 'prismic.io';

export class Content {

    returnErrorPromise(err){
        console.error(err);
        return Promise.reject(err);
    }

    /**
   * Function to get documents of type blog_post
   * @param  {number} page
   * @param  {number} pageSize
   * @param  {string} content?
   * @param  {string} tags?
   * @returns Promise
   */
    getDocuments(endpoint, type, page, pageSize, content, tags, after) {
        if (endpoint) {
            let filters = [Prismic.Predicates.at('document.type', type)]
            let options = { page: page, pageSize: pageSize, orderings: `[my.${type}.last_publication_date desc]` }

            if (content) {
                filters.push(Prismic.Predicates.fulltext('document', content))
            }

            if (tags) {
                filters.push(Prismic.Predicates.any('document.tags', tags.split(',')))
            }

            if (after) {
                options['after'] = after
            }

            return Prismic.getApi(endpoint).then(api => {
                return api.query(filters, options)
            })
        } else {
            return this.returnErrorPromise(new Error('Please set a valid Prismic Endpoint according to the configuration'));
        }
    }

    /**
     * Function to get a single document from Prismic
     * @param {string} endpoint Prismic Endpoint
     * @param {string} id 
     * @param {Object} queryObject 
     */
    getById(endpoint, id, queryObject) {
        if (endpoint) {
            if(id){
                return Prismic.getApi(endpoint).then(api => {
                    return api.getByID(id, queryObject)
                });
            } else {
            return this.returnErrorPromise(new Error('Not a valid document ID'));
            }
        } else {
            return this.returnErrorPromise(new Error('Please set a valid Prismic Endpoint according to the configuration'));
        }
    }

}