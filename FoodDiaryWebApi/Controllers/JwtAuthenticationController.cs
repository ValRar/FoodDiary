using FoodDiaryWebApi.Configurations;
using FoodDiaryWebApi.Data.Entities;
using FoodDiaryWebApi.Data.Requests;
using FoodDiaryWebApi.Data.Responses;
using FoodDiaryWebApi.Services.Implementations;
using FoodDiaryWebApi.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NuGet.Common;

namespace FoodDiaryWebApi.Controllers
{
    [Route("auth")]
    [ApiController]
    public class JwtAuthenticationController : ControllerBase
    {
        private readonly FoodDiaryDbContext _db;
        private readonly IJwtTokenGenerator _jwtTokenGenerator;
        private readonly IRefreshTokenService _refreshTokenService;
        private readonly IPasswordRecoveryService _passwordRecoveryService;
        public JwtAuthenticationController(FoodDiaryDbContext db, IJwtTokenGenerator jwtTokenGenerator,
            IRefreshTokenService refreshTokenService, IPasswordRecoveryService passwordRecoveryService)
        {
            _db = db;
            _jwtTokenGenerator = jwtTokenGenerator;
            _refreshTokenService = refreshTokenService;
            _passwordRecoveryService = passwordRecoveryService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(AuthenticationRequest authenticationRequest)
        {
            if (_db.Users.Any(u => u.Email == authenticationRequest.Email))
            {
                return BadRequest(new { ErrorMessage = "User with this email already exists!" });
            }
            var passwordHash = BCrypt.Net.BCrypt.EnhancedHashPassword(authenticationRequest.Password);
            var user = new UserEntity()
            {
                Email = authenticationRequest.Email,
                PasswordHash = passwordHash,
            };
            await _db.Users.AddAsync(user);
            var refreshToken = await _refreshTokenService.CreateToken(user);
            PutRefreshToken(refreshToken);
            var token = _jwtTokenGenerator.GenerateToken(user.Email);
            return Ok(new JwtTokenResponse
            {
                Expires = DateTime.UtcNow.AddMinutes(_jwtTokenGenerator.TokenLifetimeMinutes),
                Token = token
            });
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login(AuthenticationRequest authenticationRequest)
        {
            var user = _db.Users.FirstOrDefault(u => u.Email == authenticationRequest.Email);
            if (user is null)
                return NotFound(new { ErrorMessage = "User with this email not found!" });
            if (!BCrypt.Net.BCrypt.EnhancedVerify(authenticationRequest.Password, user.PasswordHash))
                return BadRequest(new { ErrorMessage = "Provided invalid password!" });
            var refreshToken = await _refreshTokenService.CreateToken(user);
            PutRefreshToken(refreshToken);
            return Ok(CreateTokenResponse(user.Email));
        }
        [HttpGet("refresh")]
        public async Task<IActionResult> Refresh()
        {
            var providedRefreshToken = GetRefreshFromCookie();
            if (providedRefreshToken is null)
                return BadRequest(new { ErrorMessage = "Refresh token not provided!" });
            var newRefreshToken = await _refreshTokenService.UpdateToken(providedRefreshToken);
            if (newRefreshToken is null)
                return BadRequest(new { ErrorMessage = "Invalid refresh token provided!" });
            PutRefreshToken(newRefreshToken);
            var userEmail = _db.RefreshTokens
                .AsNoTracking()
                .Include(t => t.Owner)
                .First(t => t.Value == newRefreshToken)
                .Owner.Email;
            return Ok(CreateTokenResponse(userEmail));
        }
        [HttpPost("request_recovery")]
        public IActionResult RequestRecovery(RecoveryRequest request)
        {
            if (!_db.Users.Any(u => u.Email == request.Email))
                return BadRequest(new { ErrorMessage = "User with this email not exists!" });
            _passwordRecoveryService.CreateRequest(request.Email);
            return NoContent();
        }
        [HttpPost("recover")]
        public async Task<IActionResult> Recover(NewPasswordRequest request)
        {
            var email = _passwordRecoveryService.GetEmailByReqId(request.Id);
            if (email is null)
                return BadRequest(new { ErrorMessage = "Request with this id not exists!" });
            var user = _db.Users.First(u => u.Email == email);
            user.PasswordHash = BCrypt.Net.BCrypt.EnhancedHashPassword(request.NewPassword);
            await _db.SaveChangesAsync();
            return NoContent();
        }
        private void PutRefreshToken(string token) =>
            HttpContext.Response.Cookies.Append(CookieNames.RefreshToken, token, new CookieOptions() { HttpOnly = true });
        private string? GetRefreshFromCookie() => HttpContext.Request.Cookies[CookieNames.RefreshToken];
        private JwtTokenResponse CreateTokenResponse(string email)
        {
            return new JwtTokenResponse()
            {
                Token = _jwtTokenGenerator.GenerateToken(email),
                Expires = DateTime.UtcNow.AddMinutes(_jwtTokenGenerator.TokenLifetimeMinutes),
            };
        }
    }
}
