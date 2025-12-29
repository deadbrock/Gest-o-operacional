import nodemailer from 'nodemailer';

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export interface SolicitacaoPagamentoData {
  solicitacaoId: number;
  colaboradorNome: string;
  colaboradorEmail: string;
  departamento: string;
  destino: string;
  dataInicio: Date;
  dataFim: Date;
  custoTotal: number;
  hospedagens?: Array<{
    hotel: string;
    valor: number;
    diarias: number;
  }>;
  passagens?: Array<{
    origem: string;
    destino: string;
    valor: number;
  }>;
  despesas?: Array<{
    descricao: string;
    valor: number;
  }>;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    this.initialize();
  }

  private initialize() {
    // Verificar se as variáveis de ambiente estão configuradas
    const emailHost = process.env.EMAIL_HOST;
    const emailPort = process.env.EMAIL_PORT;
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (!emailHost || !emailPort || !emailUser || !emailPass) {
      console.warn('⚠️  Variáveis de email não configuradas. Emails serão apenas logados no console.');
      return;
    }

    try {
      this.transporter = nodemailer.createTransport({
        host: emailHost,
        port: parseInt(emailPort),
        secure: parseInt(emailPort) === 465, // true para 465, false para outras portas
        auth: {
          user: emailUser,
          pass: emailPass,
        },
      });

      console.log('✅ Email service configurado com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao configurar email service:', error);
      this.transporter = null;
    }
  }

  /**
   * Envia email de solicitação de pagamento para o financeiro
   */
  async enviarSolicitacaoPagamento(data: SolicitacaoPagamentoData): Promise<boolean> {
    const emailFinanceiro = process.env.EMAIL_FINANCEIRO || 'financeiro@gestaoviagens.com';

    const htmlContent = this.gerarHtmlSolicitacaoPagamento(data);

    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@gestaoviagens.com',
      to: emailFinanceiro,
      subject: `[Pagamento Pendente] Solicitação #${data.solicitacaoId} - ${data.colaboradorNome}`,
      html: htmlContent,
    };

    return this.enviarEmail(mailOptions);
  }

  /**
   * Envia email genérico
   */
  private async enviarEmail(mailOptions: nodemailer.SendMailOptions): Promise<boolean> {
    // Se não há transporter configurado, apenas loga
    if (!this.transporter) {
      console.log('\n📧 ========== EMAIL (Modo Desenvolvimento) ==========');
      console.log('De:', mailOptions.from);
      console.log('Para:', mailOptions.to);
      console.log('Assunto:', mailOptions.subject);
      console.log('Conteúdo HTML:', mailOptions.html?.toString().substring(0, 200) + '...');
      console.log('====================================================\n');
      return true; // Retorna sucesso em modo desenvolvimento
    }

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email enviado com sucesso:', info.messageId);
      return true;
    } catch (error) {
      console.error('❌ Erro ao enviar email:', error);
      return false;
    }
  }

  /**
   * Gera HTML do email de solicitação de pagamento
   */
  private gerarHtmlSolicitacaoPagamento(data: SolicitacaoPagamentoData): string {
    const formatCurrency = (value: number) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(value);
    };

    const formatDate = (date: Date) => {
      return new Date(date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    };

    let detalhesHtml = '';

    // Hospedagens
    if (data.hospedagens && data.hospedagens.length > 0) {
      detalhesHtml += `
        <tr>
          <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;">
            <strong style="color: #667eea;">🏨 Hospedagens:</strong>
            <ul style="margin: 5px 0; padding-left: 20px;">
              ${data.hospedagens.map(h => `
                <li>${h.hotel} - ${h.diarias} diária(s) - ${formatCurrency(h.valor)}</li>
              `).join('')}
            </ul>
          </td>
        </tr>
      `;
    }

    // Passagens
    if (data.passagens && data.passagens.length > 0) {
      detalhesHtml += `
        <tr>
          <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;">
            <strong style="color: #10b981;">✈️ Passagens:</strong>
            <ul style="margin: 5px 0; padding-left: 20px;">
              ${data.passagens.map(p => `
                <li>${p.origem} → ${p.destino} - ${formatCurrency(p.valor)}</li>
              `).join('')}
            </ul>
          </td>
        </tr>
      `;
    }

    // Despesas/Alimentação
    if (data.despesas && data.despesas.length > 0) {
      detalhesHtml += `
        <tr>
          <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;">
            <strong style="color: #f59e0b;">🍽️ Alimentação/Despesas:</strong>
            <ul style="margin: 5px 0; padding-left: 20px;">
              ${data.despesas.map(d => `
                <li>${d.descricao} - ${formatCurrency(d.valor)}</li>
              `).join('')}
            </ul>
          </td>
        </tr>
      `;
    }

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
            .content { padding: 20px; }
            .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
            .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">💰 Nova Solicitação de Pagamento</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Solicitação #${data.solicitacaoId}</p>
            </div>
            
            <div class="content">
              <p>Olá, Financeiro!</p>
              <p>Uma nova solicitação de pagamento foi registrada no sistema:</p>
              
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background: #f9fafb; border-radius: 8px; overflow: hidden;">
                <tr>
                  <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;">
                    <strong>👤 Colaborador:</strong><br>
                    ${data.colaboradorNome}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;">
                    <strong>🏢 Departamento:</strong><br>
                    ${data.departamento}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;">
                    <strong>📍 Destino:</strong><br>
                    ${data.destino}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;">
                    <strong>📅 Período da Viagem:</strong><br>
                    ${formatDate(data.dataInicio)} até ${formatDate(data.dataFim)}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px; background: #fef3c7;">
                    <strong style="font-size: 18px; color: #92400e;">💵 Valor Total: ${formatCurrency(data.custoTotal)}</strong>
                  </td>
                </tr>
              </table>

              ${detalhesHtml ? `
                <h3 style="color: #374151;">📋 Detalhamento dos Custos:</h3>
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb;">
                  ${detalhesHtml}
                </table>
              ` : ''}
              
              <p style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL || 'https://gestaooperacional-mocha.vercel.app'}/app" 
                   class="button">
                  🔗 Ver Detalhes no Sistema
                </a>
              </p>

              <p style="color: #6b7280; font-size: 14px;">
                <strong>⚠️ Atenção:</strong> Esta solicitação já foi aprovada pelo gestor e está aguardando processamento do pagamento.
              </p>
            </div>
            
            <div class="footer">
              <p>Este é um email automático do Sistema de Gestão de Viagens Corporativas.</p>
              <p>Não responda este email. Para dúvidas, acesse o sistema.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}

export default new EmailService();

