
namespace FoodDiaryWebApi.Data.Responses
{
    public class NoteResponse
    {
        public long Id { get; set; }
        public string Content { get; set; }
        public int? Calories { get; set; }
        public DateTime CreationTime { get; set; }
    }
}
