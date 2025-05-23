using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core.Entities;

namespace Core.Interfaces
{
    public interface ICartRepository
    {
        Task AddItemToCartAsync(int cartId, int itemId, int quantity);
        Task RemoveItemFromCartAsync(int cartId, int itemId);
        Task ClearCartAsync(int cartId);
        Task<Cart?> GetCartByIdAsync(int cartId);
        Task<List<CartItem>> GetCartItemsAsync(int cartId);
    }
}
