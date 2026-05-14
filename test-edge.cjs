const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { EdgeText } = require('reactflow');

console.log(renderToStaticMarkup(React.createElement(EdgeText, { x: 10, y: 10, label: 'Hello' })));
