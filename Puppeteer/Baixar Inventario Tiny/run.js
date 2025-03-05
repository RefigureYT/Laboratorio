const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const { Console } = require('console');
const { waitForDebugger } = require('inspector');
const { timeout } = require('puppeteer');

const app = express();
const PORT = 3000;
const downloadPath = path.resolve(__dirname, 'puppeteer_downloads');

// Middleware para processar JSON no body da requisição
app.use(express.json());

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Função para tentativa repetida em caso de falha
async function retryOnFail(action, maxRetries, waitTime) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await action();
        console.log(`Ação concluída com sucesso na tentativa ${attempt}.`);
        return;
      } catch (error) {
        console.error(`Erro na tentativa ${attempt}: ${error.message}`);
        if (attempt < maxRetries) {
          console.log(`Esperando ${waitTime / 1000} segundos antes de tentar novamente...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        } else {
          console.error('Máximo de tentativas atingido. Ação falhou.');
          throw error;
        }
      }
    }
};

// Função para limpar o diretório de downloads
const cleanDownloadDirectory = () => {
    if (fs.existsSync(downloadPath)) {
        fs.readdirSync(downloadPath).forEach((file) => {
            const filePath = path.join(downloadPath, file);
            fs.unlinkSync(filePath);
        });
    } else {
        fs.mkdirSync(downloadPath); // Cria o diretório se não existir
    }
};

// Endpoint para gerar o relatório
app.post('/run-relatorio', async (req, res) => {
    console.log('Requisição recebida! Iniciando script...');
    const { username, password } = req.body;

    // Validar se login e senha foram fornecidos
    if (!username || !password) {
        return res.status(400).json({ error: 'Usuário e senha são obrigatórios.' });
    }

    let browser;

    try {
        browser = await puppeteer.launch({
            headless: false, // Modo headless desativado para mostrar a interface
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
        });

        const page = await browser.newPage();

        // Configurar o caminho de download
        await page._client().send('Page.setDownloadBehavior', {
            behavior: 'allow',
            downloadPath,
        });

        // Login no Tiny ERP
        console.log('Efetuando login no Tiny...');
        await page.goto('https://erp.tiny.com.br/login/', { waitUntil: 'networkidle2' });        

        // Aguarda o campo de login estar visível
        await page.waitForSelector('#username', { visible: true });

        // Digita o email
        await page.type('#username', username, { delay: 50 });

        // Espera o botão existir
        await page.waitForSelector('button[aria-busy="false"]', { visible: true });

        // Clica no botão
        await page.click('button[aria-busy="false"]');

        // Aguarda o campo de senha aparecer
        await page.waitForSelector('#password', { visible: true });

        // Digita a senha
        await page.type('#password', password, { delay: 50 });

        // Espera o botão "Entrar" existir
        await page.waitForSelector('button[aria-busy="false"]', { visible: true });

        // Clica no botão entrar
        await page.click('button[aria-busy="false"]');

        await sleep(5000); // Espera 5 segundos para evitar bugs

        await retryOnFail(async () => {
            // Tenta encontrar o botão
            const button = await page.$('button.btn.btn-primary'); 

            if (!button) {
                throw new Error("Botão de login não encontrado, tentando novamente...");
            }

            console.log("Botão de login encontrado! Clicando...");
            await page.waitForSelector('button.btn.btn-primary', { visible: true });
            await page.click('button.btn.btn-primary');
            
        }, 5, 3000);

        await sleep(5000);

        // Limpar o diretório de downloads antes de prosseguir
        cleanDownloadDirectory();

        console.log('Gerando o relatório...');
        await sleep(10000); // Aguarde o relatório ser gerado
        console.log('Baixando...');

        try {

            // Configura o comportamento de download antes de acessar a URL
            await page._client().send('Page.setDownloadBehavior', {
                behavior: 'allow',
                downloadPath: downloadPath,
            });

            console.log('Baixando...');
                await page.goto('https://erp.tiny.com.br/relatorios/relatorio.estoque.inventario.download.xls?produto=&idDeposito=785301556&idCategoria=0&descricaoCategoria=&exibirSaldo=&idCategoriaFiltro=0&layoutExportacao=R&formatoPlanilha=xls&exibirEstoqueDisponivel=N&produtoSituacao=A&idFornecedor=0&valorBaseado=0', {
                waitUntil: 'networkidle2',
                timeout: 240000 // Aumenta para 4 minutos
            });
        } catch (error) {
            console.warn("⚠️ Erro ao carregar a página de download. Continuando o script...");
        }
        console.log('Baixando...');

        await sleep(10000);
        console.log('Relatório baixado com sucesso.');
        await browser.close();
        console.log('Browser fechado com sucesso.');

        res.status(200).json({ message: 'Relatório gerado com sucesso!' });
    } catch (error) {
        console.error('Erro durante a execução:', error);
        if (browser) {
            await browser.close();
            console.log('Browser fechado após erro.');
        }
        res.status(500).json({ error: 'Erro ao executar o script', details: error.toString() });
    }
});

// Endpoint para baixar o arquivo gerado
app.get('/download', async (req, res) => {
    try {
        const files = fs.readdirSync(downloadPath);

        if (files.length !== 1) {
            return res.status(400).json({ error: 'O diretório deve conter exatamente um arquivo.' });
        }

        const filePath = path.join(downloadPath, files[0]);
        console.log('Enviando arquivo:', filePath);

        res.download(filePath, files[0], (err) => {
            if (err) {
                console.error('Erro ao enviar o arquivo:', err);
                res.status(500).json({ error: 'Erro ao enviar o arquivo.' });
            } else {
                console.log('Arquivo enviado com sucesso.');
            }

            // Limpa o arquivo após envio
            try {
                fs.unlinkSync(filePath);
                console.log('Arquivo temporário removido.');
            } catch (unlinkError) {
                console.error('Erro ao remover arquivo temporário:', unlinkError);
            }

            // Encerra o processo após um breve delay
            setTimeout(() => {
                console.log('Encerrando o processo...');
                process.exit(0);
            }, 2000);
        });

    } catch (error) {
        console.error('Erro ao acessar o diretório de downloads:', error);
        res.status(500).json({ error: 'Erro ao acessar o diretório de downloads.', details: error.toString() });
    }
});

app.listen(PORT, '192.168.15.177', () => {
    console.log(`Servidor rodando em http://192.168.15.177:${PORT}`);
});