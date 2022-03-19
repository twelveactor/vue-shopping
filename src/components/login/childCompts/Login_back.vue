<template>
  <div>
    <vue-particles
      color="#409EFF"
      :particleOpacity="0.7"
      :particlesNumber="60"
      shapeType="circle"
      :particleSize="6"
      linesColor="#409EFF"
      :linesWidth="1"
      :lineLinked="true"
      :lineOpacity="0.4"
      :linesDistance="150"
      :moveSpeed="3"
      :hoverEffect="true"
      hoverMode="grab"
      :clickEffect="true"
      clickMode="push">
    </vue-particles>
  </div>
</template>

<script>
export default {
  name: "Login_back"
}
</script>

<style scoped>
/*粒子背景铺满*/
#particles-js {
  width: 100%;
  height: calc(100% - 100px);
  position: absolute;
}
</style>
