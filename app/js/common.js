import path from 'path'

class Settings {

    get platform() {
        return process.platform
    }

    get isDarwin() {
        return process.platform === 'darwin'
    }

    get isWin32() {
        return process.platform === 'win32'
    }

    get hostFilePath() {
        if (this.isDarwin) {
            return path.join('/etc/hosts')
        } else if (this.isWin32) {
            return path.join('C:\Windows\\System32\\drivers\\etc\\hosts') 
        }
    }
}

const settings = new Settings()
export {
    settings
}