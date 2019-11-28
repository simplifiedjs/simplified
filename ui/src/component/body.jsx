import React, {useState, useEffect} from 'react';
import Screen from '../core/screen';

export default function Body({path, loader, children}) {
    const [template, changeTemplate] = useState(Screen.get('template'));

    // Check for template change
    const templateChanged = state => {
        if (state.template && state.template !== template) {
            changeTemplate(state.template);
        }
    };

    useEffect(() => {
        Screen.subscribe(templateChanged);

        return () => Screen.unsubscribe(templateChanged);
    });

    // Change the
    if (!template) {
        Screen.load(path, true);

        // Continue showing the previous loader
        return loader || children || null;
    }

    let content = template;

    if ('function' === typeof content) {
        content = content.call(null);
    }

    return content;
}