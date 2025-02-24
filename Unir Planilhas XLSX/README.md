# 📊 Unir Planilhas via Python

Este projeto permite unir diversas planilhas **XLS e XLSX** em um único arquivo **XLSX** automaticamente usando **Python**.

## 🚀 Como usar?

1️⃣ **Execute o script pela primeira vez sem planilhas**:  
   ```sh
   python Unir.xlsx.py
   ```
   🔹 Isso criará **duas pastas** no diretório atual:
   - 📂 `PlanilhasUnir` → Adicione aqui as planilhas que deseja unir.
   - 📂 `PlanilhasUnidas` → Aqui será salvo o resultado final.

2️⃣ **Adicione as planilhas que deseja unir** dentro da pasta `PlanilhasUnir`.

3️⃣ **Execute o script novamente**:
   ```sh
   python Unir.xlsx.py
   ```
   🔹 O arquivo final será salvo na pasta `PlanilhasUnidas`.


## 📦 Dependências

Para rodar este projeto, você precisa do **Python 3.x** e das seguintes bibliotecas:

- **Pandas** (`pip install pandas`)
- **OpenPyXL** (`pip install openpyxl`)
- **PyWin32** (`pip install pywin32`) *(apenas para conversão de .xls para .xlsx no Windows)*


## 🔧 Instalação das Dependências

Antes de rodar o script, instale os pacotes necessários:
```sh
pip install pandas openpyxl pywin32
```