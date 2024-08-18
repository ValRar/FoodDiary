using FoodDiaryWebApi.Data.Entities;
using FoodDiaryWebApi.Services.Interfaces;

namespace FoodDiaryWebApi.Services.Implementations
{
    public class RefreshTokenService : IRefreshTokenService
    {
        private readonly FoodDiaryDbContext _dbContext;

        public RefreshTokenService(FoodDiaryDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Tuple<string, string>?> GetTokenAndRefresh(Guid sessionId)
        {
            var token = _dbContext.RefreshTokens.FirstOrDefault(t => t.SessionId == sessionId);
            if (token == null)
                return null;
            if (token?.Expires < DateTime.UtcNow)
            {
                _dbContext.RefreshTokens.Remove(token);
                await _dbContext.SaveChangesAsync();
                return null;
            }
            var oldToken = token.Value;
            token.Value = GenerateRefreshToken();
            await _dbContext.SaveChangesAsync();
            return new (oldToken, token.Value);
        }

        public Tuple<Guid, string> CreateSession(UserEntity user)
        {
            var sessionId = Guid.NewGuid();
            var tokenValue = GenerateRefreshToken();
            user.RefreshTokens.Add(new RefreshTokenEntity { SessionId = sessionId, Expires = DateTime.UtcNow.AddDays(30), Value = tokenValue });
            return new(sessionId, tokenValue);
        }
        public async void RemoveSession(Guid sessionId)
        {
            var token = _dbContext.RefreshTokens.FirstOrDefault(t => t.SessionId == sessionId);
            if (token == null)
                return;
            _dbContext.Remove(token);
            await _dbContext.SaveChangesAsync();
        }
        private string GenerateRefreshToken()
        {
            var bytes = new byte[32];
            Random.Shared.NextBytes(bytes);
            return Convert.ToBase64String(bytes);
        }
    }
}
