import _ from 'underscore';

function getElementSelect(selector) {
    if ('object' === typeof selector) {
        this.elem = [selector];
    } else {
        this.elem = document.querySelectorAll(selector);
    }

    return this;
}

getElementSelect.prototype.get = function(index) {
    return this.elem[index];
};

getElementSelect.prototype.attr = function(name) {
    let value = arguments[1];

    if (!value) {
        // Get the attribute of the first element only
        return this.get(0).getAttribute(name);
    }

    this.elem.forEach( elem => {
        elem.setAttribute(name, value);
    });

    return this;
};

getElementSelect.prototype.addClass = function(className) {
    let classes = this.attr('class');
    classes = classes && classes.split(' ') || [];

    // Don't add the class if it already exist
    if (_.contains(classes, className)) {
        return this;
    }

    classes.push(className);

    this.attr('class', classes.join(' '));

    return this;
};

getElementSelect.prototype.removeClass = function(className) {
    let classes = this.attr('class');
    classes = classes && classes.split(' ') || [];

    // Nothing to remove it does not exist
    if (!_.contains(classes, className)) {
        return true;
    }

    classes = _.without(classes, className);

    this.attr('class', classes.join(' '));

    return this;
};

getElementSelect.prototype.hasClass = function(className) {
    let classes = this.attr('class');
    classes = classes && classes.split(' ') || [];

    return !! _.contains(classes, className);
};

getElementSelect.prototype.on = function(eventName, callback) {
    this.elem.forEach( elem => {
        elem.addEventListener( eventName, callback );
    });
};

getElementSelect.prototype.html = function(html) {
    if (html) {
        return this.elem.forEach( elem => {
            elem.innerHTML = html;
        });
    }

    return this.get(0).innerHTML;
};

const getElement = selector => new getElementSelect(selector);

export default getElement;