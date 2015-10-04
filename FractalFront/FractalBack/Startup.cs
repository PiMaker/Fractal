namespace FractalBack
{
    using Microsoft.AspNet.Builder;
    using Microsoft.AspNet.Diagnostics;
    using Microsoft.AspNet.Hosting;
    using Microsoft.Framework.DependencyInjection;

    public class Startup
    {
        public static string PathToWWWRoot = string.Empty;

        public Startup(IHostingEnvironment env)
        {
            Startup.PathToWWWRoot = env.WebRootPath;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc();
            services.AddSingleton<IFractalDataManager>(provider => new FractalDataCache(new FractalDataManager()));
        }

        public void Configure(IApplicationBuilder app)
        {
            app.UseErrorPage(ErrorPageOptions.ShowAll);
            app.UseStaticFiles();
            app.UseMvc();
        }
    }
}