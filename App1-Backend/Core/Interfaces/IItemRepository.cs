using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core.Entities;

namespace Application.Interfaces.Repositories
{
    public interface IItemRepository
    {
        Task<IEnumerable<Item>> GetItemAsync();
        Task<Item> GetItemByIdAsync(int id);
        Task<Item> CreateItemAsync(Item item);
        Task UpdateItemAsync(Item item);
        Task DeleteItemAsync(int id);
        Task<List<Item>> GetItemsByDepartmentPaginated(int departmentId, int pageNb, int pageSize, string? searchQuery, float? minPrice, float? maxPrice, string? sortBy);
        Task<int> GetItemsCountAsync(int departmentId, string? searchQuery, float? minPrice, float? maxPrice);
        Task<float> GetMaxPriceByDepartmentAsync(int departmentId);
        Task<float> GetMinPriceByDepartmentAsync(int departmentId);
    }
}
