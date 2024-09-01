using FoodDiaryWebApi.Configurations;
using FoodDiaryWebApi.Services.Interfaces;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace FoodDiaryWebApi.Services.Implementations
{
    public class JwtTokenGenerator : IJwtTokenGenerator
    {
        private readonly SigningCredentials _signingCredentials;
        private readonly IOptions<JwtConfiguration> _options;
        public int TokenLifetimeMinutes {  get; private set; }

        public JwtTokenGenerator(IOptions<JwtConfiguration> options)
        {
            _signingCredentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(options.Value.SecurityKey)), SecurityAlgorithms.HmacSha256);
            _options = options;
            TokenLifetimeMinutes = options.Value.ExpiresMinutes;
        }
        public string GenerateToken(string email)
        {
            var token = new JwtSecurityToken(signingCredentials: _signingCredentials,
                expires: DateTime.UtcNow.AddMinutes(_options.Value.ExpiresMinutes),
                claims: [new Claim(ClaimTypes.Email, email)]);
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
