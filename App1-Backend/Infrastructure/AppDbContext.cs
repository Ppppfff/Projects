using Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Department> Departments { get; set; }
        public DbSet<Item> Items { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Cart> Carts { get; set; }
        public DbSet<CartItem> CartItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure Department Entity
            modelBuilder.Entity<Department>().ToTable("Department");
            modelBuilder.Entity<Department>().HasKey(d => d.id);

            // Configure Item Entity
            modelBuilder.Entity<Item>().ToTable("Item");
            modelBuilder.Entity<Item>().HasKey(i => i.Id);

            modelBuilder.Entity<Item>()
                .HasOne(i => i.Department)
                .WithMany(d => d.Items)
                .HasForeignKey(i => i.Department_id)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure User Entity
            modelBuilder.Entity<User>().ToTable("User");
            modelBuilder.Entity<User>().HasKey(u => u.Id);
            modelBuilder.Entity<User>().HasIndex(u => u.Username).IsUnique();

            // Configure Cart Entity
            modelBuilder.Entity<Cart>().ToTable("Cart");
            modelBuilder.Entity<Cart>().HasKey(c => c.Id);

            modelBuilder.Entity<User>()
                .HasOne(u => u.Cart)
                .WithOne(c => c.User)
                .HasForeignKey<Cart>(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure CartItem (Many-to-Many between Cart and Item)
            modelBuilder.Entity<CartItem>().ToTable("CartItem");
            modelBuilder.Entity<CartItem>().HasKey(ci => ci.Id);

            modelBuilder.Entity<CartItem>()
                .HasOne(ci => ci.Cart)
                .WithMany(c => c.CartItems)
                .HasForeignKey(ci => ci.CartId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<CartItem>()
                .HasOne(ci => ci.Item)
                .WithMany(i => i.CartItems)
                .HasForeignKey(ci => ci.ItemId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
