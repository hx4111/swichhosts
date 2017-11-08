
import fs from 'fs'
import readline from 'readline'
import path from 'path'
import { settings } from './common' 

class Host {
    constructor({ip, domain, enable}) {
        this.id = Host.cnt++
        this.ip = ip
        this.domain = domain
        this.enable = enable || false
    }

    toString() {
        let str = ''
        !this.enable && (str += '# ')
        str += this.ip + ' '
        str += this.domain + ' \n'
        return str
    }
}
Host.cnt = 1

class HostSwitch {

    getHosts() {
        let hostsArray = []
        let rlHosts = readline.createInterface({
            input: fs.createReadStream(settings.hostFilePath)
        })
        
        let reg = /(\d{1,3}\.)[3]\d{1,3}/
        rlHosts.on('line', (line) => {
            if (reg.test(line)) {
                let ip, domain, enable
                let splitArr = line.trim().split(/\s|\t/).filter((item) => item)
                if (splitArr[0].indexOf('#') >= 0) {
                    enable = false
                    if (splitArr[0].length > 1) { // 形式为 #127.0.0.1 xxx.xx.com
                        ip = splitArr[0].substring(1)
                        domain = splitArr[1]
                    } else if (splitArr[0].length == 1) { // 形式为 # 127.0.0.1 xxx.xx.com
                        ip = splitArr[1]
                        domain = splitArr[2]
                    }
                } else {
                    enable = true
                    ip = splitArr[0]
                    domain = splitArr[1]
                }
                hostsArray.push(new Host({ip, domain, enable}))
            }
        })

        return new Promise((resolve, reject) => {
            rlHosts.on('close', () => {
                resolve(hostsArray)
            })
        })
    }

    setHosts(hostsArray) {
        let wrHosts = fs.createWriteStream(settings.hostFilePath, { flags:'w+' })
        for (let host of hostsArray) {
            wrHosts.write(host.toString())
        }
        wrHosts.end()
        wrHosts.on('finish', () => {
            console.info('写入文件结束')
        })
    }
}

const hostSwitch = new HostSwitch()

export {
    hostSwitch,
    Host
}