namespace FoodDiaryWebApi.Data.Responses
{
    public class JwtTokenResponse
    {
        public string Token { get; set; }
        public DateTime Expires { get; set; }
    }
}
