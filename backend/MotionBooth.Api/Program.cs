using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MotionBooth.Api.Configuration;
using MotionBooth.Api.Data;
using MotionBooth.Api.Models;
using MotionBooth.Api.Services.Events;
using MotionBooth.Api.Services.Storage;
using MotionBooth.Api.Services.Templates;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("MotionBoothFrontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services.AddAntiforgery(options =>
{
    options.HeaderName = "X-CSRF-TOKEN";

    options.Cookie.Name = "MotionBooth.Antiforgery";
    options.Cookie.HttpOnly = true;
    options.Cookie.SecurePolicy = builder.Environment.IsDevelopment()
        ? CookieSecurePolicy.None
        : CookieSecurePolicy.Always;
    options.Cookie.SameSite = SameSiteMode.Lax;
});

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Database
var dataSourceBuilder = new NpgsqlDataSourceBuilder(
    builder.Configuration.GetConnectionString("DefaultConnection")
);

dataSourceBuilder.EnableDynamicJson();

builder.Services.AddSingleton(dataSourceBuilder.Build());

builder.Services.AddDbContext<MotionBoothDbContext>(
    (services, options) =>
        options.UseNpgsql(services.GetRequiredService<NpgsqlDataSource>())
);

// Identity
builder
    .Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
    {
        options.User.RequireUniqueEmail = true;

        options.Password.RequiredLength = 8;
        options.Password.RequireDigit = true;
        options.Password.RequireLowercase = true;
        options.Password.RequireUppercase = true;
        options.Password.RequireNonAlphanumeric = true;
    })
    .AddEntityFrameworkStores<MotionBoothDbContext>()
    .AddDefaultTokenProviders();

// Authentication Cookie
builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.Name = "MotionBooth.Auth";
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.Lax;

    options.Cookie.SecurePolicy = builder.Environment.IsDevelopment()
        ? CookieSecurePolicy.None
        : CookieSecurePolicy.Always;

    options.ExpireTimeSpan = TimeSpan.FromDays(7);
    options.SlidingExpiration = true;
});

// Azure Blob Storage
builder.Services.Configure<StorageOptions>(
    builder.Configuration.GetSection(StorageOptions.SectionName)
);

builder.Services.AddSingleton(sp =>
{
    var configuration = sp.GetRequiredService<IConfiguration>();

    var connectionString = configuration.GetConnectionString("AzureStorage")
        ?? throw new InvalidOperationException(
            "Azure Storage connection string is missing."
        );

    return new BlobServiceClient(connectionString);
});

builder.Services.AddScoped<IFileStorageService, BlobStorageService>();
builder.Services.AddScoped<IEventsService, EventsService>();
builder.Services.AddScoped<IEventOutputsService, EventOutputsService>();
builder.Services.AddScoped<ITemplatesService, TemplatesService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUi(options =>
    {
        options.DocumentPath = "/openapi/v1.json";
    });
}

app.UseHttpsRedirection();

app.UseCors("MotionBoothFrontend");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
