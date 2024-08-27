using FoodDiaryWebApi.Configurations;
using FoodDiaryWebApi.Services.Implementations;
using FoodDiaryWebApi.Services.Implementations.HttpClients;
using FoodDiaryWebApi.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddEnvironmentVariables();

// Add services to the container.

builder.Services.AddControllers();

builder.Services.Configure<JwtConfiguration>(builder.Configuration.GetSection("Jwt"));
builder.Services.Configure<GigachatConfiguration>(builder.Configuration.GetSection("Gigachat"));

builder.Services.AddScoped<IRefreshTokenService, RefreshTokenService>();

builder.Services.AddSingleton<IJwtTokenGenerator, JwtTokenGenerator>();
builder.Services.AddSingleton<IPasswordRecoveryService, PasswordRecoveryService>();
builder.Services.AddSingleton<IMailService, MailService>();

builder.Services.AddHostedService<GigachatAuthBgService>();

builder.Services.AddHttpClient<GigachatAuthClient>();
builder.Services.AddHttpClient<GigachatMessageClient>();

builder.Services.AddDbContext<FoodDiaryDbContext>();

var securityKey = builder.Configuration.GetSection("Jwt")["SecurityKey"];

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new()
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(securityKey!)
            )
    };
});
builder.Services.AddAuthorization();


var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
