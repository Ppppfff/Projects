using Application.DTOs.Department;
using Application.Interfaces;
using Application.Interfaces.Repositories;
using Core.Entities;

namespace Application.Services
{
    public class DepartmentService : IDepartmentService
    {
        private IDepartmentRepository _repository;

        public DepartmentService(IDepartmentRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<DepartmentDto>> GetAllDepartmentsAsync()
        {
            var departments = await _repository.GetAllDepartmentsAsync();
            return departments.Select(x => new DepartmentDto
            {
                Id = x.id,
                Name = x.name
            });
        }

        public async Task<DepartmentDto> GetDepartmentByIdAsync(int id)
        {
            var department = await _repository.GetDepartmentByIdAsync(id);
            if (department == null) return null;
            return new DepartmentDto
            {
                Id = department.id,
                Name = department.name
            };
        }

        public async Task<DepartmentDto> CreateDepartmentAsync(CreateDepartmentDto dto)
        {
            var department = new Department
            {
                name = dto.Name
            };
            var newDep = await _repository.CreateDepartmentAsync(department);
            return new DepartmentDto
            {
                Id = newDep.id,
                Name = newDep.name
            };
        }

        public async Task DeleteDepartmentAsync(int id)
        {
            await _repository.DeleteDepartmentAsync(id);
        }

        public async Task UpdateDepartmentAsync(DepartmentDto dto)
        {
            var updated = new Department
            {
                id = dto.Id,
                name = dto.Name
            };
            await _repository.UpdateDepartmentAsync(updated);
        }
    }
}
