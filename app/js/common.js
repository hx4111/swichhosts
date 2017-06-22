import path from 'path'

const param = {
    WIN: 'win32',
    OS: 'darwin',

    winHostPath: path.join('C:\Windows\\System32\\drivers\\etc\\hosts'),
    osHostPath: path.join('/private/etc/hosts')
}

function getHostPath() {
    let hostsPath = '',
        platform = process.platform

    if (platform === param.WIN) {
        hostsPath = param.winHostPath
    } else if (platform === param.OS) {
        hostsPath = param.osHostPath
    }
    return hostsPath
}

export {
    param,
    getHostPath
}