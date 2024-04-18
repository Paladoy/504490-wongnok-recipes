<script setup>
import { useAuthStore } from "@/stores/AuthStore";
import { useAppStore } from "@/stores/AppStore";

const authStore = useAuthStore();
const appStore = useAppStore();
const user = useSupabaseUser();

const links = [
  {
    title: "Home",
    url: "/",
    icon: "mdi-home",
    action: null
  },
  {
    title: "Account",
    url: "/account/profile",
    icon: "mdi-account",
    action: null
  },
  {
    title: "Logout",
    url: "",
    icon: "mdi-logout",
    action: authStore.handleSignOut
  }
];


</script>

<template>
  <v-app-bar app density="comfortable" border elevation="0">
    <!-- <v-app-bar-nav-icon @click="appStore.switchNavRail"> </v-app-bar-nav-icon> -->
    
    <v-app-bar-title style="text-transform: capitalize"><v-icon v-if="$route.name !== 'index'" icon="mdi-arrow-left" @click="navigateTo('/')"></v-icon></v-app-bar-title>
    <!-- <v-app-bar-title style="text-transform: capitalize" @click="navigateTo('/')">Home</v-app-bar-title> -->
    <v-menu v-if="user">
      <template v-slot:activator="{ props }">
        <v-btn icon v-bind="props">
          <v-avatar
            :icon="!authStore.userProfile.photo ? 'mdi-account' : ''"
            :image="authStore.userProfile.photo ? authStore.userProfile.photo : ''"
          >
          </v-avatar>
        </v-btn>
      </template>
      <v-list>
        <v-list-item v-for="link in links" :to="link.url" @click="link.action">
          <template v-slot:prepend>
            <v-icon :icon="link.icon"></v-icon>
          </template>
          <v-list-item-title>{{ link.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-menu v-else>
      <template v-slot:activator="{ props }">
        <v-btn variant="flat" color="indigo-darken-3" @click="navigateTo('/login')">
          login
        </v-btn>
      </template>
    </v-menu>
  </v-app-bar>
</template>
