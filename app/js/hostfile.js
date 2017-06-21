
const fs = require('fs')
const readline = require('readline')
const path = require('path')

let hostPath = ''
if (process.platform === 'win32') {
    hostPath = path.join('C:\Windows\\System32\\drivers\\etc\\hosts')
} else {
    hostPath = path.join('/private/etc/hosts')
}

class Host {
    constructor(hostStr, uri, enable) {
        this.hostStr = hostStr
        this.uri = uri
        this.enable = enable || false
    }
}

const HostSwitch = {
    hostArray: [],
    addHost(host) {
        this.hostArray.push(host)
    },
    updateHost(oldHost, newHost) {
        this.hostArray.filter( (host) => {
            if (host.uri == oldHost.uri) {
                host = newHost
                return
            }
        })
    },
    deleteHost(host) {
        let delIndex = this.hostArray.indexOf(host)
        if (delIndex >= 0) {
            this.hostArray.splice(delIndex, 1)
        }
    },
    taggleHost(host) {
        this.hostArray.filter( (hostObj) => {
            if (hostObj.uri == host.uri) {
                hostObj.enable = !hostObj.enable
                return
            }
        })
    },
    getHosts() {
        let rlHosts = readline.createInterface({
            input: fs.createReadStream(hostPath)
        })
        
        rlHosts.on('line', (line) => {
            let reg = /^#?\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}/
            if (reg.test(line)) {
                let hostStr, uri, enable
                let splitArr = line.trim().split(/\s|\t/).filter((item) => item)
                if (splitArr[0].indexOf('#') >= 0) {
                    enable = false
                    if (splitArr[0].length > 1) { // 形式为 #127.0.0.1 xxx.xx.com
                        hostStr = splitArr[0].substring(1)
                        uri = splitArr[1]
                    } else if (splitArr[0].length == 1) { // 形式为 # 127.0.0.1 xxx.xx.com
                        hostStr = splitArr[1]
                        uri = splitArr[2]
                    }
                } else {
                    enable = true
                    hostStr = splitArr[0]
                    uri = splitArr[1]
                }
                this.addHost(new Host(hostStr, uri, enable))
            }
        })

        return new Promise((resolve, reject) => {
            rlHosts.on('close', () => {
                resolve(this.hostArray)
            })
        })
    }
}

module.exports = {
    HostSwitch
}