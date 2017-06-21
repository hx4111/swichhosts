import React from 'react'
import ReactDOM from 'react-dom'
import App from './pages/index.js'
import injectTapEventPlugin from 'react-tap-event-plugin'
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

injectTapEventPlugin()

ReactDOM.render( 
    <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
        <App />
    </MuiThemeProvider>,
    document.getElementById('root')
)