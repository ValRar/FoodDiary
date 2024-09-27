using System.ComponentModel.DataAnnotations;

namespace FoodDiaryWebApi.Data.Requests
{
    public class NewPasswordRequest
    {
        [Required]
        public Guid Id { get; set; }
        [Required]
        public string NewPassword { get; set; }
    }
}
