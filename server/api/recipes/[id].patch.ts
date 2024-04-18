import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const client = await serverSupabaseClient(event);
  const body = await readBody(event);
  const { error } = await supabaseClient.from("recipes").update(body).eq("id", Number(id));
  if (error) {
    return { statusCode: 500, body: error };
  }
  return {
    statusCode: 200,
    msg: "success"
  };
});
