<script setup>
import { useAuthStore } from "@/stores/AuthStore";
const supabase = useSupabaseClient();
const authStore = useAuthStore();
const selectedFile = ref(null);
const fileUploader = ref(null);

const handleFileImport = () => {
  fileUploader.value.click();
};

const updatePhoto = (e) => {
  selectedFile.value = e.target.files;
  console.log(selectedFile.value);
  // console.log(fileUploader.value);
  authStore.updatePhoto(selectedFile.value);
  // uploadPhoto(selectedFile.value);
};

async function uploadPhoto(images) {
  console.log("update images");
  const id = "1234";
  try {
    // await supabase
    //   .storage
    //   .from('avatars')
    //   .remove([`public/${this.userProfile.photo.split('/').pop()}`])

    const { data: file, error } = await supabase.storage
      .from("avatars")
      .upload(`public/${id}-${Date.now()}.png`, images[0], {
        upsert: true
      });

    const { data: photo } = await supabase.storage.from("avatars").getPublicUrl(file.path);
    console.log("photo", photo);
    // this.userProfile.photo = photo.publicUrl

    await supabase.from("profiles").upsert({
      photo: photo.publicUrl
    });

    if (error) throw error;
  } catch (error) {
    console.log(error);
    // this.appStore.setError(error)
  } finally {
    console.log("finally");
    // this.appStore.setLoader(false)
    // this.appStore.setSuccess('Your profile picture has been updated successfully.')
  }
}

const testClick = () => {
  console.log("test");
};
</script>

<template>
  <v-container class="border">
    <h3>Update Profile Photo</h3>
    <v-btn variant="flat" @click="handleFileImport"> Update Photo </v-btn>
    <input ref="fileUploader" class="btn d-none" type="file" @change="updatePhoto" />
    <!-- <v-row>
      <v-col>
        <v-hover v-slot="{ isHovering, props }">
          <v-layout v-bind="props" class="justify-center">
            <v-img
              class="rounded-circle"
              :src="authStore.userProfile.photo"
              max-width="148"
              max-heigth="148"
            />
            <v-overlay
              :model-value="isHovering"
              contained
              scrim="#036358"
              class="align-center justify-center"
            >
              <v-btn variant="flat" @click="handleFileImport">
                Update Photo
              </v-btn>
              <input
                ref="fileUploader"
                class="d-none"
                type="file"
                @change="updatePhoto"
              />
            </v-overlay>
          </v-layout>
        </v-hover>
      </v-col>
    </v-row> -->
  </v-container>
</template>
