import React from 'react'
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableFooter,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table'
import Toggle from 'material-ui/Toggle'
import RaisedButton from 'material-ui/RaisedButton'
import AppBar from 'material-ui/AppBar'
import TextField from 'material-ui/TextField'

import '../less/index.less' 

import { HostSwitch } from '../js/hostfile.js'

export default class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            hostsArray: [],
            showHosts: [],
            filterIp: null,
            filterDomain: null,
            enableChecked: false
        }
        this.filterInput = this.filterInput.bind(this)
    } 

    componentDidMount() {
        HostSwitch.getHosts().then(res => {
            this.setState({
                hostsArray: this.state.hostsArray.concat(res),
                showHosts: this.state.showHosts.concat(res)
            })
        })
    }

    filterInput(type, e) { // 表格过滤逻辑，待优化
        let filterIpStr = this.state.filterIp, 
            filterDomainStr = this.state.filterDomain 
        let inputFilter = e.target.value.trim()

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
        this.setState({
            showHosts: this.state.hostsArray.filter( (host) => {
                let booleanIpFilter = true,
                    booleanDomainFilter = true
                if (filterIpStr && filterIpStr.length > 0) {
                    if (host.hostStr.indexOf(filterIpStr) < 0) {
                        booleanIpFilter = false
                    }
                }
                if (filterDomainStr && filterDomainStr.length > 0) {
                    if (host.uri.indexOf(filterDomainStr) < 0) {
                        booleanDomainFilter = false
                    }
                }
                return booleanIpFilter && booleanDomainFilter
            })
        })
    }

    delHost() {

    }

    render() {
        return (
            <div>
                <AppBar title="Host Switch" />
                <Table fixedHeader={true} height={"400px"} multiSelectable={true}>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderColumn>IP <TextField className="filter-input" hintText="filter" onChange={this.filterInput.bind(this, 'ip')}/></TableHeaderColumn>
                            <TableHeaderColumn>domain <TextField className="filter-input" hintText="filter" onChange={this.filterInput.bind(this, 'domain')}/></TableHeaderColumn>
                            <TableHeaderColumn>enable/disable</TableHeaderColumn>
                            <TableHeaderColumn>option</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody preScanRows={false}>
                        {
                            this.state.showHosts.map( (host, index) => {
                                return (
                                    <TableRow key={index}>
                                        <TableRowColumn>{ host.hostStr }</TableRowColumn>
                                        <TableRowColumn>{ host.uri }</TableRowColumn>
                                        <TableRowColumn><Toggle label="Enable" defaultToggled={host.enable}/></TableRowColumn>
                                        <TableRowColumn>
                                            <RaisedButton className="opButton" label="Edit" primary={true} />
                                            <RaisedButton className="opButton" label="Delete" primary={true} />
                                        </TableRowColumn>
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                </Table>
                <div className="submit-block">
                    <RaisedButton className="opButton" label="删除" primary={true} onClick={this.delHost}/>
                    <RaisedButton className="opButton" label="新增" primary={true} />
                    <RaisedButton className="opButton" label={ this.state.enableChecked ? "启用" : "禁用" } primary={true} />
                </div>
            </div>
        )
    }
}
