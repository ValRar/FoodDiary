using FoodDiaryWebApi.Data.Responses;
using FoodDiaryWebApi.Services.Implementations.HttpClients;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FoodDiaryWebApi.Controllers
{
    [Route("calories")]
    [ApiController]
    [Authorize]
    public class CaloriesCalculationController : ControllerBase
    {
        private readonly GigachatMessageClient _gigachatClient;

        public CaloriesCalculationController(GigachatMessageClient gigachatClient)
        {
            _gigachatClient = gigachatClient;
        }
        [HttpGet("calculate")]
        public async Task<IActionResult> CalculateCaloriesAsync(string dishes)
        {
            var response = new CaloriesCalculationResponse(await _gigachatClient.GetCaloriesForDishes(dishes));
            return Ok(response);
        }
    }
}
