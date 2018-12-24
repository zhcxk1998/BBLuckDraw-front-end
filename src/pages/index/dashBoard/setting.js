import Taro, {Component} from '@tarojs/taro'
import {
  AtSwitch,
  AtToast
} from 'taro-ui'
import {View} from '@tarojs/components'


export default class Manage extends Component {

  config = {
    navigationBarTitleText: '抽奖设置'
  }

  constructor(props) {
    super(props)
    this.state = {
      isOpened: true,
      value: 2,
      isLoading: true,
      switchDisabled: true
    }
  }

  componentDidMount() {
    if (this.$router.params.userName !== 'BB') {
      this.setState({switchDisabled: false})
    }
    Taro.showLoading({title: '数据加载中...'})
    Taro.request({
      url: 'https://www.algbb.fun/luckDraw/control',
      data: {
        status: ''
      }
    }).then(res => {
      this.setState({
        isOpened: res.data === 'open',
        isLoading: false
      }, () => {
        Taro.hideLoading()
      })
    })
  }

  handleClick() {
    this.setState({isOpened: !this.state.isOpened}, () => {
      Taro.request({
        url: 'https://www.algbb.fun/luckDraw/control',
        data: {
          status: this.state.isOpened ? 'open' : 'close'
        }
      })
        .then(res => {
        })
    })
  }

  handleChange(value) {
    this.setState({
      value
    })
  }

  render() {
    const {isOpened, isLoading, switchDisabled} = this.state;
    return !isLoading ? (
      <View className='main' style='padding:20px'>
        {!switchDisabled?
        <AtToast isOpened text={`抱歉 你没有权限`} icon='alert-circle'/>:<View/>}
        <AtSwitch title='抽奖开关' disabled={!switchDisabled} checked={isOpened} onChange={this.handleClick}/>
      </View>
    ) : <View/>
  }
}
