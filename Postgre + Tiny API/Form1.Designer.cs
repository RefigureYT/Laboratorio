namespace Postgre___Tiny_API
{
    partial class Form1
    {
        /// <summary>
        ///  Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        ///  Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        ///  Required method for Designer support - do not modify
        ///  the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            idProdutoTxtBox = new TextBox();
            prontoButton = new Button();
            jsonDesserializado = new RichTextBox();
            imagemProduto = new PictureBox();
            ((System.ComponentModel.ISupportInitialize)imagemProduto).BeginInit();
            SuspendLayout();
            // 
            // idProdutoTxtBox
            // 
            idProdutoTxtBox.Location = new Point(198, 12);
            idProdutoTxtBox.Name = "idProdutoTxtBox";
            idProdutoTxtBox.Size = new Size(232, 23);
            idProdutoTxtBox.TabIndex = 0;
            idProdutoTxtBox.TextChanged += idProdutoTxtBox_TextChanged;
            // 
            // prontoButton
            // 
            prontoButton.Location = new Point(280, 41);
            prontoButton.Name = "prontoButton";
            prontoButton.Size = new Size(75, 23);
            prontoButton.TabIndex = 1;
            prontoButton.Text = "Pronto";
            prontoButton.UseVisualStyleBackColor = true;
            prontoButton.Click += prontoButton_Click;
            // 
            // jsonDesserializado
            // 
            jsonDesserializado.Anchor = AnchorStyles.Top | AnchorStyles.Bottom | AnchorStyles.Right;
            jsonDesserializado.Location = new Point(641, 12);
            jsonDesserializado.Name = "jsonDesserializado";
            jsonDesserializado.Size = new Size(589, 955);
            jsonDesserializado.TabIndex = 2;
            jsonDesserializado.Text = "";
            // 
            // imagemProduto
            // 
            imagemProduto.BackgroundImageLayout = ImageLayout.Center;
            imagemProduto.BorderStyle = BorderStyle.FixedSingle;
            imagemProduto.Location = new Point(50, 80);
            imagemProduto.Name = "imagemProduto";
            imagemProduto.Size = new Size(550, 550);
            imagemProduto.TabIndex = 3;
            imagemProduto.TabStop = false;
            // 
            // Form1
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            ClientSize = new Size(1242, 979);
            Controls.Add(imagemProduto);
            Controls.Add(jsonDesserializado);
            Controls.Add(prontoButton);
            Controls.Add(idProdutoTxtBox);
            Name = "Form1";
            Text = "Form1";
            ((System.ComponentModel.ISupportInitialize)imagemProduto).EndInit();
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion

        private TextBox idProdutoTxtBox;
        private Button prontoButton;
        private RichTextBox jsonDesserializado;
        private PictureBox imagemProduto;
    }
}
