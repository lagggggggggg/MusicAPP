export function addClassName(el,className){
  if(hasClassName(el,className)){
    return 
  }
  let newClassName = el.className.split(' ')
  newClassName.push(className)
  el.className = newClassName.join(' ')

}

export function hasClassName(el,className){
  let reg = new RegExp('(^|\\s)'+className+'(\\s|$)')
  return reg.test(el.className)
}

export function getData(el,name,val){
  let prefix = 'data-'
  name = prefix+name
  if(val){
    return el.setAttribute(name,val)
  }else{
    return el.getAttribute(name)
  }
}