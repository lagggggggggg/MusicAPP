import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15

function insertArr(arr,val,compare,maxLength){
  let index = arr.findIndex(compare)
  if (index === 0){
    return 
  }
  if(index>0){
    arr.splice(index,1)
  }
  arr.unshift(val)
  if(arr.length > maxLength){
    arr.pop()
  }
}

function deletFromArr(arr,val,compare){
  let index = arr.findIndex(compare)
  if (index > -1){
    arr.splice(index,1)
  }
}

export function saveSearch(query){
  let searches = storage.get(SEARCH_KEY,[])
  insertArr(searches,query,(item)=>{
    return item === query
  }, SEARCH_MAX_LENGTH)
  storage.set(SEARCH_KEY,searches)
  return searches
}

export function loadSearch(){
  return storage.get(SEARCH_KEY,[])
}

export function deletSearch(query){
  let searches = storage.get(SEARCH_KEY,[])
  deletFromArr(searches,query,(item)=>{
    return item === query
  })
  storage.set(SEARCH_KEY,searches)
  return searches
}

export function clearSearch(){
  storage.remove(SEARCH_KEY)
  return []
}
