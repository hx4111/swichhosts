import React from 'react'
import { Table, TableBody, TableHeader, TableHeaderColumn, TableFooter, TableRow, TableRowColumn } from 'material-ui/Table'
import { RaisedButton, FlatButton, Toggle, AppBar, TextField, Dialog } from 'material-ui'

import '../less/index.less' 

import { Host, HostSwitch } from '../js/hostfile.js'

class HostOp extends Host {
    constructor({ip, domain, enable}) {
        super({ip, domain, enable})
        this.checked = false
        this.visiable = true
    }
}

const dialogStyle = {
    width: '30%',
}

export default class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            hostsArray: [],
            filterIp: null,
            filterDomain: null,
            enableChecked: false,
            dialogOpen: false,
            preDelHost: null,
            opType: null,
            textProp: {
                ip: null,
                domain: null
            },
            editHostProp: null
        }
        
        this.filterInput = this.filterInput.bind(this)
        this.handleDialogClose = this.handleDialogClose.bind(this)
        this.handleDialogSubmit = this.handleDialogSubmit.bind(this)
        this.delHostList = this.delHostList.bind(this)
        this.enableHostList = this.enableHostList.bind(this)
        this.selectRow = this.selectRow.bind(this)
        this.addHost = this.addHost.bind(this)
    } 

    componentDidMount() {
        HostSwitch.getHosts().then(res => {
            let tempArray = []
            for (let host of res) {
                tempArray.push(new HostOp(host))
            }
            this.setState({
                hostsArray: tempArray
            })
        })
    }

    filterInput(type, e) { // 表格过滤逻辑，待优化
        let filterIpStr = this.state.filterIp, 
            filterDomainStr = this.state.filterDomain 
        let inputFilter = e && e.target.value.trim()

        if (type == 'ip') {    
            filterIpStr = inputFilter
            this.setState({
                filterIp: inputFilter
            })
        }
        if (type == 'domain') {
            filterDomainStr = inputFilter
            this.setState({
                filterDomain: inputFilter
            })
        }
        this.state.hostsArray.map( (host) => {
            host.visiable = true
            if (filterIpStr && filterIpStr.length > 0) {
                if (host.ip.indexOf(filterIpStr) < 0) {
                    host.visiable = false
                }
            }
            if (filterDomainStr && filterDomainStr.length > 0) {
                if (host.domain.indexOf(filterDomainStr) < 0) {
                    host.visiable = false
                }
            }
        })

        this.setState({
            hostsArray: this.state.hostsArray
        })
    }

    enableHost(host, e) {
        e.stopPropagation()
        host.enable = !host.enable
        this.dispatchHostFile(this.state.hostsArray)
    }

    updateHost(newHost) {
        let index = this.state.hostsArray.indexOf(newHost),
            tempArray = this.state.hostsArray

        tempArray[index] = newHost
        this.dispatchHostFile(tempArray)
    }

    addHost() {
        this.setState({
            dialogOpen: true,
            opType: 3
        })
    }

    editHost(host, e) {
        e.stopPropagation()
        this.setState({
            editHostProp: host,
            dialogOpen: true,
            opType: 4
        })
    }

    delHost(host, e) {
        e.stopPropagation()
        this.setState({
            dialogOpen: true,
            preDelHost: host,
            opType: 1
        })
    }

    delHostList() {
        this.setState({
            dialogOpen: true,
            opType: 2
        })
    }

    enableHostList() {
        this.state.enableChecked = !this.state.enableChecked
        this.state.hostsArray.map( host => {
            if (host.checked) {
                host.enable = this.state.enableChecked
            }
        })
        this.dispatchHostFile(this.state.hostsArray)
    }

    handleDialogClose() {
        this.setState({
            dialogOpen: false,
            preDelHost: null
        })
    }

    handleDialogSubmit() {
        if (this.state.opType == 1) {
            let index = this.state.hostsArray.indexOf(this.state.preDelHost)
            if (index >=0 ) {
                this.state.hostsArray.splice(index, 1)
                this.dispatchHostFile(this.state.hostsArray)
            }
        } else if (this.state.opType == 2) {
            for (let i = this.state.hostsArray.length - 1; i >= 0; i--) {
                let host = this.state.hostsArray[i]
                if (host.checked) {
                    this.state.hostsArray.splice(i, 1)
                }
            }
            this.dispatchHostFile(this.state.hostsArray)
        } else if (this.state.opType == 3) {
            let tempHost = new Host({ip: this.state.textProp.ip, domain: this.state.textProp.domain})
            this.state.hostsArray.unshift(new HostOp(tempHost))
            this.dispatchHostFile(this.state.hostsArray)
        } else if (this.state.opType == 4) {
            let editHost = this.state.hostsArray.filter( host => host.id == this.state.editHostProp.id)
            if (editHost) {
                editHost.ip = this.state.editHostProp.ip
                editHost.domain = this.state.editHostProp.domain
                this.dispatchHostFile(this.state.hostsArray)
            }
        }
        
        this.handleDialogClose()
    }

    selectRow(index) {
        console.info('into checked ! ' + index)
        let tempArray = this.state.hostsArray.filter( host => { return host.visiable })
        
        tempArray.map( host => host.checked = false)
        if (index === 'all') {
            tempArray.map( host => host.checked = true)
        } else if (index === 'none') {
            
        } else {
            for (let i of index) {
                tempArray[i].checked = true
            }
        }
        this.setState({
            hostsArray: this.state.hostsArray
        })
    }

    handleText(type, prop, event) {
        if (type === 'add') {
            let tempTextProp = this.state.textProp
            
            tempTextProp[prop] = event.target.value
            this.setState({
                textProp: tempTextProp
            })
        } else if (type === 'edit') {
            let tempEditProp = this.state.editHostProp
            
            tempEditProp[prop] = event.target.value
            this.setState({
                editHostProp: tempEditProp
            })
        }
    }

    dispatchHostFile(hostsArray) {
        this.setState({
            hostsArray: hostsArray
        })
        HostSwitch.setHosts(hostsArray)
    }

    render() {
        const actions = [ 
            <FlatButton 
                label = "取消" 
                primary = { true }
                onTouchTap = { this.handleDialogClose } />, 
            <FlatButton 
                label = "确认" 
                primary = { true }
                onTouchTap = { this.handleDialogSubmit } />
        ];
    
        return (
            <div>
                <AppBar title="Host Switch" />
                <Table fixedHeader={true} height={"400px"} multiSelectable={true} onRowSelection={this.selectRow.bind(this)}>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderColumn>IP <TextField className="filter-input" hintText="filter" onChange={this.filterInput.bind(this, 'ip')}/></TableHeaderColumn>
                            <TableHeaderColumn>domain <TextField className="filter-input" hintText="filter" onChange={this.filterInput.bind(this, 'domain')}/></TableHeaderColumn>
                            <TableHeaderColumn>enable/disable</TableHeaderColumn>
                            <TableHeaderColumn>option</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody showRowHover={true} deselectOnClickaway={false}>
                        {
                            this.state.hostsArray.map( host => {
                                return !host.visiable ? null : (
                                    <TableRow key={host.id} selected={host.checked}>
                                        <TableRowColumn>{ host.ip }</TableRowColumn>
                                        <TableRowColumn>{ host.domain }</TableRowColumn>
                                        <TableRowColumn><Toggle label="Enable" defaultToggled={host.enable} onClick={this.enableHost.bind(this, host)}/></TableRowColumn>
                                        <TableRowColumn>
                                            <RaisedButton className="opButton" label="Edit" primary={true} onClick={this.editHost.bind(this, host)}/>
                                            <RaisedButton className="opButton" label="Delete" primary={true} onClick={this.delHost.bind(this, host)}/>
                                        </TableRowColumn>
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                </Table>
                <div className="submit-block">
                    <RaisedButton className="opButton" label="删除" primary={true} onClick={this.delHostList}/>
                    <RaisedButton className="opButton" label="新增" primary={true} onClick={this.addHost}/>
                    <RaisedButton className="opButton" label={ this.state.enableChecked ? "禁用" : "启用" } primary={true} onClick={this.enableHostList} />
                </div>
                <Dialog
                    actions={actions}
                    modal={false}
                    open={this.state.dialogOpen}
                    onRequestClose={this.handleDialogClose}
                    contentStyle={dialogStyle}
                >
                    {
                        (() => {
                            switch(this.state.opType) {
                                case 1: return '确认删除？'
                                case 2: return '确认删除选中条目？'
                                case 3: return (<div className="host-dialog-add">
                                                    <TextField hintText="IP" onChange={this.handleText.bind(this, 'add', 'ip')}/><br/>
                                                    <TextField hintText="domain" onChange={this.handleText.bind(this, 'add', 'domain')}/><br/>
                                                </div>)
                                case 4: return (<div className="host-dialog-add">
                                                    <TextField hintText="IP" value={this.state.editHostProp.ip} onChange={this.handleText.bind(this, 'edit', 'ip')}/><br/>
                                                    <TextField hintText="domain" value={this.state.editHostProp.domain} onChange={this.handleText.bind(this, 'edit', 'domain')}/><br/>
                                                </div>)
                            }
                        })()
                    }
                </Dialog>
            </div>
        )
    }
}
