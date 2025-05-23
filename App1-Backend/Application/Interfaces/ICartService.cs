using Application.DTOs.Cart;
using Core.Entities;

namespace Application.Interfaces
{
    public interface ICartService
    {
        Task AddItemToCartAsync(int cartId, int itemId, int quantity);
        Task RemoveItemFromCartAsync(int cartId, int itemId);
        Task ClearCartAsync(int cartId);
        Task<Cart?> GetCartByIdAsync(int cartId);
        Task<List<CartItemDto>> GetCartItemsAsync(int cartId);

    }
}
