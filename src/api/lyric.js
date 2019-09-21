import axios from 'axios'
import {commonParam} from './config'


export function getLyric(mid) {
  const url= '/api/lyric'
  const data = Object.assign({}, commonParam, {
   songmid: mid,
   platform: 'yqq',
   hostUin: 0,
   needNewCode: 0,
   categoryId: 10000000,
   pcachetime: + new Date(),
   format: 'json'
 })
 
 return axios.get(url,{
   params: data
 }).then((res) => {
     return Promise.resolve(res.data)
 })
}
