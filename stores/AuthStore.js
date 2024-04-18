import { defineStore } from "pinia";
import { useAppStore } from "./AppStore";

export const useAuthStore = defineStore({
  id: "auth",
  state: () => ({
    appStore: useAppStore(),
    supabaseClient: useSupabaseClient(),
    user: useSupabaseUser(),
    userProfile: {}
  }),
  getters: {},
  actions: {
    async init() {
      this.getProfile();
    },
    async getProfile() {
      try {
        this.appStore.setLoader(true);
        const { data, error } = await this.supabaseClient.from("profiles").select().single();
        if (error) throw error;
        this.userProfile = data;
      } catch (error) {
        this.appStore.setError(error);
      } finally {
        this.appStore.setLoader(false);
      }
    },
    async signUp(email, password,profile={}) {
      try {
        this.appStore.setLoader(true);
        const { data, error } = await this.supabaseClient.auth.signUp({
          email: email,
          password: password
        });
        console.log(data, error);
        if (error) {
          throw error
        }
        const userId = data.user.id
        console.log("user id", userId);
        if(userId){
          const { data:insertProfile,error:profileError } = await this.supabaseClient
          .from("profiles")
          .upsert({
            ...profile,
            id: userId
          })
          .select().single();
          if (profileError) throw profileError;
          console.log("insertProfile", insertProfile);
        }
        this.appStore.setSuccess(
          "Registration was successful. Please check your email to confirm your account."
        );
      } catch (error) {
        console.log("throw err", error);
        this.appStore.setError(error);
      } finally {
        this.appStore.setLoader(false);
      }
    },
    async signInWithPassword(email, password) {
      try {
        this.appStore.setLoader(true);
        const { error } = await this.supabaseClient.auth.signInWithPassword({
          email: email,
          password: password
        });
        if (error) throw error;
        this.appStore.setSuccess("You were successfully logged in");
      } catch (error) {
        this.appStore.setError(error);
      } finally {
        this.appStore.setLoader(false);
      }
    },
    async signInWithOAuth(provider) {
      try {
        this.appStore.setLoader(true);
        const { error } = await this.supabaseClient.auth.signInWithOAuth({
          provider: provider,
          options: {
            redirectTo: "http://localhost:3000/"
          }
        });
        if (error) throw error;
      } catch (error) {
        this.appStore.setError(error);
      } finally {
        this.appStore.setLoader(false);
        this.appStore.setSuccess("You were successfully logged in.");
      }
    },
    async updateProfile() {
      try {
        this.appStore.setLoader(true);
        const { error } = await this.supabaseClient
          .from("profiles")
          .upsert({
            firstname: this.userProfile.firstname,
            lastname: this.userProfile.lastname,
            username: this.userProfile.username,
            street: this.userProfile.street,
            postcode: this.userProfile.postcode,
            city: this.userProfile.city,
            country: this.userProfile.country
          })
          .select();
        if (error) throw error;
      } catch (error) {
        this.appStore.setError(error);
      } finally {
        this.appStore.setLoader(false);
        this.appStore.setSuccess("Your account data has been updated successfully.");
      }
    },
    async updatePhoto(images) {
      console.log("update images");
      try {
        this.appStore.setLoader(true);

        await this.supabaseClient.storage
          .from("avatars")
          .remove([`public/${this.userProfile.photo.split("/").pop()}`]);

        const { data: file, error } = await this.supabaseClient.storage
          .from("avatars")
          .upload(`public/${this.user.id}-${Date.now()}.png`, images[0], {
            upsert: true
          });

        const { data: photo } = await this.supabaseClient.storage
          .from("avatars")
          .getPublicUrl(file.path);
        console.log(photo);
        this.userProfile.photo = photo.publicUrl;

        await this.supabaseClient.from("profiles").upsert({
          photo: photo.publicUrl
        });

        if (error) throw error;
      } catch (error) {
        this.appStore.setError(error);
      } finally {
        this.appStore.setLoader(false);
        this.appStore.setSuccess("Your profile picture has been updated successfully.");
      }
    },
    async updateEmail(email) {
      try {
        this.appStore.setLoader(true);
        const { error } = await this.supabaseClient.auth.updateUser({
          email: email
        });
        if (error) throw error;
      } catch (error) {
        this.appStore.setError(error);
      } finally {
        this.handleSignOut();
      }
    },
    async updatePassword(password) {
      try {
        this.appStore.setLoader(true);
        const { error } = await this.supabaseClient.auth.updateUser({
          password: password
        });
        if (error) throw error;
      } catch (error) {
        this.appStore.setError(error);
      } finally {
        this.handleSignOut();
      }
    },
    async handleSignOut() {
      try {
        this.appStore.setLoader(true);
        const { error } = await this.supabaseClient.auth.signOut();
        if (error) throw error;
      } catch (error) {
        this.appStore.setLoader(false);
        this.appStore.setError(error);
      } finally {
        setTimeout(navigateTo("/login"), 500);
        this.appStore.setLoader(false);
        this.appStore.setSuccess("You were successfully logged out.");
      }
    }
  }
});
