import Taro, {Component} from '@tarojs/taro'
import {AtMessage} from 'taro-ui'
import {View, Image, Button, Input} from '@tarojs/components'
import './login.css'

export default class Register extends Component {

  config = {
    navigationBarTitleText: '注册'
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
    Taro.request({
      url: 'https://www.algbb.fun/luckDraw/register',
      data: {
        username: userName,
        password: passWord
      }
    }).then(res => {
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
        case 'failure':
          Taro.atMessage({
            'message': '用户已存在',
            'type': 'warning'
          })
          break;
      }
    })

  }

  render() {
    const {passWord, userName} = this.state;
    return (
      <View className='main'>
        <AtMessage/>
        <Image style='width:600rpx;height:400rpx' src={require('../../assets/img/register.svg')}/>
        <View className='form'>
          <Input className='userName' placeholderClass='placeholder' placeholder='用户名' value={userName}
                 onChange={this.handleUserName}
          />
          <Input placeholder='密码' placeholderClass='placeholder' value={passWord}
                 onChange={this.handlePassword}
          />
          <Button className='button' onClick={this.submit}>Sign Up</Button>

        </View>
      </View>
    )
  }
}
