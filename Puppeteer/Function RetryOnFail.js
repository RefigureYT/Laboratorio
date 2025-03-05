// Função para tentativa repetida em caso de falha
async function retryOnFail(action, maxRetries, waitTime) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await action();
      writeLog(`Ação concluída com sucesso na tentativa ${attempt}.`);
      return;
    } catch (error) {
      console.error(`Erro na tentativa ${attempt}: ${error.message}`);
      if (attempt < maxRetries) {
        writeLog(`Esperando ${waitTime / 1000} segundos antes de tentar novamente...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      } else {
        console.error('Máximo de tentativas atingido. Ação falhou.');
        throw error;
      }
    }
  }
}