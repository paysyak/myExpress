const http = require('http');

const appRouters = {
    '/user/:id/action/:action': 'POST',
    '/user/:id/action/:action': 'PUT',
    '/user/:id/action/delete': 'DELETE',
    '/test/:test/action/:id': 'POST'
};

/**
 * 
 * @param {array} routers 
 * 
 * @return {array} 
 */
const convertRouters2Patterns = routers => {
    return routerStructure = routers.map(key => {
    	let pattern =  '^' + key.replace('/', '\\/') + '$';
        return new RegExp(pattern.replace(/:\w*/g, '\\w*'));
    });
};

/**
 * 
 * @param {array} routersStructure 
 * @param {string} url 
 * @param {array} slugs 
 * 
 * @return {string}
 */
const getCurrentRouter = (routersStructure, url, slugs) => {
    let routerIndex = -1;
    routersStructure.forEach((pattern, key) => {
        if(pattern.test(url)) {
      	    routerIndex = key;
        }
    });

    if (routerIndex == -1) {
        throw('Opps, wrong url');
    }

    return slugs[routerIndex];
};

/**
 * 
 * @param {string} structureUrl 
 * @param {string} currentUrl 
 * 
 * @return {object}
 */
const generateParams = (structureUrl, currentUrl) => {
    const keys = [];
    const params = {};

    paramsKeys = structureUrl.split('/');
    paramsValues = currentUrl.split('/');
    
    paramsKeys.forEach((val, key) => {
        if(val[0] === ':') {
            keys.push(key);
        }
    });
    
    keys.forEach((val) => {
    	params[paramsKeys[val].substr(1)] = paramsValues[val];
    });

    return params;
};

/**
 * 
 * @param {object} routers 
 * @param {string} url 
 * 
 * @return {object}
 */
const urlParser = (routers, url) => {
    url = url.replace(/\?(.*)/,"");

    const slugs = Object.keys(routers);
    const routerStructure = convertRouters2Patterns(slugs);
    
    return generateParams(
        getCurrentRouter(routerStructure, url ,slugs),
        url
    );
};

const server = http.createServer((req, res) => {
    req.params = urlParser(appRouters, req.url);

    console.log(req.params);
    res.end();
});

server.listen(3000, 'localhost', () => {
  console.log('Listen server on port 3000');
});