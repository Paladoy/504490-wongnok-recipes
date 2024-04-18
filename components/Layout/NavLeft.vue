<script setup>
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/AuthStore";
import { useAppStore } from "@/stores/AppStore";

const authStore = useAuthStore();
const appStore = useAppStore();
console.log(authStore.userProfile);
const { app } = storeToRefs(useAppStore());

const links = [{ icon: "mdi-home", title: "Home", url: "/" }];
</script>

<template>
  <v-navigation-drawer
    color="background"
    v-model="app.navDrawer"
    location="left"
    :rail="app.navRail"
    app
  >
    <v-list-item
      height="57px"
      prepend-avatar="/img/logo.png"
      :title="authStore.userProfile.username"
      class="py-2"
    ></v-list-item>

    <v-list density="compact" nav>
      <v-list-item
        v-for="link in links"
        :key="link.icon"
        :prepend-icon="link.icon"
        :title="link.title"
        :to="link.url"
        link
      >
      </v-list-item>
    </v-list>
    <template v-slot:append>
      <v-list density="compact" nav>
        <v-list-item
          v-if="Object.keys(authStore.userProfile).length"
          key="logout"
          prepend-icon="mdi-logout"
          title="Logout"
          @click="authStore.handleSignOut"
          link
        >
        </v-list-item>
        <v-list-item
          v-else
          key="login"
          prepend-icon="mdi-login"
          title="Login"
          @click="() => navigateTo('/login')"
          link
        >
        </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>
