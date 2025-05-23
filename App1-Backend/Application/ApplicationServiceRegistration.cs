using Microsoft.Extensions.DependencyInjection;
using Application.Services;
using Application.Interfaces;
namespace Application
{
    public static class ApplicationServiceRegistration
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            // Register Application Layer Services (Business Logic)
            services.AddScoped<IDepartmentService, DepartmentService>();
            services.AddScoped<IItemService, ItemService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<ICartService, CartService>();

            return services;
        }
    }
}
