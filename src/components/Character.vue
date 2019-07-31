<template>
  <div class="card" :class="{'ch-green':green,'ch-red':red,'ch-selected':thisSelected}" @click="clickme">
    <div class="id">{{id}}</div>
    <div class="atk">{{atk}}</div>
    <div class="hp">{{hp}}/{{maxhp}}</div>
  </div>
</template>

<script>
import {mapGetters,mapMutations} from 'vuex'

export default {
  name: 'character',
  props: {
    pIndex: Number,
    mIndex: Number,
    card: Object,
  },
  computed: {
    ...mapGetters(['canPlay','self','hand','players','selected','choice','downpos']),
    id() {
      return this.card==null?'':this.card.name
    },
    atk() {
      return this.card==null?'':this.card.atk
    },
    hp() {
      return this.card==null?'':this.card.hp
    },
    maxhp() {
      return this.card==null?'':this.card.maxhp
    },
    green() {
      return this.card!=null&&this.canPlay&&this.card.green!=null&&this.card.green.length>0
    },
    red() {
      if(this.selected==null)return false
      if(this.selected.pIndex<0)
      {
        var h=this.selected.mIndex<0?this.players[this.self].skill:this.hand[this.selected.mIndex]
        if(this.choice<0||h.type=='MINION'&&this.downpos<0||h.greens==null)return false
        var gr=h.greens[this.choice]
        for(var p in gr)if(gr[p]!=null&&gr[p].pIndex==this.pIndex&&gr[p].mIndex==this.mIndex)return true
        return false
      }
      var pl=this.players[this.selected.pIndex]
      if(this.selected.mIndex<0)
      {
        var hgr=pl.hero.green
        for(var p in hgr)if(hgr[p].pIndex==this.pIndex&&hgr[p].mIndex==this.mIndex)return true
        return false
      }
      var mgr=pl.minions[this.selected.mIndex].green
      for(var p in mgr)if(mgr[p].pIndex==this.pIndex&&mgr[p].mIndex==this.mIndex)return true
      return false
    },
    thisSelected() {
      return this.selected!=null&&this.pIndex==this.selected.pIndex&&this.mIndex==this.selected.mIndex
    },
  },
  methods: {
    ...mapMutations(['choose','downat','select']),
    clickme() {
      if(this.selected==null)
      {
        if(this.self==this.pIndex&&this.green)this.select({pIndex:this.pIndex,mIndex:this.mIndex})
      }
      else
      {
        if(this.downpos<0&&this.selected.pIndex<0&&this.selected.mIndex>=0&&this.hand[this.selected.mIndex].type=='MINION')
        {
          if(this.self!=this.pIndex)
          {
            this.select(null)
            this.choose(-1)
            this.downat(-1)
          }
          else
          {
            this.downat(this.mIndex<0?this.players[this.pIndex].minions.length:this.mIndex)
            var hc=this.hand[this.selected.mIndex]
            if(hc.choices<=1)
            {
              this.choose(0)
              if(hc.greens[this.choice].includes(null))this.$emit('move',null)
            }
          }
        }
        else if(!this.red)
        {
          this.select(null)
          this.choose(-1)
          this.downat(-1)
        }
        else this.$emit('move',{pIndex:this.pIndex,mIndex:this.mIndex})
      }
    }
  }
}
</script>

<style>
.card {
  position: relative;
  width: 90px;
  height: 120px;
  border: 1px solid pink;
}

.ch-red {
  border: 2px solid red;
}

.ch-green {
  border: 2px solid green;
}

.ch-selected {
  transform: scale(1.1);
  border: 3px solid yellow;
}

.id {
  text-align: center;
}

.atk,
.hp {
  position: absolute;
  display: inline-block;
}

.atk {
  left: 5px;
  bottom: 5px;
  border: 1px solid orange;
}

.hp {
  right: 5px;
  bottom: 5px;
  border: 1px solid red;
}
</style>
