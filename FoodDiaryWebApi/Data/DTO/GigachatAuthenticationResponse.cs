using System.Text.Json.Serialization;

namespace FoodDiaryWebApi.Data.DTO
{
    public class GigachatAuthenticationResponse
    {
        [JsonPropertyName("access_token")]
        public string AccessToken { get; set; }
        [JsonPropertyName("expires_at")]
        public long ExpiresAt { get; set; }
    }
}
