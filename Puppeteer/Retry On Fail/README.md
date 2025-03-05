# retryOnFail

Uma função JavaScript para **repetir automaticamente** uma ação assíncrona em caso de falha, com um limite de tentativas e tempo de espera entre elas.

## 🚀 **Descrição**
A função `retryOnFail` é útil para **tentar novamente** uma operação que pode falhar intermitentemente, como **requisições HTTP, automação com Puppeteer, operações de banco de dados, entre outros**.

Ela executa a ação definida e, se ocorrer um erro, **espera um tempo especificado e tenta novamente**, até atingir o número máximo de tentativas.

## 🛠 **Como Usar**
### 📌 **Sintaxe**
```javascript
async function retryOnFail(action, maxRetries, waitTime)
```

### 📌 **Parâmetros**
| Parâmetro   | Tipo       | Descrição |
|-------------|------------|------------|
| `action`    | `Function` | Uma **função assíncrona** que será executada e reexecutada em caso de erro. |
| `maxRetries` | `Number`   | O **número máximo de tentativas** antes de desistir e lançar um erro. |
| `waitTime`  | `Number`   | O **tempo de espera** (em milissegundos) entre cada tentativa. |

---

## 📌 **Exemplo de Uso**
### 🔹 **Exemplo 1: Repetindo uma Requisição HTTP**
```javascript
const axios = require('axios');

async function fetchData() {
  const response = await axios.get('https://api.example.com/data');
  console.log('Dados recebidos:', response.data);
}

(async () => {
  try {
    await retryOnFail(fetchData, 5, 3000); // 5 tentativas, 3 segundos entre cada uma
    console.log("Requisição bem-sucedida!");
  } catch (error) {
    console.error("Falha após todas as tentativas:", error);
  }
})();
```

---

### 🔹 **Exemplo 2: Tentando clicar em um botão no Puppeteer**
```javascript
const puppeteer = require('puppeteer');

async function clicarBotao(page, selector) {
  await page.waitForSelector(selector, { visible: true });
  await page.click(selector);
}

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://example.com');

  try {
    await retryOnFail(() => clicarBotao(page, 'button.login'), 5, 3000);
    console.log("Botão clicado com sucesso!");
  } catch (error) {
    console.error("Falha ao clicar no botão após todas as tentativas:", error);
  }

  await browser.close();
})();
```

---

## 🎯 **Boas Práticas**
✔ **Use para ações que podem falhar de forma intermitente**, como requisições HTTP ou cliques em botões dinâmicos.  
✔ **Não abuse de `maxRetries` altos** em sistemas com bloqueios de taxa (**rate limits**).  
✔ **Defina tempos de espera razoáveis (`waitTime`)** para evitar loops de repetição desnecessários.  
✔ **Monitore erros no log** (`console.error`) para entender quando a ação está falhando repetidamente.  

---

## 🛠 **Logs e Mensagens**
A função usa `writeLog()` para registrar mensagens sobre tentativas e falhas. **Se `writeLog` não estiver definida no seu código, substitua por `console.log()`.**  

Exemplo:
```javascript
function writeLog(message) {
  console.log(`[LOG] ${message}`);
}
```

---

## 📌 **Tratamento de Erros**
Se a ação **falhar em todas as tentativas**, a função **lança o erro final**, permitindo que você lide com ele no `try/catch` do seu código.

Exemplo:
```javascript
try {
  await retryOnFail(minhaFuncao, 3, 5000);
} catch (error) {
  console.error("Erro final:", error);
}
```

---

## 📌 **Licença**
Este código está disponível sob a licença **MIT**.

