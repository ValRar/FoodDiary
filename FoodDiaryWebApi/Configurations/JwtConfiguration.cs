namespace FoodDiaryWebApi.Configurations
{
    public class JwtConfiguration
    {
        public string SecurityKey { get; set; }
        public int ExpiresHours { get; set; }
    }
}
