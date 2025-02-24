import os
import pandas as pd
import win32com.client as win32

# Caminhos das pastas
# Criar as pastas se não existirem
pasta_planilhas = r'.\PlanilhasUnir'
pasta_saida = r'.\PlanilhasUnidas'

os.makedirs(pasta_planilhas, exist_ok=True)
os.makedirs(pasta_saida, exist_ok=True)

# Nome do arquivo de saída
arquivo_saida = 'planilhas_unidas.xlsx'
caminho_saida = os.path.join(pasta_saida, arquivo_saida)

# Função para converter .xls em .xlsx e excluir o arquivo .xls após a conversão
def converter_xls_para_xlsx(pasta_planilhas):
    excel = win32.Dispatch('Excel.Application')
    excel.Visible = False  # Para não abrir a interface do Excel

    for arquivo in os.listdir(pasta_planilhas):
        if arquivo.endswith('.xls'):
            caminho_arquivo = os.path.join(pasta_planilhas, arquivo)
            try:
                workbook = excel.Workbooks.Open(caminho_arquivo)
                
                # Acessar a primeira planilha
                sheet = workbook.Sheets(1)
                
                # Deletar as colunas A, C até S e U até BL
                # Lembre-se que as colunas são indexadas em 1 no Excel
                # sheet.Columns("A:A").Delete()  # Remove a coluna A
                # sheet.Columns("B:C").Delete()   # Remove as colunas C até S
                # sheet.Columns("C:C").Delete()   # Remove as colunas U até BL

                nome_arquivo_novo = arquivo.replace('.xls', '.xlsx')
                caminho_novo = os.path.join(pasta_planilhas, nome_arquivo_novo)
                workbook.SaveAs(caminho_novo, FileFormat=51)  # 51 = formato .xlsx
                workbook.Close()
                print(f"Arquivo convertido: {nome_arquivo_novo}")
                # Exclui o arquivo .xls após a conversão
                os.remove(caminho_arquivo)
                print(f"Arquivo original {arquivo} excluído.")
            except Exception as e:
                print(f"Erro ao converter o arquivo {arquivo}: {e}")
    
    excel.Quit()

# Função para unir todas as planilhas
def unir_planilhas(pasta_planilhas, caminho_saida):
    # Lista para armazenar os DataFrames
    lista_df = []

    # Verifica se a pasta de saída existe, se não, cria
    if not os.path.exists(pasta_saida):
        os.makedirs(pasta_saida)

    # Percorrer todos os arquivos na pasta de planilhas
    for arquivo in os.listdir(pasta_planilhas):
        caminho_arquivo = os.path.join(pasta_planilhas, arquivo)
        try:
            if arquivo.endswith('.csv'):
                df = pd.read_csv(caminho_arquivo)
            elif arquivo.endswith('.xlsx'):  # Unir apenas arquivos .xlsx
                df = pd.read_excel(caminho_arquivo)
            lista_df.append(df)
        except Exception as e:
            print(f"Erro ao ler o arquivo {arquivo}: {e}")

    # Concatenar todas as planilhas
    if lista_df:
        df_unido = pd.concat(lista_df, ignore_index=True)
        # Salvar o arquivo unido
        with pd.ExcelWriter(caminho_saida, engine='openpyxl') as writer:
            df_unido.to_excel(writer, index=False)
        print(f"Planilhas unidas com sucesso em: {caminho_saida}")
    else:
        print("Nenhuma planilha foi lida com sucesso.")

# Primeiro converte .xls em .xlsx
converter_xls_para_xlsx(pasta_planilhas)

# Depois une todas as planilhas convertidas e existentes
unir_planilhas(pasta_planilhas, caminho_saida)
