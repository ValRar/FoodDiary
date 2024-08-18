namespace FoodDiaryWebApi.Data.Entities
{
    public class RefreshTokenEntity
    {
        public long Id { get; set; }
        public UserEntity Owner { get; set; }
        public Guid SessionId { get; set; }
        public string Value { get; set; }
        public DateTime Expires { get; set; }
    }
}
