import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    canPlay: false,
    self: 0,
    turn: 0,
    hand: [],
    table: [],
    chars: {},
    selected: null,
    choice: -1,
    downpos: -1,
    state: -1,//-2:connecting,-1:offline,0:hall,1:joining,2:room,3:started,4:starting
  },
  getters: {
    canPlay: s => s.canPlay,
    self: s => s.self,
    turn: s => s.turn,
    hand: s => s.hand,
    players: s => s.table,
    playerNum: s => s.table.length,
    selected: s => s.selected,
    choice: s => s.choice,
    downpos: s => s.downpos,
    state: s => s.state,
  },
  mutations: {
    addBuff: (s,p) => s.chars[p.hash].buff.push(p.buff),
    addHand(s,card) {
      s.hand.push(card)
      s.table[s.self].handlen++
    },
    addMinion(s,p) {
      Vue.set(s.chars,p.card.hash,p.card)
      s.table[p.pIndex].minions.splice(p.mIndex,0,p.card)
    },
    armoradd: (s,p) => s.table[p.who].hero.armor+=p.num,
    canPlay: (s,f) => s.canPlay=f,
    changeHand: (s,p) => Vue.set(s.hand,p.index,p.card),
    choose: (s,choice) => s.choice=choice,
    clearTable(s) {
      s.hand=[]
      s.chars={}
      s.table=[]
    },
    coinadd: (s,p) => s.table[p.who].coins+=p.num,
    coins: (s,p) => s.table[p.who].coins=p.num,
    damage(s,p) {
      var ch=s.chars[p.tohash]
      if(p.num<=ch.armor)ch.armor-=p.num
      else
      {
        ch.hp-=(p.num-ch.armor)
        ch.armor=0
      }
    },
    deckdec: (s,who) => s.table[who].decklen--,
    deckinc: (s,who) => s.table[who].decklen++,
    decklen: (s,p) => s.table[p.who].decklen=p.num,
    downat: (s,index) => s.downpos=index,
    draw(s,card) {
      s.hand.push(card)
      s.table[s.self].handlen++
      s.table[s.self].decklen--
    },
    handdec: (s,who) => s.table[who].handlen--,
    handinc: (s,who) => s.table[who].handlen++,
    heal: (s,p) => s.chars[p.tohash].hp+=p.num,
    hero(s,p) {
      Vue.set(s.chars,p.card.hash,p.card)
      s.table[p.who].hero=p.card
    },
    maxcoinadd(s,p) {
      var pl=s.table[p.who]
      pl.maxcoins+=p.num
      if(pl.coins>pl.maxcoins)pl.coins=pl.maxcoins
    },
    odraw(s,p) {
      s.table[p.who].handlen+=p.num
      s.table[p.who].decklen-=p.num
    },
    prop(s,p) {
      var ch=s.chars[p.hash]
      ch.atk=p.atk
      ch.maxhp=p.maxhp
      ch.hp=p.hp
    },
    refreshGreen(s,cans) {
      for(var i in cans.minioncan)
      {
        var minionc=cans.minioncan[i]
        var ch=minionc.index<0?s.table[s.self].hero:s.table[s.self].minions[minionc.index]
        Vue.set(ch,'green',minionc.green)
      }
      for(var i in cans.handcan)Vue.set(s.hand[i],'greens',cans.handcan[i])
    },
    removeBuff: (s,p) => s.chars[p.hash].buff.splice(p.index,1),
    removeHand(s,index) {
      s.hand.splice(index,1)
      s.table[s.self].handlen--
    },
    removeMinion(s,p) {
      var ms=s.table[p.pIndex].minions
      Vue.delete(s.chars,ms[p.mIndex].hash)
      ms.splice(p.mIndex,1)
    },
    shield: (s,p) => s.chars[p.hash].shield=p.shield,
    sit(s,p) {
      s.self=p.self
      for(var i=0;i<p.num;i++)s.table.push({
        maxcoins:0,
        coins:0,
        decklen:0,
        handlen:0,
        hero:null,
        minions:[]
      })
    },
    turn: (s,who) => s.turn=who,
    select: (s,pos) => s.selected=pos,
    changeState: (s,st) => s.state=st,
  }
})
