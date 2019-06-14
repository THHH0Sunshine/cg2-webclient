<template>
  <div>
    <div class="heroinfo">
      <Character
      class="hero"
      :pIndex="pIndex"
      :mIndex="-1"
      :card="hero"
      @move="$emit('move',$event)"
      />
      <div>
        <div>INFO</div>
        <div>coins:{{coins}}</div>
        <div>cards in hand:{{handlen}}</div>
        <div>cards in deck:{{decklen}}</div>
      </div>
    </div>
    <div class="minions">
      <Character
      class="minion"
      v-for="(v,k) in minions"
      :pIndex="pIndex"
      :mIndex="k"
      :card="v"
      :key="k"
      @move="$emit('move',$event)"
      />
    </div>
  </div>
</template>

<script>
import Character from '@/components/Character.vue'

export default {
  name: 'player',
  components: {
    Character
  },
  props: {
    pIndex: Number,
    player: Object,
  },
  computed: {
    coins() {
      return this.player.coins
    },
    decklen() {
      return this.player.decklen
    },
    handlen() {
      return this.player.handlen
    },
    hero() {
      return this.player.hero
    },
    minions() {
      return this.player.minions
    }
  }
}
</script>

<style>
.heroinfo {
  height: 140px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: cyan;
}

.minions {
  height: 140px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: lightyellow;
}

.minion + .minion {
  margin-left: 10px;
}
</style>
