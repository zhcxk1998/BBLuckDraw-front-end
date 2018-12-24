import Taro, {Component} from '@tarojs/taro'
import {
  AtGrid,
  AtMessage,
  AtToast,
  AtCurtain,
  AtIcon,
  AtList, AtListItem,
  AtDivider,
  AtCalendar,
  AtSearchBar,
  AtTabs,
  AtTabsPane, AtButton, AtForm, AtInput, AtAvatar, AtNoticebar, AtTabBar, AtActivityIndicator
} from 'taro-ui'
import {View, Text, Image, Button, Input} from '@tarojs/components'
// import DashBoard from '../dashBoard/dashBoard'
import './main.css'


export default class Main extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

  constructor(props) {
    super(props)
    this.state = {
      current: 0,
      tabIndex: 0,
      userInfo: [],
      userName: ' ',
      prizeInfo: '',
      myInfo: {},
      isLoading: false,
      isOpened: true,
      isDisplayed: false,
      drawUser: [],
      drawOpened: true,
      drawTips: false,
      drawName: '',
      buttonName: '立即抽奖',
      isDrawed: false,
      myName: ''
    }
  }


  componentDidMount() {
    this.setState({myName: this.$router.params.username})
  }

  handleClick(value) {
    const navigation = ['首页', '抽奖', '个人中心']
    Taro.setNavigationBarTitle({title: navigation[value]})
    this.setState({
      current: value
    })
    if (value === 2 && this.state.current !== 2) {

    }
    else if (value === 1 && this.state.current !== 1) {
      Taro.showLoading({title: '数据加载中...'})
      Taro.request({
        url: 'https://www.algbb.fun/luckDraw/control',
        data: {
          status: ''
        }
      }).then(res => {
        this.setState({
          drawOpened: res.data === 'open' ? true : false
        })
      })
      Taro.request('https://www.algbb.fun/luckDraw/prize')
        .then(res => {
          let prizeInfo = '';
          res.data.filter(item => item.prize !== null).map(user => {
            prizeInfo += `恭喜 ${user.username} 获得了${user.prize}！ `
          })
          const name = this.$router.params.username;
          res.data.map(i => {
            if (i.username === name && i.prize != null)
              this.setState({isDrawed: true, buttonName: '感谢参与'})
          })
          this.setState({
            drawUser: res.data.filter(item => item.prize !== null),
            prizeInfo: prizeInfo
          }, () => {
            Taro.hideLoading()
          })
        })
    }
  }

  onChange(value) {
    this.setState({
      value: value
    })
  }

  tabClick(value) {
    this.setState({
      tabIndex: value
    })
  }

  onClose() {
    this.setState({
      isOpened: false
    })
  }

  handleChange() {
    this.setState({
      isDisplayed: true
    })
  }

  onHiden() {
    this.setState({
      isDisplayed: false
    })
  }

  start = () => {
    const prize = ['一等奖', '二等奖', '三等奖'];
    const prizeName = prize[Math.floor(Math.random() * prize.length)];
    if (!this.state.isDrawed) {
      if (prizeName === '一等奖') {
        this.setState({isDisplayed: true})
      }
      Taro.request({
        url: 'https://www.algbb.fun/luckDraw/luckDraw',
        data: {
          username: this.$router.params.username,
          prize: prizeName
        }
      }).then(result => {
        this.setState({drawTips: true, drawName: result.data.status, isDrawed: true, buttonName: '感谢参与'})
        Taro.request('https://www.algbb.fun/luckDraw/prize')
          .then(res => {
            let prizeInfo = '';
            res.data.filter(item => item.prize !== null).map(user => {
              prizeInfo += `恭喜 ${user.username} 获得了${user.prize}！ `
            })
            this.setState({
              drawUser: res.data.filter(item => item.prize !== null),
              prizeInfo: prizeInfo
            }, () => {
            })
          })
      })
    }
    else {
      Taro.atMessage({
        'message': '您已抽过奖了',
        'type': 'warning'
      })
    }
  }

  toRecord = () => {
    Taro.navigateTo({
      url: '/pages/index/dashBoard/record'
    })
  }

  drawClose = () => {
    this.setState({drawTips: false})
  }

  gridClick = (item, index) => {
    let userName = this.$router.params.username
    switch (index) {
      case 0:
        Taro.navigateTo({
          url: '/pages/index/dashBoard/record'
        });
        break;
      case 1:
        Taro.navigateTo({
          url: `/pages/index/dashBoard/manage?userName=${userName}`
        });
        break;
      case 2:
        Taro.navigateTo({
          url: `/pages/index/dashBoard/setting?userName=${userName}`
        });
        break;
    }
  }

  render() {
    const {value, current, userName, userInfo, prizeInfo, isLoading, isOpened, isDisplayed, isDrawed, myInfo, drawOpened, drawName, drawType, drawUser,myName} = this.state;
    return !isLoading ? (
      <View>
        <View className='main'>
          <View hidden={current !== 0} className='index'>
            <AtToast isOpened={isOpened} onClose={this.onClose.bind(this)}
                     text={`欢迎 ${this.$router.params.username} 进入小程序`}
                     image={require('../../../assets/img/welcome.gif')}/>
            <AtSearchBar
              value={value}
              onChange={this.onChange.bind(this)}
            />
            <View className='screen'>
              <View className='title'>
                This is someing interesting here
              </View>
              <View className='more'>
                Read More
              </View>
            </View>
            <Text className='info-title'>More Infomation</Text>
            <View className='container'>
              <View className='pre-img'>
                <Image
                  src='https://cdn.suisuijiang.com/ImageMessage/5b4ee8321b53ec11c8505de5_1545368738123.jpeg?width=4288&height=2848'
                  className='img'/>
              </View>
              <View className='pre-content'>
                <View className='pre-title'>
                  I am going to study everyday
                </View>
                <View className='pre-author'>
                  BB小天使
                </View>
                <View className='pre-time'>
                  <AtIcon value='clock' size='18'/>
                  &nbsp;&nbsp;2018/12/16
                </View>
              </View>
            </View>
            <View className='container'>
              <View className='pre-img'>
                <Image
                  src='https://cdn.suisuijiang.com/ImageMessage/5b4ee8321b53ec11c8505de5_1545368998905.jpeg?width=2500&height=1630'
                  className='img'/>
              </View>
              <View className='pre-content'>
                <View className='pre-title'>
                  What a nice weather today
                </View>
                <View className='pre-author'>
                  BB小天使
                </View>
                <View className='pre-time'>
                  <AtIcon value='clock' size='18'/>
                  &nbsp;&nbsp;2018/12/16
                </View>
              </View>
            </View>
            <View className='container'>
              <View className='pre-img'>
                <Image
                  src='https://cdn.suisuijiang.com/ImageMessage/5b4ee8321b53ec11c8505de5_1545369089275.jpeg?width=2500&height=1667'
                  className='img'/>
              </View>
              <View className='pre-content'>
                <View className='pre-title'>
                  Go outside and have fun
                </View>
                <View className='pre-author'>
                  BB小天使
                </View>
                <View className='pre-time'>
                  <AtIcon value='clock' size='18'/>
                  &nbsp;&nbsp;2018/12/16
                </View>
              </View>
            </View>
          </View>
          <View hidden={current !== 1}>
            <AtNoticebar marquee single icon='volume-plus'>
              {prizeInfo}
            </AtNoticebar>
            <AtMessage/>
            <View className='wrap'>
              <View className='header'>
                <Swiper
                  className='test-h'
                  indicatorColor='#999'
                  indicatorActiveColor='#333'
                  circular
                  indicatorDots
                  autoplay>
                  <SwiperItem>
                    <View>
                      <Image src='http://cdn.algbb.fun/ImageMessages/BB_1545102278657' className='prize'/>
                    </View>
                  </SwiperItem>
                  <SwiperItem>
                    <View>
                      <Image src='http://cdn.algbb.fun/ImageMessages/BB_1545102282622' className='prize'/>
                    </View>
                  </SwiperItem>
                  <SwiperItem>
                    <View>
                      <Image src='http://cdn.algbb.fun/ImageMessages/BB_1545102287236' className='prize'/>
                    </View>
                  </SwiperItem>
                  <SwiperItem>
                    <View>
                      <Image src='http://cdn.algbb.fun/ImageMessages/BB_1545102274247' className='prize'/>
                    </View>
                  </SwiperItem>
                  <SwiperItem>
                    <View>
                      <Image src='http://cdn.algbb.fun/ImageMessages/BB_1545102295283' className='prize'/>
                    </View>
                  </SwiperItem>
                  <SwiperItem>
                    <View>
                      <Image src='http://cdn.algbb.fun/ImageMessages/BB_1545208892117' className='prize'/>
                    </View>
                  </SwiperItem>
                </Swiper>
                <View className='introduce'>
                  <View className='introduce-title'>
                    奖品：各类老婆の超·逼真抱枕 × 1
                  </View>
                  开奖时间：立即开奖
                </View>
                <View className='sponsor'>
                  “ 本奖品由<strong>ALG协会</strong>冠名赞助 ”
                </View>
                <View className='detail'>
                  <View style='margin-bottom:2vh;font-size:large'>
                    奖品介绍：
                  </View>
                  本奖品采用最新、最优质的面料，经世界级大师精心打造而成，带给你无与伦比的享受。那柔顺的触感，让你感觉与真人似的互动。带你走进二次元，走进你的老婆们！
                  <View style='margin:4vh 0;font-size:large'>
                    赞助商介绍：
                  </View>
                  “ ALG协会 ”是一个致力于打造全亚洲最大的非主流团体，给学生们带来文艺复兴的体验。
                </View>
              </View>
              <AtCurtain
                isOpened={isDisplayed}
                onClose={this.onHiden.bind(this)}
              >
                <Image
                  style='width:80vw;height:50vh'
                  src={require('../../../assets/img/congratulation.gif')}
                />
              </AtCurtain>
              <AtToast
                isOpened={drawTips}
                icon={'check'}
                text={`恭喜你获得${drawName}`}
                onClose={this.drawClose}/>
              <View className='draw'>{
                drawOpened ?
                  <View className={isDrawed ? 'finish' : 'start'} onClick={this.start}>
                    {buttonName}
                  </View> : <Text className='end'>抽奖已截止</Text>
              }
                <View>
                  <Text className='player'>
                    已有 {drawUser.length} 人参与，
                  </Text>
                  <Text style='color: #5CACEE;font-weight:bold;font-size:large' onClick={this.toRecord}>查看全部></Text>
                </View>
                <View className='avater'>
                  {drawUser.filter((item, index) => index < 8).map(item =>
                    <View className='avater-item'>
                      <Image src={`http://cdn.algbb.fun/emoji/${Math.ceil(Math.random() * 23 + 10)}.png`}
                             className='item'/>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>
          <View hidden={current !== 2}>
            <View className='dashBoard'>
              <View className='infomation'>
                <Image src='http://cdn.algbb.fun/emoji/32.png' className='avater'/>
                <Text className='userName'>{myName}</Text>
                <Text className='info'>我是一名好学生，我的爱好是打游戏，不爱学习</Text>
              </View>
              <View className='grid'>
                <AtGrid onClick={this.gridClick} mode='rect' hasBorder={true} data={
                  [
                    {
                      image: require('../../../assets/img/icon/record.png'),
                      value: '抽奖记录'
                    },
                    {
                      image: require('../../../assets/img/icon/manage.png'),
                      value: '管理奖品'
                    },
                    {
                      image: require('../../../assets/img/icon/setting.png'),
                      value: '抽奖设置'
                    }
                  ]
                }/>
              </View>
              <View className='list'>
                <AtList>
                  <AtListItem
                    title='我的钱包'
                    thumb={require('../../../assets/img/icon/wallet.png')}
                  />
                  <AtListItem
                    title='个人设置'
                    thumb={require('../../../assets/img/icon/user.png')}
                  />
                  <AtListItem
                    title='我的奖品'
                    extraText='点了也没用'
                    thumb={require('../../../assets/img/icon/prize.png')}
                  />
                  <AtListItem
                    title='关于我们'
                    thumb={require('../../../assets/img/icon/about.png')}
                  />
                </AtList>
              </View>
              <Button className='quit'>退出登录</Button>
            </View>
          </View>
        </View>
        <AtTabBar
          fixed
          className='tabbar'
          tabList={[
            {title: '首页', iconType: 'bullet-list'},
            {title: '抽奖', iconType: 'camera'},
            {title: '个人中心', iconType: 'folder'}
          ]}
          onClick={this.handleClick.bind(this)}
          current={current}
        />
      </View>
    ) : <View/>
  }
}
