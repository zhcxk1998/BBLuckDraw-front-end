import Taro, {Component} from '@tarojs/taro'
import {AtMessage} from 'taro-ui'
import {View, Text, Image, Button, Input} from '@tarojs/components'
import './login.css'

export default class Login extends Component {

  config = {
    navigationBarTitleText: '登录'
  }

  constructor(props) {
    super(props)
    this.state = {
      userName: '',
      passWord: ''
    }
  }

  componentDidMount() {
    // Taro.showLoading({title:'请稍等...'})
  }

  handleUserName = (value) => {
    this.setState({
      userName: value.target.value
    })
  }

  handlePassword = (value) => {
    this.setState({
      passWord: value.target.value
    })
  }

  submit = () => {
    const {userName, passWord} = this.state;
    if (userName === '' || passWord === '') {
      Taro.atMessage({
        'message': '请输入完整信息',
        'type': 'error'
      })
      return
    }
    Taro.showLoading({title:'请稍候...'})
    Taro.request({
      url: 'https://www.algbb.fun/luckDraw/login',
      data: {
        username: userName,
        password: passWord
      }
    }).then(res => {
      Taro.hideLoading()
      switch (res.data.status) {
        case 'success':
          Taro.atMessage({
            'message': '登录成功',
            'type': 'success'
          })
          Taro.navigateTo({
            url: `/pages/index/main/main?username=${userName}`
          })
          this.setState({
            userName: '',
            passWord: ''
          })
          break;
        case 'notexist':
          Taro.atMessage({
            'message': '用户不存在',
            'type': 'warning'
          })
          break;
        case 'failure':
          Taro.atMessage({
            'message': '密码错误',
            'type': 'error'
          })
          break;
      }
    })

  }

  register = () => {
    Taro.navigateTo({
      url: '/pages/index/register'
    })
  }

  render() {
    const {passWord, userName} = this.state;
    return (
      <View className='main'>
        <AtMessage/>
        <Image style='width:600rpx;height:400rpx' src={require('../../assets/img/login.svg')}/>
        <View className='form'>
          <Input className='userName' placeholderClass='placeholder' placeholder='用户名' value={userName}
                 onChange={this.handleUserName}
          />
          <Input placeholder='密码' placeholderClass='placeholder' value={passWord}
                 onChange={this.handlePassword}
          />
          <Button className='button' onClick={this.submit}>Sign In</Button>

        </View>
        <Text className='register' onClick={this.register}>还没有账号？</Text>
      </View>
    )
  }
}
