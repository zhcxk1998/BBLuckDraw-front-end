import Taro, {Component} from '@tarojs/taro'
import {
  AtGrid, AtModal, AtModalHeader, AtModalContent, AtModalAction,
  AtSwipeAction,
  AtList, AtListItem,
} from 'taro-ui'
import {View, Button, ScrollView} from '@tarojs/components'


export default class Record extends Component {

  config = {
    navigationBarTitleText: '抽奖记录'
  }

  constructor(props) {
    super(props)
    this.state = {
      userInfo: [],
      isLoading: true,
      isOpened: false,
      isDisplayed: false
    }
  }

  componentDidMount() {
    Taro.showLoading({title: '数据加载中...'})
    Taro.request('https://www.algbb.fun/luckDraw/prize')
      .then(res => {
        this.setState({userInfo: res.data.filter(item => item.prize !== null)}, () => {
          this.setState({isLoading: false})
          Taro.hideLoading()
        })
      })
  }

  handleClick = (item, index) => {
    switch (index) {
      case 0:
        this.setState({
          isOpened: true
        })
        break;
      case 1:
        this.setState({
          isDisplayed: true
        })
        break;
    }
  }

  cancel = () => {
    this.setState({
      isOpened: false,
      isDisplayed: false
    })
  }

  render() {
    const {userInfo, isLoading, isOpened, isDisplayed} = this.state;
    return !isLoading ? (
      <View className='main'>
        <View className='list'>
          <AtModal isOpened={isOpened} onClose={this.cancel}>
            <AtModalContent>
              <AtList>
                <AtListItem title='一等奖' extraText={`${userInfo.filter(i => i.prize === '一等奖').length} 人`}/>
                <AtListItem title='二等奖' extraText={`${userInfo.filter(i => i.prize === '二等奖').length} 人`}/>
                <AtListItem title='三等奖' extraText={`${userInfo.filter(i => i.prize === '三等奖').length} 人`}/>
              </AtList>
            </AtModalContent>
            <AtModalAction>
              <Button onClick={this.cancel}>确定</Button>
            </AtModalAction>
          </AtModal>
          <AtModal isOpened={isDisplayed} onClose={this.cancel}>
            <AtModalHeader style='text-align:left'>一等奖名单</AtModalHeader>
            <AtModalContent>
              <AtList>
                <ScrollView
                  className='scrollview'
                  scrollY
                  scrollWithAnimation
                  scrollTop='0'
                  style='height: 250px;'
                  lowerThreshold='20'
                  upperThreshold='20'>
                  {userInfo.filter(user => user.prize === '一等奖').map(user =>
                    <AtListItem
                      title={user.username}
                      thumb={`http://cdn.algbb.fun/emoji/${Math.ceil(Math.random() * 23 + 10)}.png`}
                      arrow='right'
                    />)}
                </ScrollView>

              </AtList>
            </AtModalContent>
            <AtModalAction>
              <Button onClick={this.cancel}>确定</Button>
            </AtModalAction>
          </AtModal>
          <View className='grid'>
            <AtGrid onClick={this.handleClick} mode='rect' hasBorder={true} data={
              [
                {
                  image: require('../../../assets/img/icon/statistics.png'),
                  value: '统计信息'
                },
                {
                  image: require('../../../assets/img/icon/list.png'),
                  value: '大奖名单'
                },
                {
                  image: require('../../../assets/img/icon/unknown.png'),
                  value: '还没想好'
                }
              ]
            }/>
          </View>
          <AtList>

            {userInfo.map((user, index) => {
              return <AtSwipeAction key={index} options={[
                {
                  text: '设置',
                  style: {
                    backgroundColor: '#6190E8'
                  }
                },
                {
                  text: '删除',
                  style: {
                    backgroundColor: '#fa4b2a'
                  }
                }
              ]}>
                <AtListItem
                  title={user.username}
                  thumb={`http://cdn.algbb.fun/emoji/${Math.ceil(Math.random() * 23 + 10)}.png`}
                  extraText={user.prize}
                />
              </AtSwipeAction>
            })}
          </AtList>
        </View>
      </View>
    ) : <View/>
  }
}
