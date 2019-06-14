<template>
  <div class="discover" @click="clickall">
    <div class="discover-window" v-show="visible">
      <Card
      class="discover-card"
      v-for="(v,k) in cards"
      :index="-1"
      :card="v"
      :key="k"
      :class="{'discover-selected':chosen[k]}"
      @click.native="select(k)"
      />
    </div>
    <button class="discover-mtbtn" v-if="mode==3" @click="ok">OK</button>
    <button class="discover-btn" v-if="mode==2" @click="visible=!visible">{{visible?"HIDE":"SHOW"}}</button>
  </div>
</template>

<script>
import Vue from 'vue'
import Card from '@/components/Card.vue'

export default {
  name: 'discover',
  components: {
    Card
  },
  props: {
    cards: Array,
    mode: Number,
  },
  data() {
    return {
      visible: true,
      chosen: [],
    }
  },
  methods: {
    clickall(e) {
      if(this.mode==1&&!e.target.classList.contains('discover-card'))this.$emit('discover',{data:-1})
    },
    select(index) {
      if(this.mode==3)Vue.set(this.chosen,index,!this.chosen[index])
      else this.$emit('discover',{data:index})
    },
    ok() {
      this.$emit('discover',{length:this.cards.length,data:this.chosen})
      this.chosen=[]
    }
  }
}
</script>

<style>
.discover {
  position: absolute;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
}

.discover-window {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  align-content: center;
  height: 80%;
}

.discover-card {
  transform: scale(2);
}

.discover-selected {
  border: 3px solid yellow;
}

.discover-mtbtn {
  position: absolute;
  right: 50px;
  bottom: 50px;
}

.discover-btn {
  position: absolute;
  right: 10px;
  bottom: 10px;
}
</style>
