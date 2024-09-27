using FoodDiaryWebApi.Configurations;
using FoodDiaryWebApi.Services.Implementations;
using FoodDiaryWebApi.Services.Implementations.HttpClients;
using FoodDiaryWebApi.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using System.Text;


Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File("log.txt")
    .CreateLogger();

var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddEnvironmentVariables();

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddSerilog();

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

builder.Services.AddCookiePolicy(options =>
{
    options.HttpOnly = Microsoft.AspNetCore.CookiePolicy.HttpOnlyPolicy.Always;
    options.Secure = CookieSecurePolicy.Always;
});
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(options =>
    {
        options.WithOrigins(builder.Configuration.GetValue<string>("AllowedHost") ?? "")
        .AllowCredentials()
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});

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

if (app.Environment.IsDevelopment())
{
    Log.Logger.Information("Enabling CORS.");
    app.UseCors();
}

app.UseCookiePolicy();
app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
