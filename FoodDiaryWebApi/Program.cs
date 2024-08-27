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

app.MapGet("/", async (HttpContext context, GigachatAuthClient gigachatAuthClient, GigachatMessageClient messageClient, [FromQuery] string dishes) =>
{
    //var token = (await gigachatAuthClient.SendRequest()).AccessToken;
    //GigachatJWTStorage.Token = token;
    GigachatJWTStorage.Token = "eyJjdHkiOiJqd3QiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwiYWxnIjoiUlNBLU9BRVAtMjU2In0.KyPHQBLY4t7A30Y3UXe65ninhmqsIlxdCpHyiafeCN85V4h7y0u3vDTK_b5c2m9xowcGqaHWYasfAlcLPBa1c-3Zw6H-K9sULLqgcdndD8PPzZzDAQiAiwJXy8W7ysfaWsr0CSMNT1wJTCd1ONp5zQXs5SkdNZiqsRwkekSJ99FNFla-plzBNyQ3HRvrrqQqSaQwPxREXvplp0Dv9r4t_t19UxNUIDAcwHbaAOimrWg6UETitJ9EZ15KCrWYFimsNe_73e8RMIaVBqilkC5wZUWg9Y4Gr_XzoR5n3J_PwA0GGvrQ-j5Fw48Dr4vXbeU6hlIv7vr5f40ujGTN6_Kmlw.jvqOF1hS28HQBcOphSt8HQ.S28E5MH9_N_fj5TKcS8GZXK4AXNP1oaDjvJ4VAb4x4Bp2SfsCEYxn-T_9Y4nxArab-QP6uI9F6QdbHcFphxYaVZBx5khZ86TuQknLYBimrMVLp4L_nn96CKWddedS5IMVC0W5bnHHlcOAadCllQfK1astdVWku1eV2s33FioLJIrBPg05oRcE1yupi8vCSbN3oU9lPaK0SSztlUFvK4pt8iS_8uVooIW1vHMJYKl-7dsFt5xAOM9M1y7snbLZnFKCtNKauobzthQxbJ_e_FTIolAXhsdYKNaODmVFAsPbi7_d0Lq5k6SMqNYAZ2WNTQ8v5U2G5WDEHyIDFmVaN8yh0gF6ArJQeoRgxbBCafmXZ51wpornodWWSouSemUlHX6DVhUFsBgvD9dJzQcasgZuV-4bTxNbkCS2Z5h3Ijuf_WmADuqZHZF3YLZD3uO2XF8HBjfRIx_neqVy8OlSGCM87Wtf0lLTxif48M-hfraCPNaCm8iqK24dOuiubO-9460tCuoRbdPZ4wTVlgMpArEKVOy6iaCF10OB90bsWVYAcrgV0CZBGVVLQnjZ8dAe6uE-XhHQQJLHux_hJaTw0RJ73_O636XEvlk6Hmx1Lv0VAYNKTloQVh99MWlVwojJjKFkkRo_-iKYat_ISwtb-Z0_WQwkXEfZNlJImzKMVy0sM19w1Yb0lK90XejEsKJHD7xSVWe7-1XwZj40l0244Vi0PteHx_QJp6LBuyogB3nS5E.MurW-X1k5M43fkPtK-NkAcoVpYly3oXJMkfffPabjdM";
    var res = await messageClient.GetCaloriesForDishes(dishes);
    return res;
});

app.Run();
