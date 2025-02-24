const express = require("express");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const bodyParser = require("body-parser");
const cors = require("cors");

puppeteer.use(StealthPlugin());

const app = express();
const PORT = 11211;
const HOST = "192.168.15.200";

app.use(cors());
app.use(bodyParser.json());

// Função para extrair shopid e itemid de um link Shopee
function extrairShopeeDados(link) {
    const regex = /shopee\.com\.br\/(.+?)-i\.(\d+)\.(\d+)/;
    const match = link.match(regex);

    if (match) {
        return {
            Anuncio: match[1].replace(/-/g, " "), // Remove "-" e melhora legibilidade
            shopid: Number(match[2]),
            itemid: Number(match[3]),
        };
    }
    return null;
}

// Função para buscar no DuckDuckGo
async function buscarDuckDuckGo(pesquisa) {
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-blink-features=AutomationControlled",
        ],
    });

    const page = await browser.newPage();
    await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );

    await page.goto(`https://duckduckgo.com/?q=${encodeURIComponent(pesquisa)}&t=h_&ia=web`, {
        waitUntil: "domcontentloaded",
    });

    await page.waitForSelector("article h2 a", { timeout: 60000 });

    const resultados = await page.evaluate(() => {
        return Array.from(document.querySelectorAll("article h2 a")).map((el) => ({
            Titulo: el.innerText,
            Link: el.href,
        }));
    });

    await browser.close();
    return resultados;
}

// 🔹 Endpoint: Pesquisa normal no DuckDuckGo (aceita qualquer operador)
app.post("/pesquisa", async (req, res) => {
    try {
        let { pesquisa } = req.body;
        if (!pesquisa) {
            return res.status(400).json({ error: "Campo 'pesquisa' é obrigatório." });
        }

        console.log(`🔍 Pesquisando: ${pesquisa}`);
        const resultados = await buscarDuckDuckGo(pesquisa);

        // Caso seja uma pesquisa de arquivo, baixa o binário
        if (pesquisa.includes("filetype:")) {
            const browser = await puppeteer.launch({ headless: true });
            const page = await browser.newPage();
            await page.goto(resultados[0]?.Link, { waitUntil: "networkidle2" });
            const buffer = await page.evaluate(() => {
                return new Blob([document.body.innerHTML], { type: "application/octet-stream" });
            });

            await browser.close();
            res.setHeader("Content-Disposition", "attachment; filename=arquivo.bin");
            res.setHeader("Content-Type", "application/octet-stream");
            return res.send(Buffer.from(await buffer.arrayBuffer()));
        }

        res.json({ Quantidade: resultados.length, Resultados: resultados });
    } catch (error) {
        console.error("Erro na pesquisa:", error.message);
        res.status(500).json({ error: "Erro ao buscar no DuckDuckGo." });
    }
});

// 🔹 Endpoint: Pesquisa apenas na Shopee, filtrando anúncios com shopid e itemid
app.post("/pesquisaShopee", async (req, res) => {
    try {
        let { pesquisa } = req.body;
        if (!pesquisa) {
            return res.status(400).json({ error: "Campo 'pesquisa' é obrigatório." });
        }

        pesquisa = `site:shopee.com.br ${pesquisa}`;
        console.log(`🔍 Pesquisando na Shopee: ${pesquisa}`);

        const resultados = await buscarDuckDuckGo(pesquisa);

        if (resultados.length === 0) {
            return res.json({ Quantidade: 0, Anuncios: [] });
        }

        // Filtrar apenas links válidos de produtos (que contêm shopid e itemid)
        const anunciosFiltrados = resultados
            .filter((item) => item.Link.includes("-i.") && item.Link.includes("shopee.com.br"))
            .map((item) => extrairShopeeDados(item.Link))
            .filter((item) => item !== null);

        if (anunciosFiltrados.length === 0) {
            return res.json({ Quantidade: 0, Anuncios: [] });
        }

        // Retorna os primeiros 10 produtos (ou menos, se houver menos de 10)
        res.json({
            Quantidade: anunciosFiltrados.length,
            Anuncios: anunciosFiltrados.slice(0, 10),
        });
    } catch (error) {
        console.error("Erro na pesquisa Shopee:", error.message);
        res.status(500).json({ error: "Erro ao buscar na Shopee." });
    }
});

// 🔹 Endpoint: Captura HTML de uma página específica
app.post("/link", async (req, res) => {
    try {
        let { link } = req.body;
        if (!link) {
            return res.status(400).json({ error: "Campo 'link' é obrigatório." });
        }

        console.log(`🔍 Acessando página: ${link}`);

        const browser = await puppeteer.launch({
            headless: true,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-blink-features=AutomationControlled",
            ],
        });

        const page = await browser.newPage();

        // Definir User-Agent para simular usuário real
        await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
        );

        // Esconder o `webdriver` para evitar detecção de bot
        await page.evaluateOnNewDocument(() => {
            Object.defineProperty(navigator, "webdriver", { get: () => false });
        });

        let tentativas = 0;
        let maxTentativas = 5;
        let paginaLoginDetectada = false;
        let html = "";

        do {
            // Tentar acessar a página
            const response = await page.goto(link, {
                waitUntil: "domcontentloaded",
                timeout: 60000, // Aumentamos para 60 segundos
            });

            // Verificar se houve redirecionamento
            if (response.status() >= 300 && response.status() < 400) {
                console.log("🔄 Redirecionamento detectado:", response.headers().location);
            }

            // Captura o HTML
            html = await page.content();

            // Verifica se a página contém um formulário de login
            paginaLoginDetectada = await page.evaluate(() => {
                return (
                    document.querySelector("input[type='password']") !== null || // Campo de senha
                    document.querySelector("form[action*='login']") !== null || // Formulário que aponta para login
                    document.body.innerText.toLowerCase().includes("faça login") // Texto indicando login
                );
            });

            if (paginaLoginDetectada) {
                console.log(`🔄 Página de login detectada! Tentando novamente (${tentativas + 1}/${maxTentativas})`);
                await page.reload({ waitUntil: "domcontentloaded" });
            }

            tentativas++;
        } while (paginaLoginDetectada && tentativas < maxTentativas);

        await browser.close();

        if (paginaLoginDetectada) {
            console.error("🚨 Erro: Página de login persistente após múltiplas tentativas.");
            return res.status(403).json({ error: "Página exige login e não pode ser acessada." });
        }

        res.send(html);
    } catch (error) {
        console.error("Erro ao acessar o link:", error.message);
        res.status(500).json({ error: "Erro ao acessar a página." });
    }
});

// Inicia o servidor
app.listen(PORT, HOST, () => {
    console.log(`🚀 Servidor rodando em http://${HOST}:${PORT}`);
});