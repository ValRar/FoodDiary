using FoodDiaryWebApi.Data.DTO;

namespace FoodDiaryWebApi.Data.Requests
{
    public class NoteAddRequest
    {
        public NoteEntry[] Entries { get; set; }
    }
}
