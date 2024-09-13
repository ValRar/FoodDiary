
using FoodDiaryWebApi.Services.Implementations.HttpClients;

namespace FoodDiaryWebApi.Services.Implementations
{
    public class GigachatAuthBgService : BackgroundService
    {
        private readonly GigachatAuthClient _client;
        private readonly ILogger<GigachatAuthBgService> _logger;

        public GigachatAuthBgService(GigachatAuthClient client, ILogger<GigachatAuthBgService> logger)
        {
            _client = client;
            _logger = logger;
        }
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    var response = await _client.SendRequest();
                    GigachatJWTStorage.Token = response.AccessToken;
                    await Task.Delay(CalculateDelayTo(response.ExpiresAt) - 10_000, stoppingToken);
                } catch (HttpRequestException e)
                {
                    _logger.LogError(e, "Error occured while obtaining Gigachat JWT token.");
                    await Task.Delay(5000, stoppingToken);
                }
            }
        }
        private static int CalculateDelayTo(long unixTimeMs)
        {
            long currentUnixTime = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
            return (int) (unixTimeMs - currentUnixTime);
        }
    }
}
