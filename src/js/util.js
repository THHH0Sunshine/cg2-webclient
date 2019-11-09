export function getSearchObj() {
  let rt = {}
  let ss = location.search.substr(1).split('&')
  for (let i = 0; i < ss.length; i++) {
    let ind = ss[i].indexOf('=')
    if (ind < 0)
      continue
    rt[ss[i].substring(0, ind)] = decodeURIComponent(ss[i].substr(ind + 1))
  }
  return rt
}