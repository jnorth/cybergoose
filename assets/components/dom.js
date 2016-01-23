import React from 'react';

/**
 * Create a React element.
 *
 * @param {React.Component} type
 *        The React component to use. Passed directly into
 *        `React.createElement`.
 *
 * @param {object} [attributes]
 *        Attributes to pass into `React.createElement`. Two attributes are
 *        treated specially:
 *
 * @param {array|object} [attributes.content]
 *        A child component, or array of child components.
 *
 * @param {array} [attributes.children]
 *        An array of dynamic child components. Each should have a `key` prop.
 *
 * @return {React.Element}
 */
const component = (type, attributes={}) => {
  // Has content
  const content = attributes.content;
  delete attributes.content;

  if (content) {
    if (Array.isArray(content)) {
      return React.createElement(type, attributes, ...content);
    } else {
      return React.createElement(type, attributes, content);
    }
  }

  // Has children
  const children = attributes.children;
  delete attributes.children;

  if (children) {
    return React.createElement(type, attributes, children);
  }

  // Plain
  return React.createElement(type, attributes);
};

/**
 * Creates a component factory.
 *
 * This is used to create a `component` function with the `type` already
 * defined.
 *
 * @param {React.Component} type
 *        The React component to use. Passed directly into
 *        `React.createElement`.
 *
 * @param {boolean} [render=true]
 *        If `false`, the factory will always return `undefined`.
 *
 * @return {function}
 */
const factory = (type, render=true) => {
  return render
    ? attributes => component(type, attributes)
    : attributes => undefined;
};

export default {
  component,
  factory,

  div: factory('div'),
  span: factory('span'),
  a: factory('a'),
  p: factory('p'),
  nav: factory('nav'),
  section: factory('section'),

  button: factory('button'),
  form: factory('form'),
  input: factory('input'),
  label: factory('label'),
};
