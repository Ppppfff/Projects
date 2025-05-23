using Application.DTOs.Department;

namespace Application.Interfaces
{
    public interface IDepartmentService
    {
        Task<IEnumerable<DepartmentDto>> GetAllDepartmentsAsync();
        Task<DepartmentDto> GetDepartmentByIdAsync(int id);
        Task<DepartmentDto> CreateDepartmentAsync(CreateDepartmentDto dto);
        Task UpdateDepartmentAsync(DepartmentDto dto);
        Task DeleteDepartmentAsync(int id);

    }
}
