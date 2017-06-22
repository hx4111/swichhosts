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

export default class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            hostsArray: [],
            filterIp: null,
            filterDomain: null,
            enableChecked: false,
            delDialogOpen: false,
            preDelHost: null
        }
        
        this.filterInput = this.filterInput.bind(this)
        this.handleDelClose = this.handleDelClose.bind(this)
        this.handleDelEnter = this.handleDelEnter.bind(this)
        // this.delHost = this.delHost.bind(this)
        // this.delHostList = this.delHostList.bind(this)
        // this.enableHostList = this.enableHostList.bind(this)
        // this.selectRow = this.selectRow.bind(this)
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
                if (host.ip.indexOf(filterIpStr) >= 0) {
                    host.visiable = false
                }
            }
            if (filterDomainStr && filterDomainStr.length > 0) {
                if (host.domain.indexOf(filterDomainStr) >= 0) {
                    host.visiable = false
                }
            }
        })
        this.dispatchHostFile(this.state.hostsArray)
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

    delHost(host) {
        this.setState({
            delDialogOpen: true,
            preDelHost: host
        })
    }

    delHostList() {
        let tempArray = []
        // for (let i of this.state.selArray) {

        // }
    }

    enableHostList() {

    }

    handleDelClose() {
        this.setState({
            delDialogOpen: false,
            preDelHost: null
        })
    }

    handleDelEnter() {
        let index = this.state.hostsArray.indexOf(this.state.preDelHost)
        if (index >=0 ) {
            this.state.hostsArray.splice(index, 1)
            this.dispatchHostFile(this.state.hostsArray)
        }
        this.handleDelClose()
    }

    selectRow(selected) {
        console.info(selected)
        if (selected === 'all') {
            let tempArray = new Array(this.state.showHosts.length).fill(1).map( (v, i) => v = i )
            this.setState({
                selArray: tempArray
            })
        } else if (selected === 'none') {
            this.setState({
                selArray: []
            })
        } else {
            this.setState({
                selArray: selected
            })
        }
    }

    dispatchHostFile(hostsArray) {
        this.setState({
            hostsArray: hostsArray
        })
        this.filterInput()
        HostSwitch.setHosts(hostsArray)
    }

    render() {
        const actions = [ 
            <FlatButton 
                label = "取消" 
                primary = { true }
                onTouchTap = { this.handleDelClose } />, 
            <FlatButton 
                label = "确认" 
                primary = { true }
                onTouchTap = { this.handleDelEnter } />
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
                    <TableBody showRowHover={true}>
                        {
                            this.state.hostsArray.map( host => {
                                return !host.visiable ? null : (
                                    <TableRow key={host.id}>
                                        <TableRowColumn>{ host.ip }</TableRowColumn>
                                        <TableRowColumn>{ host.domain }</TableRowColumn>
                                        <TableRowColumn><Toggle label="Enable" defaultToggled={host.enable} onClick={this.enableHost.bind(this, host)}/></TableRowColumn>
                                        <TableRowColumn>
                                            <RaisedButton className="opButton" label="Edit" primary={true} />
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
                    <RaisedButton className="opButton" label="新增" primary={true} />
                    <RaisedButton className="opButton" label={ this.state.enableChecked ? "启用" : "禁用" } primary={true} onClick={this.enableHostList} />
                </div>
                <Dialog
                    actions={actions}
                    modal={false}
                    open={this.state.delDialogOpen}
                    onRequestClose={this.handleDelClose}
                >
                    确认删除？
                </Dialog>
            </div>
        )
    }
}
