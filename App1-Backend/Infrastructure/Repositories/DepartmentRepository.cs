using Application.Interfaces.Repositories;
using Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class DepartmentRepository : IDepartmentRepository
    {
        private readonly AppDbContext _dbContext;
        public DepartmentRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task<List<Department>> GetAllDepartmentsAsync()
        {
            return await _dbContext.Departments.ToListAsync();
        }
        public async Task<Department> CreateDepartmentAsync(Department Department)
        {
            _dbContext.Departments.Add(Department);
            await _dbContext.SaveChangesAsync();
            return Department;
        }
        public async Task<Department> GetDepartmentByIdAsync(int id)
        {
            return await _dbContext.Departments.FindAsync(id);
        }
        public async Task DeleteDepartmentAsync(int id)
        {
            await _dbContext.Items.Where(item => item.Department_id == id).ExecuteDeleteAsync();
            await _dbContext.Departments.Where(x => x.id == id).ExecuteDeleteAsync();
        }
        public async Task UpdateDepartmentAsync(Department Department)
        {
            await _dbContext.Departments.Where(x => x.id == Department.id)
                .ExecuteUpdateAsync(x => x.SetProperty(x => x.name, Department.name));
        }
    }
}
