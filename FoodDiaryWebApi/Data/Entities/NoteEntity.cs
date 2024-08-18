namespace FoodDiaryWebApi.Data.Entities
{
    public class NoteEntity
    {
        public long Id { get; set; }
        public UserEntity Author { get; set; }
        public string Text { get; set; }
        public DateTime CreationTime { get; set; }
    }
}
