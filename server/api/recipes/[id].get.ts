import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const client = await serverSupabaseClient(event);
  const { data, error: recipesError } = await client
    .from("recipes")
    .select(
      `id,name,image_url,created_by,cookingtime(time_range),difficulty(difficulty_level),ingredients(*),steps(*)`
    )
    .match({ id })
    .single();
  console.log(data);

  return data;
});
