import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

class LoginForm extends Component {
  state = {username: '', password: '', showErrMsg: false, errorMsg: ''}

  onChangeUserId = event => {
    this.setState({username: event.target.value})
  }

  onChangePin = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showErrMsg: true, errorMsg})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const url = 'https://apis.ccbp.in/ebank/login'
    const {username, password} = this.state
    const userDetails = {username, password}
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {username, password, showErrMsg, errorMsg} = this.state
    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="form-bg-container">
        <div className="card-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
            alt="website login"
            className="login-image"
          />
          <form className="form-container" onSubmit={this.onSubmitForm}>
            <h1 className="heading">Welcome Back!</h1>
            <label className="label-text" htmlFor="userid">
              User ID
            </label>
            <input
              type="text"
              id="userid"
              className="input"
              onChange={this.onChangeUserId}
              placeholder="Enter User ID"
              value={username}
            />

            <label className="label-text" htmlFor="pin">
              PIN
            </label>
            <input
              type="password"
              id="pin"
              onChange={this.onChangePin}
              placeholder="Enter PIN"
              className="input"
              value={password}
            />
            <button type="submit" className="button">
              Login
            </button>
            {showErrMsg && <p className="error-msg">{errorMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}
export default LoginForm
