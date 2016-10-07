import jsdom from 'jsdom';

const defaultJsdomConfig = {
  features: {
    FetchExternalResources: false,
    ProcessExternalResources: false
  }
};

const cloneObject = obj => JSON.parse(JSON.stringify(obj));

const protectedproperties = (() => {
  const window = jsdom.jsdom('<html><body></body></html>', cloneObject(defaultJsdomConfig)).defaultView;

  return Object
    .getOwnPropertyNames(window)
    .filter(prop => global[prop]);
})();

module.exports = (...args) => {
  const properties = args.filter(arg => Array.isArray(arg))[0];
  const userJsdomConfig = args.filter(arg => !Array.isArray(arg))[0];

  const jsdomConfig = Object.assign({}, userJsdomConfig, defaultJsdomConfig);

  const window = jsdom.jsdom('<html><body></body></html>', cloneObject(jsdomConfig)).defaultView;

  Object
    .getOwnPropertyNames(window)
    .filter(prop => protectedproperties.indexOf(prop) === -1)
    .filter(prop => !(properties && properties.indexOf(prop) === -1))
    .forEach(prop => global[prop] = window[prop]);

  return window;
};
