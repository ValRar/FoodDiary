using System.ComponentModel.DataAnnotations;

namespace FoodDiaryWebApi.Data.Requests
{
    public class RecoveryRequest
    {
        [Required]
        public string Email { get; set; }
    }
}
