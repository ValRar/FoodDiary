using FoodDiaryWebApi.Data.Entities;

namespace FoodDiaryWebApi.Services.Interfaces
{
    public interface IRefreshTokenService
    {
        Tuple<Guid, string> CreateSession(UserEntity user);
        public Task<Tuple<string, string>?> GetTokenAndRefresh(Guid sessionId);
        void RemoveSession(Guid sessionId);
    }
}