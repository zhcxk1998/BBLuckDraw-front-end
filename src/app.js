import Taro, {Component} from '@tarojs/taro'
import Login from './pages/index/login'
import Register from './pages/index/register'
import './app.css'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {

  config = {
    pages: [
      'pages/index/login',
      'pages/index/register',
      'pages/index/main/main',
      'pages/index/dashBoard/record',
      'pages/index/dashBoard/manage',
      'pages/index/dashBoard/setting'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    }
  }

  componentDidMount() {
  }

  componentDidShow() {
  }

  componentDidHide() {
  }

  componentDidCatchError() {
  }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Login/>
    )
  }
}

Taro.render(<App/>, document.getElementById('app'))
