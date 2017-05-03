using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http.Headers;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Protocols;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Linq;

namespace AureliaTest.Controllers
{

  public class AccessToken
  {
    public string access_token { get; set; }
  }

  public class UserCredentials
  {
    public string username { get; set; }
    public string password { get; set; }
  }

  public class OpenIdToken
  {
    public string clientId { get; set; }
    public string redirectUri { get; set; }
    public string state { get; set; }
    public string code { get; set; }
    public string authuser { get; set; }
    public string session_state { get; set; }
    public string prompt { get; set; }
    public string consent { get; set; }
  }

  [Route("api/[controller]/[action]")]
  public class AuthController : Controller
  {

    [HttpPost]
    public AccessToken Login([FromBody] dynamic credentials)
    {
      string username = credentials.username;
      string password = credentials.password;
      if (username != password) throw new UnauthorizedAccessException();

      if (username == "marwijn")
      {
        return CreateAccessToken("marwijn", new[] { "admin", "user" });
      }
      return CreateAccessToken(username, new[] { "admin", "user" });
    }

    [HttpPost]
    public async Task<AccessToken> Google([FromBody] OpenIdToken token)
    {
      var openIdConfig = await OpenIdConnectConfiguration("https://accounts.google.com");

      var claims = await GetOpenIdClaims(token, openIdConfig);

      var idClaim = claims.Claims.Single(c => c.Type == ClaimTypes.NameIdentifier);
      if (idClaim.Value == "100554319379838513055")
      {
        return CreateAccessToken("google marwijn", new[] { "user", "admin" });
      }

      return null;
    }

    private static async Task<ClaimsPrincipal> GetOpenIdClaims(OpenIdToken token, OpenIdConnectConfiguration openIdConfig)
    {
      ClaimsPrincipal claims;
      using (var client = new HttpClient())
      {
        var content = new FormUrlEncodedContent(new[]
        {
          new KeyValuePair<string, string>("code", token.code),
          new KeyValuePair<string, string>("client_id", token.clientId),
          new KeyValuePair<string, string>("client_secret", "IZU-xYB1tK7yb5aB44D2EoJP"),
          new KeyValuePair<string, string>("redirect_uri", token.redirectUri),
          new KeyValuePair<string, string>("grant_type", "authorization_code"),
        });

        var result = await client.PostAsync(openIdConfig.TokenEndpoint, content);
        var resultContent = await result.Content.ReadAsStringAsync();
        
        JObject jo = JObject.Parse(resultContent);
        TokenValidationParameters validationParameters =
          new TokenValidationParameters
          {
            ValidIssuer = "",
            ValidAudiences = new[] { "" },
            IssuerSigningKeys = openIdConfig.SigningKeys,
            ValidateAudience = false,
            ValidateIssuer = false,
          };

        SecurityToken validatedToken;
        JwtSecurityTokenHandler handler = new JwtSecurityTokenHandler();
        claims = handler.ValidateToken((string)jo["id_token"], validationParameters, out validatedToken);
      }
      return claims;
    }

    private static async Task<OpenIdConnectConfiguration> OpenIdConnectConfiguration(string address)
    {
      IConfigurationManager<OpenIdConnectConfiguration> configurationManager =
        new ConfigurationManager<OpenIdConnectConfiguration>(
          address + "/.well-known/openid-configuration", new OpenIdConnectConfigurationRetriever());
      OpenIdConnectConfiguration openIdConfig =
        await configurationManager.GetConfigurationAsync(CancellationToken.None);
      return openIdConfig;
    }

    private static AccessToken CreateAccessToken(string userId, string[] roles)
    {
      var claims = new List<Claim>();

      foreach (string role in roles)
      {
        claims.Add(new Claim("roles", role));
      }
      claims.Add(new Claim("userid", userId));

      var signing = new SigningCredentials(new SymmetricSecurityKey(new byte[32]), SecurityAlgorithms.HmacSha256);

      var jwt = new JwtSecurityToken(
        issuer: "theIssuer",
        audience: "theAudience",
        claims: claims,
        notBefore: DateTime.UtcNow,
        expires: DateTime.UtcNow + TimeSpan.FromHours(24),
        signingCredentials: signing);


      string encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);
      return new AccessToken { access_token = encodedJwt };
    }
  }
}


