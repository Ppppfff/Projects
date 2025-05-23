using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Cart
{
    public class CartItemDto
    {
        public int Id { get; set; }
        public int CartId { get; set; }
        public string ItemName { get; set; }
        public int ItemId { get; set; }
        public float Price { get; set; }
        public int Quantity { get; set; }
        public string ImageUrl { get; set; }
    }
}
