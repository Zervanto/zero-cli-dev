'use strict';
import urlJoin from 'url-join';
import axios from 'axios';
import semver from 'semver';
// module.exports = getNpmInfo;
function getNpmInfo(npmName, registry) {
    // TODO
    if(!npmName) {
        return null;
    }
    registry = registry || getDefaultRegistry();
    // console.log(npmName);
    const npmInfoUrl = urlJoin(registry, npmName);
    // console.log(npmInfoUrl);
    
    return axios.get(npmInfoUrl).then(res => {
        if(res.status === 200) {
            return res.data;
        } else{
            return null;
        }
    }).catch(err => {
        return Promise.reject(err);
    });
}
async function getNpmVersions(npmName, registry) {
    const data = await getNpmInfo(npmName, registry);
    if(data){
        return Object.keys(data.versions);
    } else {
        return [];
    }
}
function getSemverVersions(baseVersion, versions) {
    return versions.filter(version => {
        semver.satisfies(version, `^${baseVersion}`)
    }).sort((a,b)=>{
        semver.gt(b,a);
    })
} 
async function getNpmSemverVersions(baseVersion, npmName, registry) {
    const versions = await getNpmVersions(npmName, registry);
    // console.log(versions);
    const newVersions = getSemverVersions(baseVersion, versions);
    if(newVersions && newVersions.length > 0) {
        return newVersions[0];
    }
}
function getDefaultRegistry(isOriginal = false) {
    return isOriginal ? 'https://registry.npmjs.org' : 'https://registry.npm.taobao.org';
}
export {
    getNpmInfo,
    getNpmSemverVersions,
    getDefaultRegistry
}