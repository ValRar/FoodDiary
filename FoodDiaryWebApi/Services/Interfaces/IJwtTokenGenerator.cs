namespace FoodDiaryWebApi.Services.Interfaces
{
    public interface IJwtTokenGenerator
    {
        string GenerateToken(string email);
    }
}