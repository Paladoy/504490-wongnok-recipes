import { serverSupabaseUser, serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  const supabaseClient = await serverSupabaseClient(event);
  const body = await readBody(event);

  const { data, error } = await supabaseClient.from("ratings").upsert(body).select();

  if (error) {
    return { statusCode: 500, msg: error };
  }

  return {
    statusCode: 200,
    data
  };
});
