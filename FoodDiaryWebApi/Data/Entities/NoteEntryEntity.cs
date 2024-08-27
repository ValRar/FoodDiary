using FoodDiaryWebApi.Data.DTO;

namespace FoodDiaryWebApi.Data.Entities
{
    public class NoteEntryEntity
    {
        public static NoteEntryEntity MapFromDTO(NoteEntry noteEntry)
        {
            return new NoteEntryEntity
            {
                Calories = noteEntry.Calories,
                Dish = noteEntry.Dish,
            };
        }
        public long Id { get; set; }
        public string Dish { get; set; }
        public int? Calories { get; set; }
    }
}
