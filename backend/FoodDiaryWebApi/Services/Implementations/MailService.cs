using FoodDiaryWebApi.Services.Interfaces;

namespace FoodDiaryWebApi.Services.Implementations
{
    public class MailService : IMailService
    {
        private readonly ILogger<MailService> _logger;

        public MailService(ILogger<MailService> logger)
        {
            _logger = logger;
        }
        public void SendPasswordRecoveryMessage(string email, Guid recoveryReqId)
        {
            _logger.LogInformation("Sending mail to address: {}, with recovery ID: {}", email, recoveryReqId.ToString()); // TODO: implement mail sending
        }
    }
}
