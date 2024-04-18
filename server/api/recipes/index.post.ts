import { serverSupabaseUser, serverSupabaseClient } from "#supabase/server";
function addId(array, id) {
  return array.map((obj) => {
    return {
      ...obj,
      recipe_id: id
    };
  });
}
export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  const supabaseClient = await serverSupabaseClient(event);
  const formData = await readMultipartFormData(event);
  console.log("formData", formData);

  let files = "";
  let publicUrl = "";
  let name = "";
  const body = {};
  for (const entry of formData) {
    if (entry.name === "img" && entry.data instanceof Buffer) {
      const fileName = entry.filename;
      const fileBuffer = entry.data;

      // Upload file to Supabase Storage
      const { data: file, error } = await supabaseClient.storage
        .from("images")
        .upload(`${fileName}`, fileBuffer, {
          upsert: true
        });

      console.log("file", file);
      if (error) {
        console.error("Error uploading file:", error);
        return { statusCode: 500, body: "Internal Server Error" };
      }
      const { data: photo } = await supabaseClient.storage.from("images").getPublicUrl(file.path);
      console.log(photo);
      publicUrl = photo.publicUrl;
      files = publicUrl;
      console.log(`File "${fileName}" uploaded successfully. Public URL: ${publicUrl}`);
    } else {
      body[entry.name] = entry.data.toString();
    }
  }
  const created_by = user.id;
  const data = {
    name: body.name,
    image_url: publicUrl,
    difficulty_level: body.difficulty,
    cooking_time: body.cookingTime,
    created_by
  };

  const { data: insertData, error } = await supabaseClient
    .from("recipes")
    .insert(data)
    .select()
    .single();

  console.log("insertData", insertData);
  console.log("error", error);
  if (error) {
    return { statusCode: 500, body: error };
  }
  const ingredients = body.ingredients ? addId(JSON.parse(body.ingredients), insertData.id) : [];
  const steps = body.steps ? addId(JSON.parse(body.steps), insertData.id) : [];

  if (ingredients.length > 0) {
    const { data, error } = await supabaseClient.from("ingredients").insert(ingredients).select();
    console.log("ingredients insert", data);
    console.log("ingredients insert errr", error);
  }

  if (steps.length > 0) {
    const { data, error } = await supabaseClient.from("steps").insert(steps).select();
    console.log("steps insert", data);
    console.log("steps insert errr", error);
  }

  return {
    statusCode: 200,
    data: insertData
  };
});
