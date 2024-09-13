using FoodDiaryWebApi.Data.Entities;

namespace FoodDiaryWebApi.Data.DTO
{
    public class NoteEntry
    {
        public static NoteEntry MapFromEntity(NoteEntryEntity entity)
        {
            return new NoteEntry
            {
                Id = entity.Id,
                Calories = entity.Calories,
                Dish = entity.Dish,
            };
        }
        public long Id { get; set; }
        public string Dish { get; set; }
        public int? Calories { get; set; }
    }
}
