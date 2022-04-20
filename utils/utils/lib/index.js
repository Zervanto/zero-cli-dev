'use strict';

// module.exports = utils;

function isObject(o) {
    return Object.prototype.toString.call(o) === '[object Object]';
}

export  {
    isObject
}