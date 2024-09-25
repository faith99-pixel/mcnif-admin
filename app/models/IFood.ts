
export type BaseFood = {
  name: string;
  recipes: string[];
  isFeatured: boolean
}
export type FoodRequest = BaseFood & {
  base64ImageUrl: string;
};

export type FoodResponse = BaseFood & FoodRequest &{
  id: string;
  imageUrl: string;
};
