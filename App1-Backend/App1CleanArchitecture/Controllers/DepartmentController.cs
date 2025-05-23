using Application.DTOs.Department;
using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace App1CleanArchitecture.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DepartmentController : Controller
    {
        private readonly IDepartmentService _service;

        public DepartmentController(IDepartmentService service)
        {
            _service = service;
        }

        [HttpGet("GetDepartment")]
        public async Task<IActionResult> GetDepartments()
        {
            var departments = await _service.GetAllDepartmentsAsync();
            return Ok(departments);
        }

        [HttpGet("GetDepartmentById/{id}")]
        public async Task<IActionResult> GetDepartmentById(int id)
        {
            var department = await _service.GetDepartmentByIdAsync(id);
            if (department == null)
            {
                return NotFound();
            }
            return Ok(department);
        }

        [HttpPost("CreateDepartment")]
        public async Task<IActionResult> CreateDepartment([FromBody] CreateDepartmentDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var created = await _service.CreateDepartmentAsync(dto);
            return Ok(created);
        }

        [HttpPut("UpdateDepartment")]
        public async Task<IActionResult> UpdateDepartment([FromBody] DepartmentDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await _service.UpdateDepartmentAsync(dto);
            return Ok(dto);
        }

        [HttpDelete("DeleteDepartment/{id}")]
        public async Task<IActionResult> DeleteDepartment(int id)
        {
            await _service.DeleteDepartmentAsync(id);
            return Ok(true);
        }
    }
}
