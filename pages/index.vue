<script setup>
// navigateTo('/')
const user = useSupabaseUser();
const searchName = ref("");
const selectedCookingTime = ref(null);
const selectedDifficulty = ref(null);
const difficulty = ref([]);
const cookingTime = ref([]);
const recipes = ref([]);
const router = useRouter();
const count = ref(0);
const userRating = ref(0);

onMounted(() => {
  getRecipes();
  dropdown();
});
const getRecipes = async () => {
  const name = searchName.value || "";
  const diff = selectedDifficulty.value || "";
  const time = selectedCookingTime.value || "";
  recipes.value = await $fetch(`/api/recipes?name=${name}&diff=${diff}&time=${time}`);
  count.value = recipes.value.length;
  console.log(recipes);
};

const dropdown = async () => {
  const dd = await $fetch("/api/dropdown");
  difficulty.value = dd.difficulty;
  cookingTime.value = dd.cookingtime;
};

const onClickRecipe = (id) => {
  return router.push(`/recipes/${id}`);
};

const createRecipes = () => {
  return router.push("/recipes");
};

const insertUserRating = async (id, value) => {
  console.log("user", user.value.id);
  const result = await $fetch("/api/rating", {
    method: "POST",
    body: {
      user_id: user.value.id,
      recipe_id: id,
      rating: value
    }
  });
  console.log(result);
};

const ratingChannge = async (value, id) => {
  await insertUserRating(id, value);
  await getRecipes();
};
</script>

<template>
  <v-container>
    <v-row class="border">
      <v-col cols="12" md="3">
        <v-text-field v-model="searchName" label="ชื่อเมนู" hide-details clearable></v-text-field>
      </v-col>

      <v-col cols="12" md="3">
        <v-select
          v-model="selectedCookingTime"
          :items="cookingTime"
          item-title="time_range"
          item-value="id"
          label="ระยะเวลา"
          clearable
        ></v-select>
      </v-col>

      <v-col cols="12" md="3">
        <v-select
          v-model="selectedDifficulty"
          :items="difficulty"
          item-title="difficulty_level"
          item-value="id"
          label="ระดับความยาก"
          clearable
        ></v-select>
      </v-col>
      <v-col cols="12" :md="user ? '1' : '3'">
        <v-btn variant="flat" color="indigo-darken-3" size="x-large" block @click="getRecipes">
          ค้นหา
        </v-btn>
      </v-col>
      <v-col v-if="user" cols="12" md="2">
        <v-btn variant="flat" color="indigo-darken-3" size="x-large" block @click="createRecipes">
          สร้างสูตรอาหาร
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col> </v-col>
    </v-row>
    <v-col cols="12" md="3">
      <!-- <v-btn variant="flat" color="indigo-darken-3" size="x-large" block @click="getRecipes"> สร้างสูตรอาหาร </v-btn> -->
    </v-col>
    <v-row>
      <div class="my-2">{{ count }} เมนู</div>
    </v-row>
    <v-row v-for="recipe in recipes" class="my-2">
      <v-col cols="12">
        <v-card class="border">
          <template v-slot:title>
            <div @click="onClickRecipe(recipe.id)">
              {{ recipe.name }}
            </div>
          </template>

          <template v-slot:subtitle>
            <div class="" @click="onClickRecipe(recipe.id)">
              <div>เวลา {{ recipe.cookingtime.time_range }}</div>
              <div>ความยาก {{ recipe.difficulty.difficulty_level }}</div>
            </div>
          </template>

          <template v-slot:text>
            <v-container>
              <v-row class="d-flex align-center">
                <v-col cols="3" class=""><span>คะแนนรวม</span></v-col>
                <v-col cols="6" class="d-flex justify-center">
                  <v-rating
                    v-model="recipe.rating"
                    active-color="blue"
                    color="orange-lighten-1"
                    readonly
                  >
                  </v-rating
                ></v-col>
                <v-col cols="3" class="d-flex justify-end">
                  <pre>{{ recipe.rating }}</pre>
                </v-col>
              </v-row>
            </v-container>
            <!-- <v-containter v-if="user.id !== recipe.created_by">
              <v-row class="d-flex align-center">
                <v-col cols="3">
                  <span>คะแนนของคุณ</span>
                </v-col>
                <v-col cols="6" class="d-flex justify-center">
                  <v-rating
                    v-if="recipe.userRating"
                    v-model="recipe.userRating.rating"
                    @update:modelValue="ratingChannge($event, recipe.id)"
                    active-color="blue"
                    color="orange-lighten-1"
                  ></v-rating>
                  <v-rating
                    v-else
                    v-model="userRating"
                    @update:modelValue="ratingChannge($event, recipe.id)"
                    active-color="blue"
                    color="orange-lighten-1"
                  ></v-rating>
                </v-col>
                <v-col cols="3" class="d-flex justify-end">
                  <pre>{{ recipe.userRating ? recipe.userRating.rating : "" }}</pre>
                </v-col>
              </v-row>
            </v-containter> -->
          </template>
        </v-card>
      </v-col>
      <!-- {{ recipes }} -->
    </v-row>
  </v-container>
</template>
