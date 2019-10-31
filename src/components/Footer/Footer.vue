<template>
  <!-- <v-bottom-navigation v-if="userStatus" v-model="bottomNav" dark shift fixed> -->
  <v-bottom-navigation v-if="userStatus && isExistUser" v-model="bottomNav" dark fixed grow>
    <v-btn @click="toContact()">
      <span>ヘルプ</span>
      <v-icon>mdi-email-send</v-icon>
    </v-btn>
    <v-btn @click="toFavorite()">
      <span>お得意様</span>
      <v-icon>mdi-account-heart</v-icon>
    </v-btn>

    <v-btn @click="toHome()">
      <span>ホーム</span>
      <v-icon>mdi-home</v-icon>
    </v-btn>

    <v-btn @click="toNote()">
      <span>通知</span>
      <v-badge overlap>
        <template v-slot:badge>
          <span v-if="unreadNoteNum > 0">{{ unreadNoteNum }}</span>
        </template>
        <v-icon>mdi-bell-ring</v-icon>
      </v-badge>
    </v-btn>

    <v-btn @click="toSetting()">
      <span>設定</span>
      <v-icon>mdi-settings</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>
<script>
import store from "./../../store";

export default {
  created: function() {},
  mounted: function() {
    this.$nextTick(function() {
      var self = this;
      var timelineList = {
        phone: 0,
        favorite: 1,
        home: 2,
        notification: 3,
        setting: 4
      };
      var selectedFooter = timelineList[self.nowTimeline];
      self.bottomNav = selectedFooter;
    });
  },
  updated: function() {
    this.$nextTick(function() {
      var self = this;
      var timelineList = {
        phone: 0,
        favorite: 1,
        home: 2,
        notification: 3,
        setting: 4
      };
      var selectedFooter = timelineList[self.nowTimeline];
      self.bottomNav = selectedFooter;
    });
  },
  data() {
    return {
      bottomNav: 2
    };
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
    userStatus() {
      return this.$store.getters.isSignedIn;
    },
    nowTimeline: function() {
      return this.$store.getters.nowTimeline;
    },
    unreadNoteNum: function() {
      return this.$store.getters.unreadNote;
    },
    isExistUser() {
      return this.$store.getters.isExistUser;
    }
  },
  methods: {
    toHome: function() {
      store.commit("nowTimelineChanged", "home");
      this.$router.push("/");
    },
    toSetting: function() {
      store.commit("nowTimelineChanged", "setting");
      this.$router.push("/");
    },
    toNote: function() {
      this.unReadNote = false;
      store.commit("nowTimelineChanged", "notification");
      store.commit("setUnreadNote", 0);
      this.$router.push("/");
    },
    toFavorite: function() {
      store.commit("nowTimelineChanged", "favorite");
      this.$router.push("/");
    },
    toContact: function() {
      store.commit("nowTimelineChanged", "contact");
      this.$router.push("/");
    }
  },
  watch: {
    nowTimeline: function(newVal, oldVal) {
      console.log(oldVal + "=>" + newVal);
      if (newVal === "setting") this.bottomNav = 4;
    }
  }
};
</script>
