using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AureliaTest.Controllers
{
  public class Test
  {
    public string X { get; set; }
  }

  [Route("api/[controller]/[action]")]
  public class ValuesController : Controller
  {
    private static readonly List<string> values = new List<string>(new[] { "value1", "value2" });

    [HttpPost]
    [Authorize(Roles = "admin, user")]
    public IEnumerable<string> Values()
    {
      return values;
    }

    [HttpPost]
    public Test GetValue([FromBody] int id)
    {
      return new Test { X = values[id]};
    }

    // POST api/values
    [HttpPost]
    [Authorize(Roles = "admin")]
    public void AddValue([FromBody]string value)
    {
      values.Add(value);
    }
  }
}
