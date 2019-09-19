
export default class Song {
  constructor({id,mid,name,singer,album,duration,image,url}){
    this.id = id
    this.mid = mid 
    this.name = name
    this.singer = singer
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }
}

export function createSong(musicData, songVkey) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval, // 歌曲时长s
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://ws.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?vkey=${songVkey}&guid=6319873028&uin=0&fromtag=66`
  })
}

function filterSinger(singer) {
  let ret = [];
  if (!singer) {
    return "";
  }
  singer.forEach(s => {
    ret.push(s.name);
  });
  return ret.join("/");
}

export function isValidMusic(musicData) {
  return (
    musicData.songid &&
    musicData.albummid &&
    (!musicData.pay || musicData.pay.payplay === 0)
  );
}