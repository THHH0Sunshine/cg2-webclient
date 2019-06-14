<template>
  <div id="app">
    <Game/>
    <div class="about">cardgame2 web client by Sunny💗</div>
  </div>
</template>

<script>
import Game from './components/Game.vue'

export default {
  name: 'app',
  components: {
    Game
  }
}
</script>

<style>
.about {
  text-align: center;
}
</style>
