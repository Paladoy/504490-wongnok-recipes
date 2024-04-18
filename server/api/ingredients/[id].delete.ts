import { serverSupabaseUser, serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  const supabaseClient = await serverSupabaseClient(event);
  const id = getRouterParam(event, "id");
  const { error } = await supabaseClient.from("ingredients").delete().eq("id", Number(id));

  if (error) {
    return { statusCode: 500, msg: error };
  }

  return {
    statusCode: 200,
    msg: "ingredients deleted successfully"
  };
});
