<template>
  <div class="mx-5 px-5 mt-5 d-flex flex-column border">
    <div class="my-2">
      <h3>ชื่อ : {{ recipeData.name }}</h3>
      <div
        v-if="user?.id === recipeData.created_by"
        @click="deleteRecipe(recipeData.id)"
        class="border"
      >
        delete
      </div>
    </div>
    <div>
      <img height="200" :src="recipeData.image_url" />
    </div>
    <!-- <div class="my-2">
            <p>รายละเอียด : {{ recipeData.description }}</p>
        </div> -->
    <div class="my-2">
      <h3>วัตถุดิบ</h3>
      <div v-for="(ingredient, index) in recipeData.ingredients">
        {{ index + 1 }}. {{ ingredient.ingredient_name }}
      </div>
    </div>
    <div class="my-2">
      <h3>วิธีทํา</h3>
      <div v-for="(step, index) in recipeData.steps">
        {{ index + 1 }}. {{ step.step_description }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
const user = useSupabaseUser();
const route = useRoute();
const config = useRuntimeConfig();
const recipeId = route.params.id;
const router = useRouter();
const recipeData = ref({});

onMounted(async () => {
  recipeData.value = await getRecipeById(recipeId).catch((error) => {
    console.log(error);
  });
});
const getRecipeById = async (id) => {
  return await $fetch("/api/recipes/" + id);
};

const deleteRecipe = async (id) => {
  const result = await $fetch("/api/recipes/" + id, {
    method: "DELETE"
  });
  console.log(result);
  if (result.statusCode === 200) {
    navigateTo("/");
  }
};
</script>

<style lang="scss" scoped></style>
