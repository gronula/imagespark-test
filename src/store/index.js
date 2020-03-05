import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    users: []
  },
  getters: {
    users: s => s.users
  },
  mutations: {
    SET_DATA(state, users) {
      state.users = users;
    }
  },
  actions: {
    async fetchData({ commit }) {
      await fetch(`/assets/users.json`)
        .then(response => response.json())
        .then(json => {
          commit(`SET_DATA`, json.users);
        });
    }
  }
});
