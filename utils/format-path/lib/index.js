'use strict';
import path from 'path';
export default function formatPath(p) {
    const sep = path.sep;
    if(sep === '/'){
        return p;
    } else {
        return p.replace(/\\/g, '/');
    }
}
