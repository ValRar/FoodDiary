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

        public async Task<string?> UpdateToken(string providedRefreshToken)
        {
            var token = _dbContext.RefreshTokens
                .FirstOrDefault(t => t.Value == providedRefreshToken);
            if (token is null)
                return null;
            if (token.Expires < DateTime.UtcNow)
            {
                _dbContext.RefreshTokens.Remove(token);
                await _dbContext.SaveChangesAsync();
                return null;
            }
            token.Value = GenerateRefreshToken();
            token.Expires = DateTime.UtcNow.AddDays(30);
            await _dbContext.SaveChangesAsync();
            return token.Value;
        }

        public async Task<string> CreateToken(UserEntity user)
        {
            var tokenValue = GenerateRefreshToken();
            user.RefreshTokens.Add(new RefreshTokenEntity
            {
                Value = tokenValue,
                Expires = DateTime.UtcNow.AddDays(30),
            });
            await _dbContext.SaveChangesAsync();
            return tokenValue;
        }
        public async void RemoveToken(string refreshToken)
        {
            var token = _dbContext.RefreshTokens.FirstOrDefault(t => t.Value == refreshToken);
            if (token is null)
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
