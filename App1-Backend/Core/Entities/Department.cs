using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Entities
{
    public class Department
    {
        public int id { get; set; }
        public string name { get; set; }
        public ICollection<Item> Items { get; set; } = new List<Item>();
    }
}
