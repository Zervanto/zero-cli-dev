'use strict';
import path from 'path';
export function formatPath(p) {
    const sep = path.sep;
    if(sep === '/'){
        return p;
    } else {
        return p.replace(/\\/g, '/')
    }
}
