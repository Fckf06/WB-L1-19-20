'use strict'

const TOKEN = '3640a1a33640a1a33640a1a36f3555c309336403640a1a352a3ed0a5bca16a4e37a3d60'
let offset = localStorage.getItem('offset') || 0
let store = localStorage.getItem('store') || ''
let toggle = true
const list =  document.querySelector('.list-wrapper')

function createPost(e, group) {
  return `
  <article>
    <div class="title">
      <div class="icon"><img src="${group.photo_50}"/></div>
      <div class="name">
        <span>${group.name}</span>
        <span>${new Date(e.date * 1000).toLocaleDateString()}</span>
      </div>
    </div>
    <div class="text">${e.text}</div>
    <div class="media"> 
    ${e.attachments.length ? e.attachments.map(p => {
      if (p.type === 'photo') return `<div><img src="${p.photo.sizes[2].url}"></div>`
      if (p.type === 'video') return `<div><img src="${p.video.image[2].url}"></div>`
    }).join('') : ''}
    </div>
    <div class="info">
      <div class="info-wrapper">
        <div class="like">
          <span class="material-symbols-outlined">favorite</span>
          <span>${e.likes.count}</span>
        </div>
        <div class="comment">
          <span class="material-symbols-outlined">chat_bubble</span>
        </div>
        <div class="reply">
          <span class="material-symbols-outlined">reply</span>
          <span>${e.reposts.count}</span>
        </div>
      </div>
      <div class="view">
        <span class="material-symbols-outlined">visibility</span>
        <span>${e.views.count}</span>
      </div
    </div>
  </article>`
}
function createJSONP() {
  const script = document.createElement('SCRIPT');
  script.src = `http://api.vk.com/method/wall.get?owner_id=-106849164&count=20&offset=${offset}&&extended=1&&access_token=${TOKEN}&v=5.131&callback=callbackFunc`;
  document.getElementsByTagName("head")[0].append(script);
  script.remove()
}
function callbackFunc(result) {
  const {items, groups} = result.response
  try {
    if (localStorage.getItem('store') && toggle) {
      JSON.parse(localStorage.getItem('store')).map(e => {
        list.insertAdjacentHTML('beforeend', createPost(e, groups[0]))
      })
    } else if(!localStorage.getItem('store')) {
      localStorage.setItem('store', JSON.stringify(items))
      JSON.parse(localStorage.getItem('store')).map(e => {
        list.insertAdjacentHTML('beforeend', createPost(e, groups[0]))
      })
    } else {
      localStorage.setItem('store', JSON.stringify([].concat(JSON.parse(localStorage.getItem('store')), items)))
      localStorage.setItem('offset', offset = Number(offset) + 20)
      items.map(e => {
        list.insertAdjacentHTML('beforeend', createPost(e, groups[0]))
      })
    }
  } catch(e) {
    console.log('Overload');
    let cut = JSON.parse(localStorage.getItem('store'))
    cut.splice(0,40)
    localStorage.setItem('store', JSON.stringify([].concat(cut, items)))
    localStorage.setItem('offset', offset = Number(offset) + 20)
    JSON.parse(localStorage.getItem('store')).map(e => {
      list.insertAdjacentHTML('beforeend', createPost(e, groups[0]))
    })
    list.scroll(0, list.scrollHeight - list.clientHeight - 5000)
  }
  calcLocal()
}
function calcLocal() {
  let n = ''
  let free = ''
  let value = ''
  for (let i = 0; i < 1024 * 100; i++) n+=1
    try {
      for (let j = 0; j < 10500; j+=100) {
        free += n
        localStorage.setItem('local storage', free)
        console.log('calculating...');
      } 
    }  catch (e) {
      for (let k in localStorage) {
        if (typeof localStorage[k] === 'string') value += localStorage[k]
      }
      localStorage.removeItem('local storage')
      console.log('local storage', `Total: ${(value.length/1024000).toFixed(0)}/${(value.length/1024000 - (free.length - 100)/1024000).toFixed(1)} MB`)
    }
}
createJSONP()

list.addEventListener('scroll', () => {
  let scrolled = list.scrollTop / (list.scrollHeight - list.clientHeight) * 100
  if (scrolled >= 99.999) {
    toggle = false
    createJSONP()
  }
})
