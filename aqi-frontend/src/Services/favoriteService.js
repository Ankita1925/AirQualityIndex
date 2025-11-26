export const getFavorites = () => {
  return JSON.parse(localStorage.getItem("favorites") || "[]");
};

export const addFavorite = (city) => {
  const favorites = getFavorites();
  if (!favorites.includes(city)) {
    favorites.push(city);
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }
};

export const removeFavorite = (city) => {
  let favorites = getFavorites();
  favorites = favorites.filter((c) => c !== city);
  localStorage.setItem("favorites", JSON.stringify(favorites));
};
