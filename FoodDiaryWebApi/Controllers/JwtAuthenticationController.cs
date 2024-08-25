using FoodDiaryWebApi.Configurations;
using FoodDiaryWebApi.Data.Entities;
using FoodDiaryWebApi.Data.Requests;
using FoodDiaryWebApi.Services.Implementations;
using FoodDiaryWebApi.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
            var session = _refreshTokenService.CreateSession(user);
            PutRefreshToken(session.Item2);
            PutSessionId(session.Item1);
            await _db.Users.AddAsync(user);
            await _db.SaveChangesAsync();
            return Ok(new { Token = _jwtTokenGenerator.GenerateToken(user.Email) });
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login(AuthenticationRequest authenticationRequest)
        {
            var user = _db.Users.FirstOrDefault(u => u.Email == authenticationRequest.Email);
            if (user is null)
                return NotFound(new { ErrorMessage = "User with this email not found!" });
            if (!BCrypt.Net.BCrypt.EnhancedVerify(authenticationRequest.Password, user.PasswordHash))
                return BadRequest(new { ErrorMessage = "Provided invalid password!" });
            var session = _refreshTokenService.CreateSession(user);
            PutRefreshToken(session.Item2);
            PutSessionId(session.Item1);
            await _db.SaveChangesAsync();
            return Ok(new { Token = _jwtTokenGenerator.GenerateToken(user.Email) });
        }
        [HttpGet("refresh")]
        public async Task<IActionResult> Refresh()
        {
            var providedRefreshToken = HttpContext.Request.Cookies.FirstOrDefault(c => c.Key == Constants.REFRESH_TOKEN_COOKIE).Value;
            if (providedRefreshToken is null)
                return BadRequest(new { ErrorMessage = "Refresh token not provided!" });
            var providedSessionId = GetSessionFromCookie();
            if (providedSessionId is null)
                return BadRequest(new { ErrorMessage = "Session id not provided!" });
            var tokensPair = await _refreshTokenService.GetTokenAndRefresh(Guid.Parse(providedSessionId));
            if (tokensPair is null)
                return BadRequest(new { ErrorMessage = "Invalid session id provided!" });
            if (providedRefreshToken != tokensPair.Item1)
                return BadRequest(new { ErrorMessage = "Invalid refresh token provided!" });
            PutRefreshToken(tokensPair.Item2);
            var userEmail = _db.RefreshTokens.AsNoTracking().Include(t => t.Owner).First(t => t.SessionId == Guid.Parse(providedSessionId)).Owner.Email;
            return Ok(new { Token = _jwtTokenGenerator.GenerateToken(userEmail) });
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
        private void PutSessionId(Guid sessionId)
        {
            HttpContext.Response.Cookies.Append(Constants.SESSION_COOKIE, sessionId.ToString(), new CookieOptions() { HttpOnly = true });
        }
        private void PutRefreshToken(string token) =>
            HttpContext.Response.Cookies.Append(Constants.REFRESH_TOKEN_COOKIE, token, new CookieOptions() { HttpOnly = true });
        private string? GetSessionFromCookie() => HttpContext.Request.Cookies[Constants.SESSION_COOKIE];
    }
}
