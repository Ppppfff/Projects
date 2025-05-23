using Application.DTOs.Item;
using Core.Entities;

namespace Application.Interfaces
{
    public interface IItemService
    {
        Task<IEnumerable<ItemDto>> GetItemAsync();
        Task<ItemDto> GetItemByIdAsync(int id);
        Task<ItemDto> CreateItemAsync(CreateItemDto item);
        Task UpdateItemAsync(ItemDto item);
        Task DeleteItemAsync(int id);
        Task<List<ItemDto>> GetItemsByDepartmentPaginatedAsync(int departmentId, int pageNb, int pageSize, string? searchQuery, float? minPrice, float? maxPrice, string?sortBy);
        Task<int> GetItemsCountAsync(int departmentId, string? searchQuery, float? minPrice, float? maxPrice);
        Task<float> GetMinPriceByDepartmentAsync(int departmentId);
        Task<float> GetMaxPriceByDepartmentAsync(int departmentId);

    }
}
