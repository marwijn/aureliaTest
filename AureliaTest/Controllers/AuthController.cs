using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

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

  [Route("api/[controller]/[action]")]
  public class AuthController : Controller
  {

    [HttpPost]
    public AccessToken Login([FromBody]UserCredentials credentials)
    {
      string username = credentials.username;
      string password = credentials.password;
      if (username != password) throw new UnauthorizedAccessException();

      var claims = new List<Claim>();

      if (username == "marwijn")
      {
        claims.Add(new Claim("roles", "admin"));
      }

      claims.Add(new Claim("roles", "user"));
      claims.Add(new Claim("userid", username));

      // todo change key.
      var signing = new SigningCredentials(new SymmetricSecurityKey(new byte[32]), SecurityAlgorithms.HmacSha256);

      var jwt = new JwtSecurityToken(
        issuer: "theIssuer",
        audience: "theAudience",
        claims: claims,
        notBefore: DateTime.UtcNow,
        expires: DateTime.UtcNow+TimeSpan.FromHours(24),
        signingCredentials: signing);


      string encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);
      return new AccessToken {access_token = encodedJwt};
    }
  }
}


