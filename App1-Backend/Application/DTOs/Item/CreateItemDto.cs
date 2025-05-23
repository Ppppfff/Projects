using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Item
{
    public class CreateItemDto
    {
        public int Department_id { get; set; }
        public string Name { get; set; }
        public float Price { get; set; }
        public string? ImageUrl { get; set; }
    }
}
