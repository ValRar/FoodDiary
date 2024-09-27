using FoodDiaryWebApi.Data.Entities;
using System.ComponentModel.DataAnnotations;

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
        [Required]
        public string Dish { get; set; }
        [Range(0, int.MaxValue)]
        public int? Calories { get; set; }
    }
}
