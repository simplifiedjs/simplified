import React from 'react';

let components = {};

export function addComponent() {

}

export function hasComponent(name) {
    return !!components[name];
}

export function getComponent(name) {
    if (!hasComponent(name)) {
        return null;
    }

    return components[name];
}

export function renderComponent(name, props = {}, children = null) {
    props = props || {};
    children = children || null;

    let compo = getComponent(name);

    if (!compo) {
        return null;
    }

    return React.cloneElement(compo, props, children);
}

export function getAllComponents() {}