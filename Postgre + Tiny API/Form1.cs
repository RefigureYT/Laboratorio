using System;
using System.Windows.Forms;
using System.Net.Http;
using System.Threading.Tasks;
using Npgsql;
using Microsoft.Extensions.DependencyInjection;
using System.Net.Http.Headers;
using System.Text.Json;
using static Postgre___Tiny_API.ClasseJsonComplemento;
using System.Drawing;
using System.IO;

namespace Postgre___Tiny_API
{
    public partial class Form1 : Form
    {
        private readonly IHttpClientFactory _httpClientFactory;

        // String de conexão com PostgreSQL
        private string connString = "Host=(Hidden);Port=5432;Username=(Hidden);Password=(Hidden);Database=n8n_geral_db";

        public Form1()
        {
            InitializeComponent();

            // Obtém a instância de HttpClientFactory do serviço configurado em Program.cs
            _httpClientFactory = Program.ServiceProvider.GetRequiredService<IHttpClientFactory>();
        }

        private async void prontoButton_Click(object sender, EventArgs e)
        {
            string idProduto = idProdutoTxtBox.Text.Trim();

            if (string.IsNullOrEmpty(idProduto))
            {
                MessageBox.Show("Por favor, insira um ID de produto válido.", "Erro", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            string accessToken = BuscarChaveAPIDoSilvio();

            if (string.IsNullOrEmpty(accessToken))
            {
                MessageBox.Show("Erro ao buscar o Access Token.", "Erro", MessageBoxButtons.OK, MessageBoxIcon.Error);
                return;
            }

            var headers = new Dictionary<string, string>
            {
                { "Authorization", $"Bearer {accessToken}" }
            };

            string apiUrl = $"https://api.tiny.com.br/public-api/v3/produtos/{idProduto}";

            string respostaJson = await FazerRequisicaoAPI(apiUrl, accessToken, headers);

            try
            {
                var produto = JsonSerializer.Deserialize<ProdutoResponse>(respostaJson, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true,
                    WriteIndented = true
                });

                if (produto != null)
                {
                    jsonDesserializado.Text = JsonSerializer.Serialize(produto, new JsonSerializerOptions { WriteIndented = true });

                    // Exibir os anexos no RichTextBox
                    if (produto.Anexos != null && produto.Anexos.Count > 0)
                    {
                        jsonDesserializado.AppendText("\n\n🔹 Anexos:");
                        foreach (var anexo in produto.Anexos)
                        {
                            jsonDesserializado.AppendText($"\n - URL: {anexo.Url}");
                            jsonDesserializado.AppendText($"\n - Externo: {(anexo.Externo ? "Sim" : "Não")}\n");

                            if (anexo.Externo) // Se for uma imagem externa, exibe direto na PictureBox
                            {
                                CarregarImagemDaURL(anexo.Url);
                                break; // Exibe apenas a primeira imagem
                            }
                        }
                    }
                    else
                    {
                        jsonDesserializado.AppendText("\n\n🔹 Nenhum anexo encontrado.");
                        imagemProduto.Image = null; // Remove qualquer imagem anterior
                    }
                }
                else
                {
                    jsonDesserializado.Text = "Nenhum produto encontrado.";
                    imagemProduto.Image = null;
                }
            }
            catch (Exception ex)
            {
                jsonDesserializado.Text = $"Erro ao processar JSON: {ex.Message}";
            }
        }

        private void CarregarImagemDaURL(string imageUrl)
        {
            try
            {
                imagemProduto.Load(imageUrl); // Carrega a imagem diretamente do link
                imagemProduto.SizeMode = PictureBoxSizeMode.Zoom; // Ajusta a imagem
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Erro ao carregar imagem: {ex.Message}", "Erro", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private string BuscarChaveAPIDoSilvio()
        {
            using (var conn = new NpgsqlConnection(connString))
            {
                try
                {
                    conn.Open();
                    string query = "SELECT access_token FROM public.api_tokens WHERE nome = 'Silvio'";

                    using (var cmd = new NpgsqlCommand(query, conn))
                    {
                        object result = cmd.ExecuteScalar();
                        return result?.ToString(); // Retorna o access_token ou null se não encontrar
                    }
                }
                catch (Exception ex)
                {
                    MessageBox.Show($"Erro ao conectar ao banco de dados:\n{ex.Message}", "Erro", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    return null;
                }
            }
        }

        private async Task<string> FazerRequisicaoAPI(
            string baseUrl,
            string accessToken,
            Dictionary<string, string> headers)
            {
            var client = _httpClientFactory.CreateClient();

            // Define o cabeçalho de autorização corretamente
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            // Adiciona headers personalizados (exceto Authorization)
            if (headers != null)
            {
                foreach (var header in headers)
                {
                    if (header.Key.ToLower() != "authorization") // Evita duplicação do Authorization
                    {
                        client.DefaultRequestHeaders.TryAddWithoutValidation(header.Key, header.Value);
                    }
                }
            }

            // Usa apenas a URL base, sem parâmetros de query
            string url = baseUrl;

            // Fazer a requisição GET
            HttpResponseMessage response = await client.GetAsync(url);
            response.EnsureSuccessStatusCode();

            return await response.Content.ReadAsStringAsync();
        }

        private void idProdutoTxtBox_TextChanged(object sender, EventArgs e)
        {

        }
    }
}
