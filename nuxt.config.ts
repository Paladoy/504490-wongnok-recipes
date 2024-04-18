import { defineNuxtConfig } from "nuxt/config";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      APP_URL: process.env.APP_URL
    }
  },
  ssr: false,
  // routeRules: {
  //   '/login': { ssr: false },
  //   '/': { ssr: false }
  // },
  css: ["vuetify/lib/styles/main.sass", "@mdi/font/css/materialdesignicons.min.css"],
  build: {
    transpile: ["vuetify"]
  },
  vite: {
    define: {
      "process.env.DEBUG": true
    }
  },
  modules: ["@pinia/nuxt", "@nuxtjs/supabase"],
  supabase: {
    redirectOptions: {
      login: "/login",
      callback: "/",
      exclude: ["/login", "/home", "/","/recipes/*"]
    },
    redirect: true
  },
  devtools: { enabled: true }
});
