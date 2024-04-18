<template>
  <div>
    <div class="my-5 d-flex justify-center">
      <h1>สร้างเมนู</h1>
    </div>
    <v-sheet class="mx-auto w-50">
      <v-form ref="createFrom">
        <v-text-field v-model="name" :rules="nameRules" label="ชื่อเมนู" required></v-text-field>
        <div v-if="selectedFile">
          {{ selectedFile[0].name }}
        </div>
        <div class="my-3 d-flex">
          <v-btn variant="outlined" @click="handleFileImport" block> เพิ่มรูป </v-btn>
          <input
            ref="fileUploader"
            class="btn d-none"
            accept="image/*"
            type="file"
            @change="updatePhoto"
          />
        </div>

        <v-select
          v-model="selectedCookingTime"
          :items="cookingTime"
          :rules="[(v) => !!v || 'CookingTime is required']"
          item-title="time_range"
          item-value="id"
          label="ระยะเวลา"
          clearable
          required
        ></v-select>

        <v-select
          v-model="selectedDifficulty"
          :items="difficulty"
          :rules="[(v) => !!v || 'Difficulty is required']"
          item-title="difficulty_level"
          item-value="id"
          label="ระดับความยาก"
          clearable
          required
        ></v-select>

        <div class="px-2 my-2">
          <div class="d-flex justify-space-between">
            <h3>วัตถุดิบ</h3>
            <span @click="addIngredients">+</span>
          </div>
          <div
            v-for="(ingredient, index) in ingredients"
            class="d-flex justify-space-between align-center border"
          >
            <span class="mx-2">{{ index + 1 }}</span>
            <v-text-field
              v-model="ingredient.ingredient_name"
              :rules="[(v) => !!v || 'Item is required']"
              required
            ></v-text-field>
            <span @click="remIngredients" class="mx-2"> - </span>
          </div>
        </div>
        <div class="px-2 my-2">
          <div class="d-flex justify-space-between">
            <h3>วิธีทํา</h3>
            <span @click="addSteps">+</span>
          </div>
          <div
            v-for="(step, index) in steps"
            class="d-flex justify-space-between align-center border"
          >
            <span class="mx-2">{{ index + 1 }}</span>
            <v-text-field
              v-model="step.step_description"
              :rules="[(v) => !!v || 'Item is required']"
              required
            ></v-text-field>
            <span @click="remSteps" class="mx-2"> - </span>
          </div>
        </div>
        <!-- <v-checkbox
          v-model="checkbox"
          :rules="[(v) => !!v || 'You must agree to continue!']"
          label="Do you agree?"
          required
        ></v-checkbox> -->

        <div class="d-flex flex-column">
          <v-btn class="mt-4" color="secondary" block @click="submit"> submit </v-btn>
        </div>
      </v-form>
    </v-sheet>
  </div>
</template>

<script setup>
const selectedFile = ref(null);
const fileUploader = ref(null);
const selectedCookingTime = ref(null);
const selectedDifficulty = ref(null);
const difficulty = ref([]);
const cookingTime = ref([]);
const ingredients = ref([]);
const steps = ref([]);
const createFrom = ref(null);
const name = ref("");
const nameRules = ref([(v) => !!v || "Name is required"]);
const checkbox = ref(false);

onMounted(() => {
  dropdown();
});
const submit = async () => {
  const valid = await validate();
  if (valid) {
    const data = {
      name: name.value,
      img: selectedFile.value,
      cookingTime: selectedCookingTime.value,
      difficulty: selectedDifficulty.value,
      ingredients: ingredients.value,
      steps: steps.value
    };
    const formData = new FormData();
    formData.append("name", name.value);
    if (selectedFile.value) formData.append("img", selectedFile.value);
    formData.append("cookingTime", selectedCookingTime.value);
    formData.append("difficulty", selectedDifficulty.value);
    formData.append("ingredients", JSON.stringify(ingredients.value));
    formData.append("steps", JSON.stringify(steps.value));
    const addResult = await $fetch(`/api/recipes`, {
      method: "POST",
      body: formData
    });
    console.log("addResult", addResult);
    console.log(data);
    if (addResult.statusCode === 200) {
      navigateTo("/");
    }
  }
};

const handleFileImport = () => {
  fileUploader.value.click();
};

const updatePhoto = (e) => {
  selectedFile.value = e.target.files[0];
  // console.log(selectedFile.value);
};

const addIngredients = () => {
  ingredients.value.push({
    ingredient_name: ""
  });
};

const remIngredients = (index) => {
  ingredients.value.splice(index, 1);
};

const addSteps = () => {
  const step_number = steps.value.length + 1;
  steps.value.push({
    step_number,
    step_description: ""
  });
};

const remSteps = (index) => {
  steps.value.splice(index, 1);
};

const dropdown = async () => {
  const dd = await $fetch("/api/dropdown");
  difficulty.value = dd.difficulty;
  cookingTime.value = dd.cookingtime;
};

const validate = async () => {
  const { valid } = await createFrom.value.validate();
  return valid;
};
const reset = () => {
  createFrom.value.reset();
};
const resetValidation = () => {
  createFrom.value.resetValidation();
};
</script>

<style lang="scss" scoped></style>
