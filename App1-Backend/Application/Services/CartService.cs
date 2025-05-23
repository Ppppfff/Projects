using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.DTOs.Cart;
using Application.Interfaces;
using Core.Entities;
using Core.Interfaces;

namespace Application.Services
{
    public class CartService : ICartService
    {
        private readonly ICartRepository _cartRepository;

        public CartService(ICartRepository cartRepository)
        {
            _cartRepository = cartRepository;
        }

        public async Task AddItemToCartAsync(int cartId, int itemId, int quantity)
        {
            await _cartRepository.AddItemToCartAsync(cartId, itemId, quantity);
        }

        public async Task RemoveItemFromCartAsync(int cartId, int itemId)
        {
            await _cartRepository.RemoveItemFromCartAsync(cartId, itemId);
        }

        public async Task ClearCartAsync(int cartId)
        {
            await _cartRepository.ClearCartAsync(cartId);
        }

        public async Task<Cart?> GetCartByIdAsync(int cartId)
        {
            return await _cartRepository.GetCartByIdAsync(cartId);
        }

        public async Task<List<CartItemDto>> GetCartItemsAsync(int cartId)
        {
            var cartItems = await _cartRepository.GetCartItemsAsync(cartId);

            var cartItemDtos = cartItems.Select(ci => new CartItemDto
            {
                Id = ci.Id,
                CartId = ci.CartId,
                ItemName = ci.Item.Name,
                ItemId = ci.ItemId,
                Price = ci.Item.Price,
                Quantity = ci.Quantity,
                ImageUrl = ci.Item.ImageUrl,
            }).ToList();

            return cartItemDtos;

        }
    }
}
