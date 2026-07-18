using Microsoft.EntityFrameworkCore;
using Website.Models;

namespace Website.Data;

public class WebsiteDbContext : DbContext
{
    public WebsiteDbContext(DbContextOptions<WebsiteDbContext> options) : base(options)
    {
    }

    public DbSet<ContactUs> ContactUs => Set<ContactUs>();
    public DbSet<CareerOpening> CareerOpenings => Set<CareerOpening>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.HasDefaultSchema("Website");
    }
}
