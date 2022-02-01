// This file is required for nuxt-auth
// nuxt-auth requires vuex store to be activated, so some file must exist in this dir
export const state = () => ({
  counter: 0
})

export const mutations = {
  increment (state) {
    state.counter++
  }
}
