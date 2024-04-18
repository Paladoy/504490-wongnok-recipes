import { serverSupabaseUser, serverSupabaseClient } from "#supabase/server";
import {
  findUserRatingScore,
  calculateAverageRatingScore,
  combineRatingsWithRecipes,
  combineUserRatingWithRecipes
} from "./recipes_utils";

export default eventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  const client = await serverSupabaseClient(event);
  const query = getQuery(event);
  const searchSpec = {};
  let searchTerm = "";
  if (query.diff) {
    searchSpec.difficulty_level = query.diff;
  }
  if (query.time) {
    searchSpec.cooking_time = query.time;
  }
  if (query.name) {
    searchTerm = query.name;
  }
  const { data, error: recipesError } = await client
    .from("recipes")
    .select(`id,name,cookingtime(time_range),difficulty(difficulty_level),created_by`)
    .match(searchSpec)
    .like("name", `%${searchTerm}%`);

  const mapId = data.map((item) => item.id);
  const { data: rating, error: ratingError } = await client
    .from("ratings")
    .select()
    .in("recipe_id:", mapId);
  const averageRatingScores = await calculateAverageRatingScore(rating);
  const mapRating = combineRatingsWithRecipes(averageRatingScores, data);
  const userId = user?.id || "";
  const userScore = await findUserRatingScore(rating, userId);
  const combineData = combineUserRatingWithRecipes(userScore, mapRating);

  return combineData;
});
