<template>
  <div>
    <div>
      <span v-show="state==-1">YOU ARE DISCONNECTED</span>
      <button v-show="state<0" :disabled="state==-2" @click="connect">{{state==-1?"RECONNECT":"CONNECTING..."}}</button>
      <button :disabled="state!=2" @click="startGame">{{state==3?"IN GAME":"START GAME"}}</button>
      <button v-show="state==3" @click="concede">CONCEDE</button>
      <!--button :disabled="state==-1" @click="disconnect">DISCONNECT</button-->
    </div>
    <div class="game">
      <div id="other" v-if="playerNum>1">
        <Player
        class="otherp"
        v-for="k in playerNum-self-1"
        :key="k+self"
        :pIndex="k+self"
        :player="players[k+self]"
        @move="move"
        />
        <Player
        class="otherp"
        v-for="k in self"
        :key="k-1"
        :pIndex="k-1"
        :player="players[k-1]"
        @move="move"
        />
      </div>
      <div id="me" v-if="playerNum>self">
        <Player
        class="mep"
        :pIndex="self"
        :player="players[self]"
        @move="move"
        @chooseone="chooseone"
        />
        <button class="endturn" :disabled="!canPlay" @click="endturn">END TURN</button>
      </div>
      <div class="hand">
        <Card
        class="handc"
        v-for="(v,k) in hand"
        :key="k"
        :index="k"
        :card="v"
        @move="move"
        @chooseone="chooseone"
        />
      </div>
      <Discover v-if="discoverVisible" :cards="discover" :mode="discoverMode" @discover="discovered"/>
    </div>
  </div>
</template>

<script>
import {mapGetters,mapMutations} from 'vuex'
import Player from '@/components/Player.vue'
import Card from '@/components/Card.vue'
import Discover from '@/components/Discover.vue'

export default {
  name: 'game',
  components: {
    Player,
    Card,
    Discover,
  },
  data() {
    return {
      discover: [],
      discoverMode: 1,
      discoverVisible: false,
      socket: null,
    }
  },
  computed: mapGetters([
    'canPlay',
    'self',
    'hand',
    'players',
    'playerNum',
    'selected',
    'choice',
    'downpos',
    'state',
  ]),
  methods: {
    ...mapMutations([
      'addBuff',
      'addHand',
      'addMinion',
      'armoradd',
      'changeHand',
      'choose',
      'clearTable',
      'coinadd',
      'damage',
      'deckadd',
      'downat',
      'draw',
      'handdec',
      'handinc',
      'heal',
      'maxcoinadd',
      'odraw',
      'refreshGreen',
      'removeBuff',
      'removeHand',
      'removeMinion',
      'sit',
      'select',
      'changeState',
    ]),
    ...mapMutations({
      setCanPlay: 'canPlay',
      setCoins: 'coins',
      setDecklen: 'decklen',
      setHero: 'hero',
      setWeapon: 'weapon',
      setSkill: 'skill',
      setProp: 'prop',
      setShield: 'shield',
      setCurrent: 'turn',
    }),
    joinRoom() {
      if(this.state!=0)return
      this.changeState(1)
      var ab=new ArrayBuffer(1)
      var dv=new DataView(ab)
      dv.setInt8(0,-1)
      this.socket.send(dv)
    },
    connect() {
      if(this.state!=-1)return
      this.changeState(-2)
      this.socket=new WebSocket('ws://'+location.host+'/websocket/')
      this.socket.binaryType='arraybuffer'
      this.socket.onopen=this.opened
      this.socket.onmessage=this.received
      this.socket.onclose=this.disconnected
    },
    startGame() {
      if(this.state!=2)return
      this.changeState(4)
      var ab=new ArrayBuffer(1)
      var dv=new DataView(ab)
      dv.setInt8(0,-3)
      this.socket.send(dv)
    },
    disconnect() {
      this.socket.close()
    },
    opened() {
      this.changeState(0)
      console.log('Socket connected:')
      console.log(this.socket)
      this.joinRoom()
    },
    received(e) {
      if(this.state<0)return
      var json=eval('('+e.data+')')
      console.log(json)
      if(json.join!=null)
      {
        if(this.state==3)return
        if(json.join)
        {
          this.changeState(2)
          console.log('Joined.')
        }
        else
        {
          this.disconnect()
          console.log('Cannot join the room.')
        }
      }
      else if(json.start!=null)
      {
        if(this.state==3)return
        if(json.start)
        {
          this.clearTable()
          this.changeState(3)
          console.log('Game started.')
        }
        else
        {
          this.changeState(2)
          console.log('Cannot start the game.')
        }
      }
      else if(json.stop!=null)
      {
        if(this.state!=3)return
        if(json.stop)
        {
          this.closeAll()
          this.changeState(2)
          console.log('Game stopped.')
        }
      }
      else if(json.message!=null)
      {
        if(this.state!=3)return
        this.handleMessage(json)
      }
    },
    disconnected() {
      if(this.state==3)this.closeAll()
      this.changeState(-1)
      console.log('Socket disconnected.')
    },
    handleMessage(json) {
      switch(json.message)
      {
      case 'ASKFORDISCOVER':
        this.discoverMode=2
        this.discover=json.data.choices
        this.discoverVisible=true
        break
      case 'ASKFORFIRST':
        this.discoverMode=3
        this.discover=this.hand
        this.discoverVisible=true
        break
      case 'BURN':
        json.data.num=-1
        this.deckadd(json.data)
        break
      case 'CANPLAY':
        this.refreshGreen(json.data)
        this.setCanPlay(true)
        break
      case 'CHANGEFIRST':
        this.changeHand(json.data)
        break
      case 'CHANGEHERO':
        this.setHero(json.data)
        break
      case 'CHANGEPP':
        this.setProp(json.data)
        break
      case 'CHANGESKILL':
        this.setSkill(json.data)
        break
      case 'CHECKCOINS':
        this.setCoins(json.data)
        break
      case 'CHECKDECK':
        this.setDecklen(json.data)
        break
      case 'CHECKHERO':
        this.setHero(json.data)
        break
      case 'CHECKSKILL':
        this.setSkill(json.data)
        break
      case 'DAMAGE':
        this.damage(json.data)
        break
      case 'DRAW':
        this.draw(json.data.card)
        break
      case 'EQUIP':
        this.setWeapon(json.data)
        break
      case 'FILLCOINS':
        this.coinadd(json.data)
        break
      case 'FIRSTHAND':
        this.draw(json.data.card)
        break
      case 'GAINARMOR':
        this.armoradd(json.data)
        break
      case 'GAINBUFF':
        this.addBuff(json.data)
        break
      case 'GAINCOINS':
        this.maxcoinadd(json.data)
        break
      case 'GET':
        this.addHand(json.data.card)
        break
      case 'HEAL':
        this.heal(json.data)
        break
      case 'LOSEBUFF':
        this.removeBuff(json.data)
        break
      case 'LOSECOINS':
        json.data.num=-json.data.num
        this.maxcoinadd(json.data)
        break
      case 'LOSESHIELD':
        this.setShield({hash:json.data.hash,shield:false})
        break
      case 'ODRAW':
        json.data.num=1
        this.odraw(json.data)
        break
      case 'OFIRSTHAND':
        this.odraw(json.data)
        break
      case 'OGET':
        this.handinc(json.data.who)
        break
      case 'REMOVEMINION':
        this.removeMinion(json.data)
        break
      case 'SEATS':
        this.sit(json.data)
        break
      case 'SHUFFLE':
        json.data.num=1
        this.deckadd(json.data)
        break
      case 'SPENDCOINS':
        json.data.num=-json.data.num
        this.coinadd(json.data)
        break
      case 'STOPPLAY':
        this.closeAll()
        break
      case 'SUMMON':
        this.addMinion(json.data)
        break
      case 'THROWDECK':
        json.data.num=-json.data.num
        this.deckadd(json.data)
        break
      case 'THROWHAND':
        if(json.data.who==this.self)this.removeHand(json.data.index)
        else this.handdec(json.data.who)
        break
      case 'THROWWEAPON':
        json.data.card=null
        this.setWeapon(json.data)
        break
      case 'TURN':
        this.setCurrent(json.data.who)
        break
      }
    },
    chooseone(e) {
      this.discoverMode=1
      var list=[]
      for(i=0;i<e.choices;i++)list.push({name:e.card.name+'$'+i,cost:0,atk:0,hp:0,canplay:false,type:'NONE'})
      this.discover=e
      this.discoverVisible=true
    },
    concede() {
      this.setCanPlay(false)
      if(this.state==3)
      {
        var dv=new DataView(new ArrayBuffer(1))
        dv.setInt8(0,3)
        this.socket.send(dv)
      }
    },
    move(e) {
      this.setCanPlay(false)
      if(this.state==3)
      {
        var ab,dv
        if(this.selected.pIndex<0)
        {
          if(this.selected.mIndex<0)
          {
            ab=new ArrayBuffer(4)
            dv=new DataView(ab)
            dv.setInt8(0,6)
            dv.setInt8(1,this.choice)
            dv.setInt8(2,e==null?-1:e.pIndex)
            dv.setInt8(3,e==null?-1:e.mIndex)
          }
          else
          {
            ab=new ArrayBuffer(6)
            dv=new DataView(ab)
            dv.setInt8(0,5)
            dv.setInt8(1,this.selected.mIndex)
            dv.setInt8(2,this.downpos<0?0:this.downpos)
            dv.setInt8(3,this.choice)
            dv.setInt8(4,e==null?-1:e.pIndex)
            dv.setInt8(5,e==null?-1:e.mIndex)
          }
        }
        else
        {
          ab=new ArrayBuffer(4)
          dv=new DataView(ab)
          dv.setInt8(0,1)
          dv.setInt8(1,this.selected.mIndex)
          dv.setInt8(2,e.pIndex)
          dv.setInt8(3,e.mIndex)
        }
        this.socket.send(dv)
      }
      this.select(null)
      this.choose(-1)
      this.downat(-1)
    },
    discovered(e) {
      this.discoverVisible=false
      if(this.state!=3)return
      switch(this.discoverMode)
      {
      case 1:
        if(e.data<0)
        {
          this.select(null)
          this.downat(-1)
        }
        else
        {
          this.choose(e.data)
          var h=this.selected.mIndex<0?this.players[this.self].skill:this.hand[this.selected.mIndex]
          if(h.greens[e.data].includes(null))this.move(null)
        }
        break
      case 2:
        var ab=new ArrayBuffer(1)
        var dv=new DataView(ab)
        dv.setInt8(0,e.data)
        this.socket.send(dv)
        break
      case 3:
        var ab=new ArrayBuffer(2)
        var dv=new DataView(ab)
        dv.setInt8(0,2)
        var i=0
        for(var n=0;n<e.length;n++)if(e.data[n])i|=(1<<n)
        dv.setInt8(1,i)
        this.socket.send(dv)
        break
      }
    },
    endturn() {
      this.closeAll()
      var ab=new ArrayBuffer(1)
      var dv=new DataView(ab)
      dv.setInt8(0,4)
      this.socket.send(dv)
    },
    closeAll() {
      this.discoverVisible=false
      this.setCanPlay(false)
      this.select(null)
      this.choose(-1)
      this.downat(-1)
    }
  },
  mounted() {
    this.connect()
  }
}
</script>

<style>
* {
  user-select: none;
}

.game {
  position: relative;
  min-width: 750px;
}

.otherp,
.mep {
  display: flex;
  border: 1px solid orange;
  border-bottom: none;
}

.otherp {
  flex-grow: 1;
  flex-direction: column;
}

.mep {
  flex-grow: 1;
  flex-direction: column-reverse;
}

.hand {
  height: 140px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: greenyellow;
  border: 3px solid green;
  border-top: none;
}

.handc + .handc {
  margin-left: 10px;
}

#other {
  display: flex;
  flex-direction: row-reverse;
  border: 3px solid red;
  border-bottom: none;
}

#me {
  display: flex;
  border: 3px solid green;
  border-top: none;
}
</style>
