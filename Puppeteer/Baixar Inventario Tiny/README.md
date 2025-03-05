# Tiny ERP Puppeteer Script

## 📌 Descrição

Este script utiliza **Puppeteer** e **Express.js** para automatizar o login no **Tiny ERP**, gerar relatórios de inventário, baixar o arquivo e oferecer uma API local para gerenciar o processo.

---

## 🚀 Funcionalidades

- **Login automático** no Tiny ERP.
- **Geração e download de relatórios** de estoque.
- **Tratamento de erros e re-tentativas** para garantir estabilidade.
- **API local** para iniciar o processo e baixar arquivos.

---

## 🛠️ Instalação

### 1️⃣ Clone o repositório

```sh
git clone https://github.com/RefigureYT/Laboratorio.git
cd "Puppeteer/Baixar Inventário Tiny"
```

### 2️⃣ Instale as dependências

```sh
npm install
```

### 3️⃣ Inicie o servidor

```sh
node run.js
```

O servidor estará disponível em:

```sh
http://192.168.15.177:3000
```

---

## 📡 Endpoints da API

### **1️⃣ Iniciar Geração do Relatório**

Executa o processo de login, geração e download do relatório.

**Request:**

```http
POST /run-relatorio
```

**Body (JSON):**

```json
{
  "username": "seu-email@exemplo.com",
  "password": "sua-senha"
}
```

**Response:**

```json
{
  "message": "Relatório gerado com sucesso!"
}
```

---

### **2️⃣ Baixar o Relatório**

Retorna o arquivo mais recente gerado.

**Request:**

```http
GET /download
```

**Response:**

- Faz o download do arquivo `.xls`.

---

## 🔄 Tratamento de Erros

- **Re-tentativas Automáticas**

```javascript
await retryOnFail(async () => {
    await page.click('#btn-download');
}, 5, 3000); // Tenta até 5 vezes com intervalo de 3 segundos
```

- **Continuação Mesmo com Erros**

```javascript
try {
    await page.goto(reportURL, { waitUntil: 'networkidle2', timeout: 60000 });
} catch (error) {
    console.warn("⚠️ Erro ao carregar a página de download. Continuando o script...");
}
```

---

## ⚙️ Configuração

### **Alterar o IP e Porta do Servidor**

Você deve definir o **IP da sua máquina** no código e pode escolher a porta que desejar:

```javascript
const PORT = 3000;
const HOST = '192.168.15.177'; // Defina o IP da sua máquina
app.listen(PORT, HOST, () => {
    console.log(`Servidor rodando em http://${HOST}:${PORT}`);
});
```

### **Definir o Diretório de Download**

```javascript
const downloadPath = path.resolve(__dirname, 'puppeteer_downloads');
```

---

## 🛑 Como Parar o Servidor

Para interromper manualmente:

```sh
CTRL + C
```

Se estiver rodando com **PM2**, utilize:

```sh
pm2 stop nome-do-processo-ou-ID
```

Para verificar os processos em execução com **PM2**:

```sh
pm2 list
```

---

## 🔄 Como Deixar o Script Rodando com PM2

1️⃣ **Instale o PM2** (caso ainda não tenha):

```sh
npm install -g pm2
```

2️⃣ **Inicie o script com PM2:**

```sh
pm2 start run.js --name "tiny-erp-bot"
```

3️⃣ **Verifique os processos ativos:**

```sh
pm2 list
```

4️⃣ **Para parar o script:**

```sh
pm2 stop tiny-erp-bot
```

5️⃣ **Se quiser reiniciar o script:**

```sh
pm2 restart tiny-erp-bot
```

6️⃣ **Se deseja que o script rode sempre que o servidor reiniciar:**

```sh
pm2 startup
pm2 save
```

Agora o script rodará automaticamente ao reiniciar o sistema! 🚀

---

## 📄 Licença

Este projeto está sob a licença **MIT**.

---

## 🤝 Contribuições

Se encontrar bugs ou quiser sugerir melhorias, sinta-se à vontade para abrir um **pull request** ou **issue**!

---

## 💡 Autor

Criado por **Kelvin Mattos**. Conecte-se comigo no [GitHub](https://github.com/seu-usuario).

