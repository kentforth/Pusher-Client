<template>
  <div class="sidebar">
    <!--LOGO-->
    <div class="logo">
      <img src="../assets/images/icons/logo-icon.svg" alt="logo" />
    </div>

    <!--LINKS-->
    <div class="links">
      <div class="link-item">
        <router-link to="/">
          <font-awesome-icon icon="comments" class="icon" />
        </router-link>
      </div>
      <div class="link-item">
        <router-link to="/settings">
          <font-awesome-icon icon="cog" class="icon" />
        </router-link>
      </div>
    </div>

    <div class="sign-out">
      <font-awesome-icon
        icon="sign-out-alt"
        class="icon fa-sign-out"
        @click="signOut"
      />
    </div>
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";
import { mapActions, mapState } from "vuex";

export default {
  name: "Sidebar",
  created() {
    this.CLEAR_MESSAGES();
    this.GET_USERS();
    this.GET_USER_INFO_FROM_FIREBASE();
    this.setUserStatusActive();
  },

  beforeMount() {
    window.addEventListener("beforeunload", e => this.setUserStatusInactive(e));
  },
  beforeDestroy() {
    window.removeEventListener("beforeunload", e =>
      this.setUserStatusInactive(e)
    );
  },
  computed: {
    ...mapState("userProfile", ["users"])
  },
  methods: {
    ...mapActions("userProfile", [
      "GET_USER_INFO_FROM_FIREBASE",
      "GET_USERS",
      "CLEAR_PROFILE"
    ]),
    ...mapActions("rooms", [
      "CLEAR_CURRENT_ROOM",
      "CLEAR_MESSAGES",
      "GET_ROOM_MESSAGES"
    ]),

    setUserStatusActive() {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          let userId = firebase.auth().currentUser.uid;
          firebase
            .firestore()
            .collection("users")
            .doc(userId)
            .get()
            .then(doc => {
              if (doc) {
                firebase
                  .firestore()
                  .collection("users")
                  .doc(userId)
                  .update({
                    status: "active"
                  });
              }
            });
        }
      });
    },
    setUserStatusInactive(e) {
      e.preventDefault();
      delete e["returnValue"];
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          let userId = firebase.auth().currentUser.uid;

          firebase
            .firestore()
            .collection("users")
            .doc(userId)
            .update({
              status: "inactive",
              is_messaging: false
            });
        }
      });
    },

    signOut() {
      try {
        let userId = firebase.auth().currentUser.uid;

        firebase
          .firestore()
          .collection("users")
          .doc(userId)
          .update({
            status: "inactive"
          })
          .then(() => {
            this.CLEAR_MESSAGES();
            this.CLEAR_PROFILE();
            this.CLEAR_CURRENT_ROOM();
            firebase.auth().signOut();
            localStorage.removeItem("roomId");
          });

        this.$router.replace({ name: "signin" });
      } catch (error) {
        this.$toast.error(error, {
          duration: 3500,
          position: "bottom"
        });
      }
    }
  }
};
</script>

<style scoped lang="scss">
.sidebar {
  width: rem(100px);
  max-height: 100vh;
  padding: rem(20px) rem(15px);
  background-color: $dark-gray;
  display: grid;
  align-items: start;
  grid-template-columns: 1fr;
  grid-template-rows: 200px 1fr;
  justify-content: center;
  justify-items: center;

  @include responsive(tab-port) {
    grid-row: 2/2;
    width: 100%;
    height: auto;
    grid-template-columns: 1fr 1fr 1fr;
    align-items: center;
    align-content: center;
    z-index: 888;
  }

  @include responsive(phone) {
    padding: rem(10px);
  }
}

.links {
  display: grid;
  grid-template-columns: 1fr;
  grid-row-gap: 1em;
  justify-content: center;

  @include responsive(tab-port) {
    display: flex;
  }
}

.logo {
  display: flex;
  justify-content: center;
  align-self: start;

  @include responsive(tab-port) {
    align-self: center;
    justify-self: flex-start;
  }
}

.link-item a {
  padding: rem(17px);
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

.router-link-exact-active {
  background-color: $link-background !important;
}

.router-link-exact-active > .icon {
  color: $primary;
}

.sidebar img {
  width: 40%;
  @include responsive(phone) {
    width: 30%;
  }
}

.sign-out {
  @include responsive(tab-port) {
    justify-self: flex-end;
    margin-right: rem(25px);
  }
}

.fa-sign-out {
  font-size: rem(35px);
  transform-origin: center;
  transform: rotate(180deg);
  cursor: pointer;

  @include responsive(phone) {
    font-size: rem(30px) !important;
  }
}

.icon {
  @include responsive(phone) {
    font-size: rem(20px);
  }
}
</style>
