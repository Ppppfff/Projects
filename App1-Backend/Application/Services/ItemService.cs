using Application.DTOs.Item;
using Application.Interfaces;
using Application.Interfaces.Repositories;
using Core.Entities;

namespace Application.Services
{
    public class ItemService : IItemService
    {
        private IItemRepository _repository;
        
        public ItemService(IItemRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<ItemDto>> GetItemAsync()
        {
            var items = await _repository.GetItemAsync();
            return items.Select(x => new ItemDto
            {
                Id = x.Id,
                Name = x.Name,
                Price = x.Price,
                Department_id = x.Department_id,
                ImageUrl = x.ImageUrl
            });
        }

        public async Task<ItemDto> GetItemByIdAsync(int id)
        {
            var item = await _repository.GetItemByIdAsync(id);
            return new ItemDto
            {
                Id = item.Id,
                Name = item.Name,
                Price = item.Price,
                Department_id = item.Department_id,
                ImageUrl = item.ImageUrl
            };
        }
        public async Task<ItemDto> CreateItemAsync(CreateItemDto item)
        {
            var newItem = new Item
            {
                Name = item.Name,
                Price = item.Price,
                Department_id = item.Department_id,
                ImageUrl = item.ImageUrl
            };
            var created = await _repository.CreateItemAsync(newItem);
            return new ItemDto
            {
                Id = newItem.Id,
                Name = newItem.Name,
                Price = newItem.Price,
                Department_id = newItem.Department_id,
                ImageUrl = newItem.ImageUrl
            };
        }

        public async Task DeleteItemAsync(int id)
        {
            await _repository.DeleteItemAsync(id);
        }

        public async Task UpdateItemAsync(ItemDto item)
        {
            var updatedItem = new Item
            {
                Id = item.Id,
                Name = item.Name,
                Price = item.Price,
                Department_id = item.Department_id,
                ImageUrl = item.ImageUrl
            };
            await _repository.UpdateItemAsync(updatedItem);
        }

        public async Task<List<ItemDto>> GetItemsByDepartmentPaginatedAsync(
            int departmentId,
            int pageNb,
            int pageSize,
            string? searchQuery,
            float? minPrice,
            float? maxPrice,
            string? sortBy
         )
        {
            var items = await _repository.GetItemsByDepartmentPaginated(
                departmentId, pageNb, pageSize, searchQuery, minPrice, maxPrice, sortBy
            );
            return items.Select(i => new ItemDto
            {
                Id = i.Id,
                Name = i.Name,
                Price = i.Price,
                Department_id = i.Department_id,
                ImageUrl = i.ImageUrl
            }).ToList();
        }

        public async Task<int> GetItemsCountAsync(int departmentId, string? searchQuery, float? minPrice, float? maxPrice)
        {
            return await _repository.GetItemsCountAsync(departmentId, searchQuery, minPrice, maxPrice);
        }

        public async Task<float> GetMinPriceByDepartmentAsync(int departmentId)
        {
            return await _repository.GetMinPriceByDepartmentAsync(departmentId);
        }

        public async Task<float> GetMaxPriceByDepartmentAsync(int departmentId)
        {
            return await _repository.GetMaxPriceByDepartmentAsync(departmentId);
        }
    }
}
