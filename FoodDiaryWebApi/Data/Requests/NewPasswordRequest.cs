namespace FoodDiaryWebApi.Data.Requests
{
    public class NewPasswordRequest
    {
        public Guid Id { get; set; }
        public string NewPassword { get; set; }
    }
}
