namespace FoodDiaryWebApi.Services.Interfaces
{
    public interface IPasswordRecoveryService
    {
        void CreateRequest(string email);
        string? GetEmailByReqId(Guid reqId);
    }
}