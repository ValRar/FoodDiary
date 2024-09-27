
namespace FoodDiaryWebApi.Data.Responses
{
    public class CaloriesCalculationResponse
    {
        public int Calories {  get; set; }

        public CaloriesCalculationResponse(int calories)
        {
            Calories = calories;
        }
    }
}
