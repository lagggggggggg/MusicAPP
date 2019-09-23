import * as types from './mutation-types'
import {playMode} from '../common/js/config'
import {shuffle} from '../common/js/shuffle'

const findIndex = function (arr,song) {
  return arr.findIndex((item)=>{
    return item.id === song.id
  })
}
 
export const selectPlay = function({ commit, state }, { list, index }) {
  commit(types.SET_SEQUENCE_LIST, list)
  if(state.mode === playMode.random){
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST,randomList)
    index = findIndex(randomList,list[index])
  }else{
    commit(types.SET_PLAYLIST,list)
  }
  commit(types.SET_CURRENT_INDEX, index);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
};

export const randomPlay = function ({ commit } ,{ list }) {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  let randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
}

export const insertSong = function ({commit , state}, song){
  let playlist = state.playlist.slice()
  let currentIndex = state.currentIndex
  let sequenceList = state.sequenceList.slice()
  let currentSong = state.playlist[currentIndex]
  let fpIndex = findIndex(playlist,song)
  currentIndex++
  playlist.splice(currentIndex,0,song)
  if(fpIndex>-1){
    if(currentIndex > fpIndex ){
      playlist.splice(fpIndex,1)
      currentIndex--
    }else{
      playlist.splice(fpIndex+1,1)
    }
  }
  let currentsIndex = sequenceList[currentSong]
  let fspIndex = findIndex(sequenceList,song)+1
  sequenceList.splice(currentsIndex,0,song)
  if(fspIndex>-1){
    if(currentsIndex > fspIndex){
      sequenceList.splice(fspIndex,1)
    }else{
      sequenceList.splice(fspIndex+1,1)
    }
  }

  commit(types.SET_PLAYLIST,playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
}