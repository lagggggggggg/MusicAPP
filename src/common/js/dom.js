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


let elementStyle = document.createElement('div').style
let  vendor = (() => {
    let transformNames = {
       'webkit' : 'webkitTransform',
       'moz' : 'mozTransform',
       'ms' : 'msTransform',
       'o' : 'oTransform',
       'standard' : 'transform'
    }
    for (let key in transformNames) {
        if(elementStyle[transformNames[key]] !== undefined) {
            return key
        }
        
     }
     return false
})()


export  function prefixStyle(style) {
    if(vendor === false) {
        return false
    }
    if(vendor === 'standard') {
        return style
    }

    return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}