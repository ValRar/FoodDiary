using FoodDiaryWebApi.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace FoodDiaryWebApi.Services.Implementations
{
    public class FoodDiaryDbContext : DbContext
    {
        private readonly IConfiguration _config;
        public DbSet<UserEntity> Users { get; set; }
        public DbSet<RefreshTokenEntity> RefreshTokens { get; set; }
        public DbSet<NoteEntity> Notes { get; set; }
        public FoodDiaryDbContext(IConfiguration config)
        {
            _config = config;
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserEntity>(builder =>
            {
                builder.ToTable("Users");
                builder.HasKey(x => x.Id);
                builder.HasMany(x => x.Notes)
                    .WithOne(x => x.Author)
                    .HasForeignKey(x => x.AuthorId);
                builder.HasMany(x => x.RefreshTokens).WithOne(x => x.Owner);
            });
            modelBuilder.Entity<NoteEntity>(builder =>
            {
                builder.ToTable("Notes");
                builder.HasKey(x => x.Id);
                builder.HasMany(x => x.Entries);
            });
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql(_config.GetConnectionString("postgres"));
            optionsBuilder.EnableSensitiveDataLogging();
            optionsBuilder.LogTo(s => System.Diagnostics.Debug.WriteLine(s));
        }
    }
}
