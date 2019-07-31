<template>
  <div class="handcard" :class="{'hc-green':green,'hc-selected':thisSelected}" @click="clickme">
    <div class="hc-id">{{id}}</div>
    <div class="hc-cost">{{cost}}</div>
    <div class="hc-atk">{{atk}}</div>
    <div class="hc-hp">{{hp}}</div>
  </div>
</template>

<script>
import {mapGetters,mapMutations} from 'vuex'

export default {
  name: 'card',
  props: {
    index: Number,
    card: Object,
  },
  computed: {
    ...mapGetters(['canPlay','selected','choice']),
    id() {
      return this.card==null?'':this.card.name
    },
    cost() {
      return this.card==null?'':this.card.cost
    },
    atk() {
      return this.card==null?'':this.card.atk
    },
    hp() {
      return this.card==null?'':this.card.hp
    },
    green() {
      if(this.card==null||!this.canPlay||this.card.greens==null||this.card.greens.length<=0)return false
      var gr=this.card.greens
      for(var g in gr)if(gr[g].length>0)return true
      return false
    },
    thisSelected() {
      return this.selected!=null&&-1==this.selected.pIndex&&this.index==this.selected.mIndex
    }
  },
  methods: {
    ...mapMutations(['choose','downat','select']),
    clickme() {
      if(this.index<-1)return
      if(this.selected==null)
      {
        if(this.green)
        {
          this.select({pIndex:-1,mIndex:this.index})
          if(this.card.type!='MINION')
          {
            if(this.card.choices<=1)
            {
              this.choose(0)
              if(this.card.greens[this.choice].includes(null))this.$emit('move',null)
            }
            //else open discover
          }
        }
      }
      else
      {
        this.select(null)
        this.choose(-1)
        this.downat(-1)
      }
    }
  }
}
</script>


<style>
.handcard {
  position: relative;
  width: 90px;
  height: 120px;
  border: 1px solid pink;
}

.hc-green {
  border: 2px solid green;
}

.hc-selected {
  transform: scale(1.1);
  border: 3px solid yellow;
}

.hc-id {
  text-align: center;
}

.hc-cost,
.hc-atk,
.hc-hp {
  position: absolute;
  display: inline-block;
}

.hc-cost {
  left: 5px;
  top: 5px;
  border: 1px solid yellow;
}

.hc-atk {
  left: 5px;
  bottom: 5px;
  border: 1px solid orange;
}

.hc-hp {
  right: 5px;
  bottom: 5px;
  border: 1px solid red;
}
</style>
