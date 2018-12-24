import Taro, {Component} from '@tarojs/taro'
import {
  AtModal, AtModalContent, AtModalAction,
  AtAccordion,
  AtSwipeAction,
  AtList, AtListItem,
  AtMessage,
  AtInput,
} from 'taro-ui'
import {View, Button,} from '@tarojs/components'

export default class Manage extends Component {

  config = {
    navigationBarTitleText: '奖品管理',
  }

  constructor(props) {
    super(props)
    this.state = {
      prizeInfo: [],
      isLoading: true,
      isOpened: false,
      isDisplayed: false,
      prizeName: '',
      prizeType: '',
      oldName: '',
      newName: '',
      oldType: '',
      userName: ''
    }
  }

  componentDidMount() {
    this.setState({userName: this.$router.params.userName})
    Taro.showLoading({title: '数据加载中...'})
    Taro.request({
      url: 'https://www.algbb.fun/luckDraw/setPrize',
      data: {
        oldName: ''
      }
    }).then(res => {
      let data = res.data.split('#')
      this.setState({
        prizeInfo: data.map(i => JSON.parse(i))
      }, () => {
        this.setState({isLoading: false})
        Taro.hideLoading()
      })
    })
  }

  handleClick(item, name, index) {
    const {userName} = this.state;
    if (userName !== 'BB') {
      Taro.atMessage({
        'message': '你没有权限！',
        'type': 'error'
      })
      return
    }
    switch (index) {
      case 0:
        // 修改
        this.setState({
          oldName: item.prize,
          oldType: item.type
        })
        this.change()
        break;
      case 1:
        // 删除
        Taro.request({
          url: 'https://www.algbb.fun/luckDraw/setPrize',
          data: {
            oldName: item.prize,
            newName: 'null',
            type: item.type
          }
        }).then(res => {
          let prizeInfo = this.state.prizeInfo[item.type - 1];
          prizeInfo = prizeInfo.filter(i => i.prize !== item.prize)
          let prize = this.state.prizeInfo;
          prize[item.type - 1] = prizeInfo;
          this.setState({
            prizeInfo: prize
          })
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

  confirm = () => {
    const {prizeName, prizeType, oldName} = this.state;
    if (prizeName !== '' || prizeType !== '' || (prizeType <= 3 && prizeType >= 1))
      Taro.request({
        url: 'https://www.algbb.fun/luckDraw/setPrize',
        data: {
          oldName: oldName,
          newName: prizeName,
          type: prizeType
        }
      }).then(res => {
        let prize = this.state.prizeInfo;
        prize[prizeType - 1].push({'prize': prizeName, 'type': prizeType});
        this.setState({
          isOpened: false,
          prizeInfo: prize,
          prizeName: '',
          prizeType: ''
        }, () => {
          Taro.redirectTo({url: '/pages/index/dashBoard/manage'})
          // Taro.navigateTo({
          //   url: '/pages/index/dashBoard/manage'
          // })
        })
      })
    else {
      Taro.atMessage({
        'message': '操作有误',
        'type': 'error',
      })
    }
  }

  add = () => {
    const {userName} = this.state;
    if (userName !== 'BB') {
      Taro.atMessage({
        'message': '你没有权限！',
        'type': 'error'
      })
      return
    }
    this.setState({isOpened: true})
  }

  change = () => {
    this.setState({
      isDisplayed: true
    })
  }

  nameChange(prizeName) {
    this.setState({
      prizeName: prizeName
    })
  }

  typeChange = (prizeType) => {
    this.setState({
      prizeType: prizeType
    })
  }

  newChange = (newName) => {
    this.setState({
      newName: newName
    })
  }

  oldChange = () => {
    const {oldName, newName, oldType} = this.state;
    Taro.request({
      url: 'https://www.algbb.fun/luckDraw/setPrize',
      data: {
        oldName: oldName,
        newName: newName,
        type: oldType
      }
    }).then(res => {
      const {oldName, newName, oldType, prizeInfo} = this.state;
      let prize = prizeInfo;
      prize[oldType - 1].map(i => {
        if (i.prize === oldName)
          i.prize = newName
      })

      this.setState({
        newName: '',
        prizeInfo: prize,
        isDisplayed: false
      })
    })
  }

  render() {
    const {prizeInfo, isLoading, isOpened, prizeName, prizeType, isDisplayed} = this.state;
    const type = ['一等奖', '二等奖', '三等奖'];
    const color = ['#fa4b2a', '#22E1FF', '#7918F2'];
    return !isLoading ? (
      <View className='main'>
        <AtMessage/>
        <AtModal isOpened={isOpened}>
          <AtModalContent>
            <AtInput
              title='奖品名'
              type='text'
              value={prizeName}
              onChange={this.nameChange.bind(this)}
            />
            <AtInput
              title='奖品类别'
              type='text'
              value={prizeType}
              onChange={this.typeChange}
            />
          </AtModalContent>
          <AtModalAction> <Button onClick={this.cancel}>取消</Button> <Button onClick={this.confirm}>确定</Button>
          </AtModalAction>
        </AtModal>
        <AtModal isOpened={isDisplayed}>
          <AtModalContent>
            <AtInput
              title='奖品名'
              type='text'
              value={this.state.newName}
              onChange={this.newChange}
            />
          </AtModalContent>
          <AtModalAction> <Button onClick={this.cancel}>取消</Button> <Button onClick={this.oldChange}>确定</Button>
          </AtModalAction>
        </AtModal>
        <AtMessage/>
        {prizeInfo.map((prizeType, index) => {
          return <AtAccordion
            key={{index}}
            icon={{value: 'shopping-bag', color: color[index], size: '25'}}
            title={type[index]}
          >
            <AtList hasBorder={false}>
              {prizeType.map((prize, index) => {
                return <AtSwipeAction autoClose onClick={this.handleClick.bind(this, prize)} key={index}
                                      options={[
                                        {
                                          text: '修改',
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
                    key={index}
                    title={prize.prize}
                    thumb={require('../../../assets/img/icon/dot.png')}
                  />
                </AtSwipeAction>
              })}

            </AtList>
          </AtAccordion>
        })}
        <AtListItem
          onClick={this.add}
          title='添加奖项'
          thumb={require('../../../assets/img/icon/add.png')}
        />
      </View>
    ) : <View/>
  }
}
