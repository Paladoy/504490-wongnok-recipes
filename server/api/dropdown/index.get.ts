import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const { data: difficulty, error: difficultyError } = await client
    .from("difficulty")
    .select()
    .order("id", { ascending: true });

  if (difficultyError) {
    return {
      statusCode: 500,
      msg: difficultyError
    };
  }

  const { data: cookingtime, error: cookingtimeError } = await client
    .from("cookingtime")
    .select()
    .order("id", { ascending: true });

  if (cookingtimeError) {
    return {
      statusCode: 500,
      msg: cookingtimeError
    };
  }

  const data = {
    difficulty,
    cookingtime
  };

  return data;
});
