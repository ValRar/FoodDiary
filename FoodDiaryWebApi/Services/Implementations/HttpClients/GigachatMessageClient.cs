using FoodDiaryWebApi.Configurations;
using Microsoft.AspNetCore.ResponseCaching;
using Microsoft.Extensions.Options;

namespace FoodDiaryWebApi.Services.Implementations.HttpClients
{
    public class GigachatMessageClient
    {
        private const string _requestContentJson = @"{{
          ""model"": ""{0}"",
          ""messages"": [
            {{
              ""role"": ""system"",
              ""content"": ""Ты должен определить количество калорий в приведённом списке блюд. Твой ответ должен быть максимально кратким и содержать только количество калорий в ккал""
            }},
            {{
              ""role"": ""user"",
              ""content"": ""{1}""
            }}
          ],
          ""n"": 1,
          ""stream"": false,
          ""update_interval"": 0
        }}";
        private readonly HttpClient _httpClient;
        private readonly string _model;
        private readonly ILogger<GigachatMessageClient> _logger;
        public GigachatMessageClient(HttpClient client, IOptions<GigachatConfiguration> options, ILogger<GigachatMessageClient> logger)
        {
            _httpClient = client;
            _model = options.Value.Model;
            _logger = logger;
        }
        public async Task<int> GetCaloriesForDishes(string dishes)
        {
            dishes = dishes.Replace('"', '\'');
            var request = new HttpRequestMessage(HttpMethod.Post, "https://gigachat.devices.sberbank.ru/api/v1/chat/completions");
            var bearerToken = GigachatJWTStorage.Token;
            if (bearerToken is null)
            {
                throw new ArgumentNullException(nameof(GigachatJWTStorage.Token));
            }
            request.Headers.Add("Authorization", $"Bearer {bearerToken}");
            request.Content = new StringContent(string.Format(_requestContentJson, _model, dishes));
            var response = await _httpClient.SendAsync(request);
            response.EnsureSuccessStatusCode();
            var responseText = await response.Content.ReadAsStringAsync();
            return parseResponseText(responseText);
        }
        private int parseResponseText(string responseText)
        {
            var content = responseText.Skip(35).TakeWhile(c => c != '"' && c != ' ').ToArray();
            return int.Parse(content);
        }
    }
}
