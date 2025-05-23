using Core.Entities;

namespace Application.Interfaces.Repositories
{
    public interface IDepartmentRepository
    {
        Task<List<Department>> GetAllDepartmentsAsync();
        Task<Department> GetDepartmentByIdAsync(int id);
        Task<Department> CreateDepartmentAsync(Department Department);
        Task UpdateDepartmentAsync(Department Department);
        Task DeleteDepartmentAsync(int id);
    }
}
