function findUserRatingScore(data, userId) {
  return data.filter((item) => item.user_id === userId);
}

function calculateAverageRatingScore(data) {
  const ratingsByRecipe = data.reduce((acc, curr) => {
    const { recipe_id, rating } = curr;
    if (!acc[recipe_id]) {
      acc[recipe_id] = [];
    }
    acc[recipe_id].push(rating);
    return acc;
  }, {});

  const averageRatingScores = Object.entries(ratingsByRecipe).map(([recipeId, ratings]) => {
    const sum = ratings.reduce((acc, curr) => acc + curr, 0);
    const averageScore = sum / ratings.length;
    return {
      recipe_id: parseInt(recipeId, 10),
      score: averageScore
    };
  });

  return averageRatingScores;
}

function combineRatingsWithRecipes(averageRatingScores, recipes) {
  return recipes.map((recipe) => {
    const ratingScore = averageRatingScores.find((score) => score.recipe_id === recipe.id);

    return {
      ...recipe,
      rating: ratingScore ? ratingScore.score : null
    };
  });
}
function combineUserRatingWithRecipes(userRating, recipes) {
  return recipes.map((recipe) => {
    const ratingScore = userRating.find((score) => score.recipe_id === recipe.id);

    return {
      ...recipe,
      userRating: ratingScore ? { ...ratingScore } : null
    };
  });
}

export {
  findUserRatingScore,
  calculateAverageRatingScore,
  combineRatingsWithRecipes,
  combineUserRatingWithRecipes
};
