using FoodDiaryWebApi.Configurations;
using FoodDiaryWebApi.Data.DTO;
using Microsoft.Extensions.Options;

namespace FoodDiaryWebApi.Services.Implementations.HttpClients
{
    public class GigachatAuthClient
    {
        private readonly HttpClient _httpClient;
        private GigachatConfiguration _configuration;
        public GigachatAuthClient(HttpClient client, IOptions<GigachatConfiguration> options)
        {
            _httpClient = client;
            _configuration = options.Value;
        }
        public async Task<GigachatAuthenticationResponse> SendRequest()
        {
            var response = await _httpClient.SendAsync(CreateMessage());
            response.EnsureSuccessStatusCode();
            var parsedResponse = await response.Content.ReadFromJsonAsync<GigachatAuthenticationResponse>();
            if (parsedResponse is null)
            {
                throw new ArgumentNullException($"{nameof(parsedResponse)}");
            }
            return parsedResponse;
        }
        private HttpRequestMessage CreateMessage()
        {
            var request = new HttpRequestMessage(HttpMethod.Post, "https://ngw.devices.sberbank.ru:9443/api/v2/oauth");
            request.Headers.Add("Authorization", $"Basic {_configuration.Credentials}");
            var defaultBody = new FormUrlEncodedContent([new KeyValuePair<string, string>("scope", _configuration.Scope)]);
            request.Content = defaultBody;
            request.Headers.Add("RqUID", Guid.NewGuid().ToString());
            return request;
        }
    }
}
