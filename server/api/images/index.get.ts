import { serverSupabaseUser, serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  // const { data, error } = await client.storage
  // .from('avatars')
  // .getPublicUrl('th-852188874.webp')
  // console.log(data);

  const { data, error } = await client.storage.from("avatars").getPublicUrl("th-852188874.webp");
  console.log(data);

  return {
    data
  };
});
