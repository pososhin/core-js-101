/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  getArea() {
    return this.width * this.height;
  }
}

/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  function Obj() {
    const o = JSON.parse(json);
    Object.keys(o).forEach((key) => { this[key] = o[key]; });
  }
  Obj.prototype = proto;
  return new Obj();
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {
  str: [],
  bin: ['', '#', '.', '[', ':', '::'],

  fn_add(element, prefix = '', sufix = '') {
    const b = { ...cssSelectorBuilder };
    b.ids = { ...this.ids };
    if (typeof element === 'string') {
      const index = this.bin.indexOf(prefix);
      if (index >= 0) {
        this.str.find((x) => {
          if (this.bin.indexOf(x.pre) === index && (index === 0 || index === 1 || index === 5)) {
            throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
          }
          if (this.bin.indexOf(x.pre) > index) {
            throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
          }
          return undefined;
        });
      }
      b.str = [...this.str, { e: element, pre: prefix, suf: sufix }].flat();
    } else {
      b.str = [...this.str, ...element].flat();
    }
    return b;
  },

  element(value) {
    return this.fn_add(value);
  },

  id(value) {
    return this.fn_add(value, '#');
  },

  class(value) {
    return this.fn_add(value, '.');
  },

  attr(value) {
    return this.fn_add(value, '[', ']');
  },

  pseudoClass(value) {
    return this.fn_add(value, ':');
  },

  pseudoElement(value) {
    return this.fn_add(value, '::');
  },

  combine(selector1, combinator, selector2) {
    return this.fn_add(selector1.str)
      .fn_add(combinator, ' ', ' ')
      .fn_add(selector2.str);
  },

  stringify() {
    return this.str.map((x) => [x.pre, x.e, x.suf].join('')).join('');
  },
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
