namespace FoodDiaryWebApi.Services.Interfaces
{
    public interface IMailService
    {
        void SendPasswordRecoveryMessage(string email, Guid recoveryReqId);
    }
}