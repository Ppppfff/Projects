using Application.Interfaces.Repositories;
using Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class ItemRepository : IItemRepository
    {
        private readonly AppDbContext _dbContext;

        public ItemRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task<IEnumerable<Item>> GetItemAsync()
        {
            return await _dbContext.Items.ToListAsync();
        }
        public async Task<Item> GetItemByIdAsync(int id)
        {
            return await _dbContext.Items.FindAsync(id);
        }
        public async Task<Item> CreateItemAsync(Item item)
        {
            _dbContext.Items.Add(item);
            await _dbContext.SaveChangesAsync();
            return item;
        }
        public async Task DeleteItemAsync(int id)
        {
            await _dbContext.Items.Where(x => x.Id == id).ExecuteDeleteAsync();
        }
        public async Task UpdateItemAsync(Item item)
        {
            await _dbContext.Items.Where(x => x.Id == item.Id).ExecuteUpdateAsync(x =>
                    x.SetProperty(i => i.Name, item.Name)
                     .SetProperty(i => i.Department_id, item.Department_id)
                     .SetProperty(i => i.Price, item.Price)
                     .SetProperty(i => i.ImageUrl, item.ImageUrl)
                );
        }

        public async Task<List<Item>> GetItemsByDepartmentPaginated(
            int departmentId,
            int pageNb,
            int pageSize,
            string? searchQuery,
            float? minPrice,
            float? maxPrice,
            string? sortBy
        )
        {
            var query = _dbContext.Items
                .Where(i => i.Department_id == departmentId);

            if (!string.IsNullOrEmpty(searchQuery))
                query = query.Where(i => i.Name.Contains(searchQuery));

            if (minPrice.HasValue)
                query = query.Where(i => i.Price >= minPrice.Value);

            if (maxPrice.HasValue)
                query = query.Where(i => i.Price <= maxPrice.Value);

            query = sortBy switch
            {
                "priceAsc" => query.OrderBy(i => i.Price),
                "priceDesc" => query.OrderByDescending(i => i.Price),
                "nameDesc" => query.OrderByDescending(i => i.Name),
                _ => query.OrderBy(i => i.Name) // default: nameAsc
            };

            return await query
                .Skip((pageNb - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<int> GetItemsCountAsync(int departmentId, string? searchQuery, float? minPrice, float? maxPrice)
        {
            var query = _dbContext.Items.Where(i => i.Department_id == departmentId);

            if (!string.IsNullOrEmpty(searchQuery))
                query = query.Where(i => i.Name.Contains(searchQuery));
            
            if (minPrice.HasValue)
                query = query.Where(i => i.Price >= minPrice.Value);

            if (maxPrice.HasValue)
                query = query.Where(i => i.Price <= maxPrice.Value);


            return await query.CountAsync();
        }

        public async Task<float> GetMinPriceByDepartmentAsync(int departmentId)
        {
            return await _dbContext.Items
                .Where(i => i.Department_id == departmentId)
                .MinAsync(i => (float?)i.Price) ?? 0;
        }

        public async Task<float> GetMaxPriceByDepartmentAsync(int departmentId)
        {
            return await _dbContext.Items
                .Where(i => i.Department_id == departmentId)
                .MaxAsync(i => (float?)i.Price) ?? 0;
        }
    }
}
