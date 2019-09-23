import jsonp from '@/common/js/jsonp'
import { commonParam, options } from './config'
import axios from 'axios'

export function getHotKey() {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
  const data = Object.assign({}, commonParam, {
    platform: 'h5',
    needNewcode: 1
  })
  return jsonp(url, data, options)
}

export function getSearch(query, page, zhida, prepage) {
  const url = '/api/getSearch' 
  const data = Object.assign({}, commonParam, {
    w: query,
    p: page,
    catZhida: zhida ? 1 : 0,
    uin: 0,
    platform: 'h5',
    needNewCode: 1,
    zhidaqu: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    perpage: prepage,
    n: prepage,
    remoteplace: 'txt.mqq.all',
    format: 'json',
    _: +new Date()
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}