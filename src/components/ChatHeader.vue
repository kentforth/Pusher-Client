<template>
  <div class="header" :class="{ hide: !currentRoom.id && roomId !== '' }">
    <div class="profile">
      <font-awesome-icon
        icon="chevron-left"
        class="icon fa-arrow-left"
        @click="SET_ROOM_CHOSEN_FALSE()"
      />

      <img
        :src="currentRoom.image"
        alt="profile image"
        class="profile__image"
        v-if="currentRoom.image"
      />
      <h3>{{ currentRoom.name }}</h3>
      <span v-if="currentRoom.status === 'active'"></span>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "ChatHeader",
  data() {
    return {
      roomId: ""
    };
  },

  computed: {
    ...mapState("rooms", ["currentRoom"])
  },
  methods: {
    ...mapActions("rooms", ["SET_ROOM_CHOSEN_FALSE"])
  },
  created() {
    this.roomId = "";
    const roomId = localStorage.getItem("roomId");
    if (roomId) {
      this.roomId = roomId;
    }
  }
};
</script>

<style scoped lang="scss">
.header {
  width: 100%;
  height: rem(80px);
  border-bottom: 1px solid $dark-gray;
  display: grid;
  padding: rem(20px) rem(30px);
  grid-template-columns: 1fr 1fr;
  align-content: center;
  transition: all 0.6s ease;
}

.profile {
  display: flex;
  align-items: center;

  &__image {
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 50%;
  }

  h3 {
    margin-left: rem(15px);
  }

  span {
    background-color: $green;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-left: rem(10px);
  }
}

.icon {
  cursor: pointer;
  transition: color 0.3s ease;
  margin-left: rem(40px);
}

.icon:hover {
  color: $accent;
}

.hide {
  opacity: 0;
  pointer-events: none;
  cursor: default;
  transform: translateY(-10px);
}

.fa-arrow-left {
  display: none;
  font-size: 2rem;
  color: $gray;
  margin: 0 rem(30px) 0 0;

  @include responsive(tab-port) {
    display: block;
  }
}
</style>
