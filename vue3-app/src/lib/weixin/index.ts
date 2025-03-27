/*
 * @Name: 微信SDK的二次封装
 * @Description: 微信SDK的二次封装
 */

import weChat from 'weixin-js-sdk'
import api from '@/api'
import { jsApiList, openTagList } from './wxCfg'
import { getPathInfo, getPathQuery, createPathInfo } from '@/utils/navigate'
import { isWxH5, isMiniprogram } from '@/utils/platform'

const wxReady = ():Promise<boolean> => new Promise(resolve => {
  weChat.ready(() => {
    resolve(true)
  })
})

const emptyFun = (err:any) => err

// 分享格式
export interface ShareOpts {
  title?: string
  desc?: string
  link?: string
  imgUrl?: string
  addQuery?: {
    [key:string]:string|number
  }
  removeQueryList?: string[]
  trackExtInfo?: {
    [key:string]:string|number
  }
  success?: Function
  fail?: Function
}

interface ShareListInfo {
  funName: 'onMenuShareAppMessage' | 'onMenuShareQQ' | 'onMenuShareQZone' | 'onMenuShareTimeline'
  type: string
}

class WeiXin {
  // 是否准备好了
  private isReady: boolean
  private isInitEnd: boolean
  private initHandle: Promise<boolean>
  menuList: wx.MenuItem[]
  miniProgram: any
  weChat: any
  closeWindow: any


  constructor() {

    this.isReady = false
    this.isInitEnd = false
    this.miniProgram = null
    this.weChat = null
    this.menuList = [
      'menuItem:share:appMessage',
      'menuItem:share:timeline',
      'menuItem:share:qq',
      'menuItem:share:weiboApp',
      'menuItem:favorite',
      'menuItem:share:facebook',
      'menuItem:share:QZone',
      'menuItem:copyUrl',
      'menuItem:openWithSafari',
      'menuItem:openWithQQBrowser',
      'menuItem:originPage',
      'menuItem:share:email'
    ]
    this.initHandle = this.init()
  }

  // 初始化
  private async init():Promise<boolean> {
    this.miniProgram = weChat.miniProgram
    this.weChat = weChat
    if (!isWxH5() && !isMiniprogram()) {
      this.isInitEnd = true
      return false
    }

    try {
      const { data } = await api.wxSignature({
        url: window.location.href
      })

      weChat.config({
        appId: data.appid,
        nonceStr: data.noncestr,
        signature: data.signature,
        timestamp: data.timestamp,
        debug: false,
        jsApiList,
        openTagList
      })

      const isReady = await wxReady()

      if (isReady) {
        this.notifySdkIsReady()
      }

      this.isReady = isReady

      return true
    } catch (error) {
      return false
    } finally {
      this.isInitEnd = true
      this.miniProgram = weChat.miniProgram
      this.weChat = weChat
    }
  }

  // 构建分享内容
  private createShareInfo(opts:ShareOpts, type: string) {
    const { title, desc, link, imgUrl, addQuery = {}, removeQueryList = [], success, fail } = opts
    const routerQuery = getPathQuery()
    const subchannelMap: {[key: string]: string} = {
      'shareTimeline': 'wx_share_PYQ',
      'sendAppMessage': 'wx_share_HY',
      'shareQQ': 'wx_share_QQ',
      'shareQZone': 'wx_share_QZone'
    }
    // 改造分享设置的参数
    const ruleOpts = {
      channel: routerQuery.chanel || '',
      subchannel: routerQuery.subchannel || '',
      utm_source: routerQuery.channel || '',
      utm_campaign: `${addQuery.subchannel || subchannelMap[type]}_${routerQuery.channel || null}`,
      channel_prev: routerQuery.channel || '',
      subchannel_prev: routerQuery.subchannel || ''
    }
    const defaultPath = getPathInfo().fullPath
    let path = createPathInfo(defaultPath, { ...ruleOpts, ...addQuery }, removeQueryList).fullPath

    if (link) {
      path = createPathInfo(link, { ...ruleOpts, ...addQuery }, removeQueryList).fullPath
    }
    const shareOpts:wx.UpdateAppMessageShareDataOptions = {
      title: title,
      desc: desc || '我是描述',
      link: path,
      imgUrl: imgUrl || 'https://gw.alicdn.com/bao/uploaded/i1/2207806982565/O1CN01zhc0gf1UoovIgIneq_!!2207806982565.jpg',
      success(res: any) {
        success && success(res)
      },
      fail(error: any) {
        fail && fail(error)
      }
    }

    return shareOpts
  }

  // 通知已经ready
  private notifySdkIsReady() {
    const handleFontSize = () => {
      // 设置网页字体为默认大小
      window.WeixinJSBridge.invoke('setFontSizeCallback', {
        'fontSize': 0
      })
      // 重写设置网页字体大小的事件
      window.WeixinJSBridge.on('menu:setfont', function() {
        window.WeixinJSBridge.invoke('setFontSizeCallback', {
          'fontSize': 0
        })
      })
    }

    if (typeof window.WeixinJSBridge === 'object' && typeof window.WeixinJSBridge.invoke === 'function') {
      handleFontSize()
    } else if (document.addEventListener) {
      document.addEventListener('WeixinJSBridgeReady', handleFontSize, false)
    }
  }

  // 设置分享样式
  share(opts:ShareOpts) {
    const mapList:ShareListInfo[] = [
      { funName: 'onMenuShareAppMessage', type: 'sendAppMessage' },
      { funName: 'onMenuShareQQ', type: 'shareQQ' },
      { funName: 'onMenuShareQZone', type: 'shareQZone' },
      { funName: 'onMenuShareTimeline', type: 'shareTimeline' }
    ]

    mapList.forEach(item => {
      weChat[item.funName](this.createShareInfo(opts, item.type))
    })
  }

  // 隐藏分享，以及链接外露
  showShare() {
    try {
      weChat.showMenuItems({
        menuList: this.menuList
      })
    } catch (err) {
      emptyFun(err)
    }
  }

  // 隐藏分享，以及链接外露
  hideShare() {

    try {
      weChat.hideMenuItems({
        menuList: this.menuList
      })
    } catch (err) {
      emptyFun(err)
    }
  }
}

const weixin = new WeiXin()

export default weixin
