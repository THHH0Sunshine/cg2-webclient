<template>
  <div>
    <div class="heroinfo">
      <Character
      class="weapon"
      v-if="weapon"
      :pIndex="-2"
      :mIndex="-2"
      :card="weapon"
      />
      <Character
      class="hero"
      :pIndex="pIndex"
      :mIndex="-1"
      :card="hero"
      @move="$emit('move',$event)"
      />
      <Card
      class="skill"
      v-if="skill"
      :index="skillind"
      :card="skill"
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
import {mapGetters} from 'vuex'
import Character from '@/components/Character.vue'
import Card from '@/components/Card.vue'

export default {
  name: 'player',
  components: {
    Character,
    Card
  },
  props: {
    pIndex: Number,
    player: Object,
  },
  computed: {
    ...mapGetters(['self']),
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
    },
    weapon() {
      return this.player.weapon
    },
    skill() {
      return this.player.skill
    },
    skillind() {
      return this.pIndex==this.self?-1:-2
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
