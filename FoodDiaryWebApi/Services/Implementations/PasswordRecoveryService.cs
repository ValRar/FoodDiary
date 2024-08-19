using FoodDiaryWebApi.Services.Interfaces;

namespace FoodDiaryWebApi.Services.Implementations
{
    public class PasswordRecoveryService : IPasswordRecoveryService
    {
        private readonly Dictionary<Guid, string> _requestsStorage;
        private readonly IMailService _mailService;
        public PasswordRecoveryService(IMailService mailService)
        {
            _requestsStorage = new Dictionary<Guid, string>();
            _mailService = mailService;
        }
        public void CreateRequest(string email)
        {
            var requestId = Guid.NewGuid();
            _mailService.SendPasswordRecoveryMessage(email, requestId);
            _requestsStorage.Add(requestId, email);
            Task.Run(async () =>
            {
                await Task.Delay(TimeSpan.FromMinutes(20)); // TODO: change delay after debug
                _requestsStorage.Remove(requestId);
            });
        }
        public string? GetEmailByReqId(Guid reqId)
        {
            var email = _requestsStorage.GetValueOrDefault(reqId);
            _requestsStorage.Remove(reqId);
            return email;
        }
    }
}
