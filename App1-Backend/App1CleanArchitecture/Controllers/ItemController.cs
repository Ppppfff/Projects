using System.Runtime.Intrinsics.X86;
using Application.DTOs.Item;
using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace App1CleanArchitecture.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ItemController : Controller
    {
        private readonly IItemService _itemService;

        public ItemController(IItemService itemService)
        {
            _itemService = itemService;
        }

        [HttpGet("GetItems")]
        public async Task<IActionResult> GetItems()
        {
            var items = await _itemService.GetItemAsync();
            return Ok(items);
        }

        [HttpGet("GetItemsByDepartment/{departmentId}")]
        public async Task<IActionResult> GetItemsByDepartment(
            int departmentId,
            int pageNb = 1,
            int pageSize = 10,
            string? searchQuery = null,
            float? minPrice = null,
            float? maxPrice = null,
            string? sortBy = null // "priceAsc", "priceDesc", "nameAsc", "nameDesc"
)
        {
            var items = await _itemService.GetItemsByDepartmentPaginatedAsync(
                departmentId, pageNb, pageSize, searchQuery, minPrice, maxPrice, sortBy
            );
            return Ok(items);
        }

            [HttpGet("GetItem/{id}")]
        public async Task<IActionResult> GetItem(int id)
        {
            var item = await _itemService.GetItemByIdAsync(id);
            if (item == null)
                return NotFound();

            return Ok(item);
        }

        [HttpPost("CreateItem")]
        public async Task<IActionResult> CreateItem([FromBody] CreateItemDto item)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var newItem = await _itemService.CreateItemAsync(item);
            return Ok(newItem);
        }

        [HttpPut("UpdateItem")]
        public async Task<IActionResult> UpdateItem([FromBody] ItemDto item)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _itemService.UpdateItemAsync(item);
            return Ok(item);
        }

        [HttpDelete("DeleteItem/{id}")]
        public async Task<IActionResult> DeleteItem(int id)
        {
            await _itemService.DeleteItemAsync(id);
            return Ok(true);
        }

        [HttpGet("GetItemsCount/{departmentId}")]
        public async Task<IActionResult> GetItemsCount(int departmentId, string? searchQuery = null, float? minPrice = null, float? maxPrice = null)
        {
            var count = await _itemService.GetItemsCountAsync(departmentId, searchQuery, minPrice, maxPrice);
            return Ok(count);
        }

        [HttpGet("GetMinPriceByDepartment/{departmentId}")]
        public async Task<IActionResult> GetMinPriceByDepartment(int departmentId)
        {
            var minPrice = await _itemService.GetMinPriceByDepartmentAsync(departmentId);
            return Ok(minPrice);
        }

        [HttpGet("GetMaxPriceByDepartment/{departmentId}")]
        public async Task<IActionResult> GetMaxPriceByDepartment(int departmentId)
        {
            var maxPrice = await _itemService.GetMaxPriceByDepartmentAsync(departmentId);
            return Ok(maxPrice);
        }
    }
}
