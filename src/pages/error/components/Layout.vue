<template>
  <div class="error">
    <div class="error-svg">
      <slot />
    </div>
    <router-link to="/">
      <el-button type="primary">
        回到首页
      </el-button>
    </router-link>
  </div>
</template>

<style lang="scss" scoped>
.error {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &-svg {
    width: 400px;
    max-width: 90vw;
    margin-bottom: 50px;
    img {
      width: 100%;
      height: auto;
      display: block;
    }
  }
}
</style>
