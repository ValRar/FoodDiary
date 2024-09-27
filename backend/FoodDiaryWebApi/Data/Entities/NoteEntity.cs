namespace FoodDiaryWebApi.Data.Entities
{
    public class NoteEntity
    {
        public long Id { get; set; }
        public long AuthorId { get; set; }
        public UserEntity Author { get; set; }
        public List<NoteEntryEntity> Entries { get; set; } = new List<NoteEntryEntity>();
        public DateTime CreationTime { get; set; }
    }
}
