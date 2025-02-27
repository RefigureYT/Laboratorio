using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Text.Json.Serialization;

namespace Postgre___Tiny_API
{
    internal class ClasseJsonComplemento
    {
        public class ProdutoResponse
        {
            [JsonPropertyName("id")]
            public int Id { get; set; }

            [JsonPropertyName("sku")]
            public string Sku { get; set; }

            [JsonPropertyName("descricao")]
            public string Descricao { get; set; }

            [JsonPropertyName("precos")]
            public Precos Precos { get; set; }

            [JsonPropertyName("estoque")]
            public Estoque Estoque { get; set; }

            [JsonPropertyName("fornecedores")]
            public List<Fornecedor> Fornecedores { get; set; }

            [JsonPropertyName("variacoes")]
            public List<Variacao> Variacoes { get; set; }

            [JsonPropertyName("anexos")]
            public List<Anexo> Anexos { get; set; }
        }

        public class Anexo
        {
            [JsonPropertyName("url")]
            public string Url { get; set; }

            [JsonPropertyName("externo")]
            public bool Externo { get; set; }
        }

        public class Categoria
        {
            [JsonPropertyName("id")]
            public int Id { get; set; }

            [JsonPropertyName("nome")]
            public string Nome { get; set; }
        }

        public class Marca
        {
            [JsonPropertyName("id")]
            public int Id { get; set; }

            [JsonPropertyName("nome")]
            public string Nome { get; set; }
        }

        public class Dimensoes
        {
            [JsonPropertyName("largura")]
            public double Largura { get; set; }

            [JsonPropertyName("altura")]
            public double Altura { get; set; }

            [JsonPropertyName("comprimento")]
            public double Comprimento { get; set; }

            [JsonPropertyName("pesoLiquido")]
            public double PesoLiquido { get; set; }

            [JsonPropertyName("pesoBruto")]
            public double PesoBruto { get; set; }
        }

        public class Precos
        {
            [JsonPropertyName("preco")]
            public double Preco { get; set; }

            [JsonPropertyName("precoPromocional")]
            public double PrecoPromocional { get; set; }

            [JsonPropertyName("precoCusto")]
            public double PrecoCusto { get; set; }
        }

        public class Estoque
        {
            [JsonPropertyName("quantidade")]
            public int Quantidade { get; set; }
        }

        public class Fornecedor
        {
            [JsonPropertyName("id")]
            public int Id { get; set; }

            [JsonPropertyName("nome")]
            public string Nome { get; set; }
        }

        public class Variacao
        {
            [JsonPropertyName("id")]
            public int Id { get; set; }

            [JsonPropertyName("descricao")]
            public string Descricao { get; set; }

            [JsonPropertyName("sku")]
            public string Sku { get; set; }

            [JsonPropertyName("precos")]
            public Precos Precos { get; set; }
        }
    }
}
