using Microsoft.Extensions.DependencyInjection;
using System;
using System.Windows.Forms;

namespace Postgre___Tiny_API
{
    internal static class Program
    {
        public static IServiceProvider ServiceProvider { get; private set; }

        [STAThread]
        static void Main()
        {
            ApplicationConfiguration.Initialize();

            // Criar um container de serviços para usar HttpClientFactory
            var services = new ServiceCollection();
            services.AddHttpClient(); // Adiciona suporte ao HttpClientFactory

            ServiceProvider = services.BuildServiceProvider();

            Application.Run(new Form1());
        }
    }
}
