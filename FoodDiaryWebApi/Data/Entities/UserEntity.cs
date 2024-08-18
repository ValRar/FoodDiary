namespace FoodDiaryWebApi.Data.Entities
{
    public class UserEntity
    {
        public long? Id { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public List<RefreshTokenEntity> RefreshTokens { get; set; } = new List<RefreshTokenEntity>();
        public NoteEntity[]? Notes { get; set; }
    }
}
