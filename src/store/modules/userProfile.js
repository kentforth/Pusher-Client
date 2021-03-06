import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

import { getField, updateField } from "vuex-map-fields";

const userProfile = {
  namespaced: true,
  state: {
    users: [],
    form: {
      name: "",
      email: "",
      location: ""
    },
    userImage: ""
  },
  mutations: {
    updateField,
    CLEAR_PROFILE: state => {
      state.form = {};
    },
    CLEAR_USERS: state => {
      state.users = [];
    },
    SET_USER_INFO: (state, data) => {
      state.form.name = data.name;
      state.form.email = data.email;
      state.form.location = data.location;
      state.userImage = data.image;
    },
    ADD_USER: (state, users) => {
      state.users = users;
    },
    REMOVE_USER: (state, user) => {
      state.users.splice(
        state.users.findIndex(item => item.id === user.id),
        1
      );
    },
    UPDATE_USER: (state, user) => {
      const userIndex = state.users.findIndex(item => item.id === user.id);
      if (userIndex === -1) {
        state.userImage = user.image;
        state.form = {
          name: user.name,
          email: user.email,
          location: user.location
        };
      } else {
        state.users[userIndex].name = user.name;
        state.users[userIndex].email = user.email;
        state.users[userIndex].image = user.image;
        state.users[userIndex].is_messaging = user.is_messaging;
        state.users[userIndex].location = user.location;
        state.users[userIndex].status = user.status;
      }
    }
  },

  actions: {
    CLEAR_PROFILE({ commit }) {
      commit("CLEAR_PROFILE");
    },
    CLEAR_USERS({ commit }) {
      commit("CLEAR_USERS");
    },
    GET_SEARCHED_USERS({ commit }, users) {
      commit("ADD_USER", users);
    },
    GET_USERS({ commit }) {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          let users = [];
          firebase
            .firestore()
            .collection("users")
            .onSnapshot(res => {
              const changes = res.docChanges();
              changes.forEach(change => {
                let userId = firebase.auth().currentUser.uid;
                if (change.type === "added") {
                  if (
                    //push only users except current user
                    users.indexOf(change.doc.data() === -1) &&
                    userId !== change.doc.data().id
                  ) {
                    users.push(change.doc.data());
                  }
                  commit("ADD_USER", users);
                  return users;
                }

                if (change.type === "removed") {
                  commit("REMOVE_USER", change.doc.data());
                }
                if (change.type === "modified") {
                  commit("UPDATE_USER", change.doc.data());
                }
              });
            });
        }
      });
    },
    GET_USER_INFO_FROM_FIREBASE({ commit }) {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          const userId = firebase.auth().currentUser.uid;
          firebase
            .firestore()
            .collection("users")
            .doc(userId)
            .get()
            .then(doc => {
              if (doc.data()) {
                commit("SET_USER_INFO", doc.data());
              }
            })
            .catch(error => {
              this.$toast.error(error, {
                duration: 4000,
                position: "bottom"
              });
            });
        }
      });
    }
  },
  getters: {
    getField
  }
};

export default userProfile;
