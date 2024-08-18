using FoodDiaryWebApi.Configurations;
using FoodDiaryWebApi.Data.Entities;
using FoodDiaryWebApi.Data.Requests;
using FoodDiaryWebApi.Services.Implementations;
using FoodDiaryWebApi.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FoodDiaryWebApi.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class JwtAuthenticationController : ControllerBase
    {
        private readonly FoodDiaryDbContext _db;
        private readonly IJwtTokenGenerator _jwtTokenGenerator;
        private readonly IRefreshTokenService _refreshTokenService;
        public JwtAuthenticationController(FoodDiaryDbContext db, IJwtTokenGenerator jwtTokenGenerator, IRefreshTokenService refreshTokenService)
        {
            _db = db;
            _jwtTokenGenerator = jwtTokenGenerator;
            _refreshTokenService = refreshTokenService;
        }

        [HttpPost("register")]
        public async Task<IResult> Register(AuthenticationRequest authenticationRequest)
        {
            if (_db.Users.Any(u => u.Email == authenticationRequest.Email))
            {
                return TypedResults.BadRequest(new { ErrorMessage = "User with this email already exists!" });
            }
            var passwordHash = BCrypt.Net.BCrypt.EnhancedHashPassword(authenticationRequest.Password);
            var user = new UserEntity()
            {
                Email = authenticationRequest.Email,
                PasswordHash = passwordHash,
            };
            var session = _refreshTokenService.CreateSession(user);
            PutRefreshTokenAndSession(session);
            await _db.Users.AddAsync(user);
            await _db.SaveChangesAsync();
            return TypedResults.Ok(new { Token = _jwtTokenGenerator.GenerateToken(user.Email) });
        }
        [HttpPost("login")]
        public async Task<IResult> Login(AuthenticationRequest authenticationRequest)
        {
            var user = _db.Users.FirstOrDefault(u => u.Email == authenticationRequest.Email);
            if (user == null)
                return TypedResults.NotFound(new { ErrorMessage = "User with this email not found!" });
            if (!BCrypt.Net.BCrypt.EnhancedVerify(authenticationRequest.Password, user.PasswordHash))
                return TypedResults.BadRequest(new { ErrorMessage = "Provided invalid password!" });
            var session = _refreshTokenService.CreateSession(user);
            PutRefreshTokenAndSession(session);
            await _db.SaveChangesAsync();
            return TypedResults.Ok(new { Token = _jwtTokenGenerator.GenerateToken(user.Email) });
        }
        [HttpGet("refresh")]
        public async Task<IResult> Refresh()
        {
            var userEmail = HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)!.Value;
            var providedRefreshToken = HttpContext.Request.Cookies.FirstOrDefault(c => c.Key == Constants.REFRESH_TOKEN_COOKIE).Value;
            if (providedRefreshToken == null)
                return TypedResults.BadRequest(new { ErrorMessage = "Refresh token not provided!" });
            var providedSessionId = GetSessionFromCookie();
            if (providedSessionId == null)
                return TypedResults.BadRequest(new { ErrorMessage = "Session id not provided!" });
            var tokensPair = await _refreshTokenService.GetTokenAndRefresh(Guid.Parse(providedSessionId));
            if (tokensPair == null)
                return TypedResults.BadRequest(new { ErrorMessage = "Invalid session id provided!" });
            if (providedRefreshToken != tokensPair.Item1)
                return TypedResults.BadRequest(new { ErrorMessage = "Invalid refresh token provided!" });
            PutRefreshToken(tokensPair.Item2);
            return TypedResults.Ok(new { Token = _jwtTokenGenerator.GenerateToken(userEmail) });
        }
        private void PutRefreshTokenAndSession(Tuple<Guid, string> session)
        {
            HttpContext.Response.Cookies.Append(Constants.SESSION_COOKIE, session.Item1.ToString(), new CookieOptions() { HttpOnly = true });
            HttpContext.Response.Cookies.Append(Constants.REFRESH_TOKEN_COOKIE, session.Item2, new CookieOptions() { HttpOnly = true });
        }
        private void PutRefreshToken(string token) => 
            HttpContext.Response.Cookies.Append(Constants.REFRESH_TOKEN_COOKIE, token, new CookieOptions() { HttpOnly = true });
        private string? GetSessionFromCookie() => HttpContext.Request.Cookies[Constants.SESSION_COOKIE];
    }
}
