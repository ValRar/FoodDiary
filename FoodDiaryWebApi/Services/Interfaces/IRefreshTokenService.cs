using FoodDiaryWebApi.Data.Entities;

namespace FoodDiaryWebApi.Services.Interfaces
{
    public interface IRefreshTokenService
    {
        Task<string> CreateToken(UserEntity user);
        public Task<string?> UpdateToken(string providedRefreshToken);
        void RemoveToken(string refreshToken);
    }
}