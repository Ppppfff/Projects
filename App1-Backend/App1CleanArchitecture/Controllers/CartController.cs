using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace App1CleanArchitecture.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;

        public CartController(ICartService cartService)
        {
            _cartService = cartService;
        }

        [HttpPost("{cartId}/add-item")]
        public async Task<IActionResult> AddItemToCart(int cartId, int itemId, int quantity)
        {
            await _cartService.AddItemToCartAsync(cartId, itemId, quantity);
            return Ok("Item added to cart.");
        }

        [HttpDelete("{cartId}/remove-item")]
        public async Task<IActionResult> RemoveItemFromCart(int cartId, int itemId)
        {
            await _cartService.RemoveItemFromCartAsync(cartId, itemId);
            return Ok("Item removed from cart.");
        }

        [HttpDelete("{cartId}/clear")]
        public async Task<IActionResult> ClearCart(int cartId)
        {
            await _cartService.ClearCartAsync(cartId);
            return Ok("Cart cleared.");
        }

        [HttpGet("{cartId}")]
        public async Task<IActionResult> GetCartById(int cartId)
        {
            var cart = await _cartService.GetCartByIdAsync(cartId);
            if (cart == null)
                return NotFound("Cart not found.");

            return Ok(cart);
        }

        [HttpGet("{cartId}/items")]
        public async Task<IActionResult> GetCartItems(int cartId)
        {
            var cartItems = await _cartService.GetCartItemsAsync(cartId);
            return Ok(cartItems);
        }
    }
}
