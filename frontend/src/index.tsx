// import 'normalize.css'
import React from 'react'
import ReactDOM from 'react-dom'
import { AuthContextProvider } from './contexts'
import { App } from './screens'
import CssBaseline from '@material-ui/core/CssBaseline'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

const theme = createMuiTheme()

const Root = () => (
  <MuiThemeProvider theme={theme}>
    <AuthContextProvider>
      <CssBaseline />
      <App />
    </AuthContextProvider>
  </MuiThemeProvider>
)

ReactDOM.render(<Root />, document.getElementById('root'))

module.hot.accept()
