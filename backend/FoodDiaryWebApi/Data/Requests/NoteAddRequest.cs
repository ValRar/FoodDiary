using FoodDiaryWebApi.Data.DTO;
using System.ComponentModel.DataAnnotations;

namespace FoodDiaryWebApi.Data.Requests
{
    public class NoteAddRequest
    {
        [Required]
        [MinLength(1)]
        public NoteEntry[] Entries { get; set; }
    }
}
