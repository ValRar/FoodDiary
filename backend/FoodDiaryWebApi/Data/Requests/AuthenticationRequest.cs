using System.ComponentModel.DataAnnotations;

namespace FoodDiaryWebApi.Data.Requests
{
    public record AuthenticationRequest([Required] string Email, [Required] string Password);
}
