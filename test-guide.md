# Guia de Testes para o Organizador de Agenda TDAH

Este documento descreve os procedimentos de teste para verificar o funcionamento correto da aplicação após a implantação.

## 1. Testes de Autenticação

- [ ] Verificar se a página inicial carrega corretamente
- [ ] Testar o botão "Entrar com Google"
- [ ] Confirmar que o processo de autenticação OAuth funciona
- [ ] Verificar se o redirecionamento após login funciona corretamente
- [ ] Testar o botão de logout
- [ ] Confirmar que usuários não autenticados são redirecionados para a página de login

## 2. Testes de Integração com Google Calendar

- [ ] Verificar se a aplicação solicita as permissões corretas do Google Calendar
- [ ] Confirmar que os eventos do calendário são carregados corretamente
- [ ] Testar a categorização automática de eventos
- [ ] Verificar se os eventos são exibidos na linha do tempo corretamente

## 3. Testes de Funcionalidades Principais

- [ ] Verificar se a previsão do tempo é exibida corretamente
- [ ] Testar a funcionalidade de cálculo de tempo de locomoção entre eventos
- [ ] Verificar se os conflitos de tempo são identificados e destacados
- [ ] Testar a funcionalidade de lembretes (modal e configurações)
- [ ] Verificar se os checklists por categoria funcionam corretamente

## 4. Testes do Modo Viagem

- [ ] Testar a ativação do modo viagem
- [ ] Verificar se as dicas para viagem são exibidas corretamente
- [ ] Testar o checklist de viagem
- [ ] Verificar se a desativação do modo viagem funciona corretamente

## 5. Testes de Responsividade

- [ ] Testar a aplicação em dispositivos desktop (1920x1080, 1366x768)
- [ ] Testar a aplicação em tablets (iPad - 768x1024)
- [ ] Testar a aplicação em smartphones (iPhone - 375x667, Android - 360x640)
- [ ] Verificar se o layout se adapta corretamente a diferentes tamanhos de tela

## 6. Testes de Persistência de Dados

- [ ] Verificar se as preferências do usuário são salvas corretamente
- [ ] Testar se os lembretes personalizados persistem entre sessões
- [ ] Verificar se os itens marcados nos checklists permanecem marcados após recarregar a página
- [ ] Testar se o estado do modo viagem é mantido corretamente

## 7. Testes de Segurança

- [ ] Verificar se a conexão HTTPS está funcionando corretamente
- [ ] Confirmar que as rotas protegidas não são acessíveis sem autenticação
- [ ] Testar se os tokens de autenticação são gerenciados corretamente
- [ ] Verificar se as variáveis de ambiente estão configuradas corretamente

## 8. Testes de Performance

- [ ] Medir o tempo de carregamento inicial da página
- [ ] Verificar a performance ao carregar muitos eventos
- [ ] Testar a responsividade da interface durante operações assíncronas
- [ ] Verificar se há otimização de imagens e recursos

## Procedimento de Teste

1. Acesse a URL da aplicação implantada
2. Execute cada teste listado acima
3. Documente quaisquer problemas encontrados
4. Para problemas críticos, corrija imediatamente
5. Para problemas menores, crie issues no repositório para correção futura

## Relatório de Testes

Após concluir os testes, preencha o relatório abaixo:

- **Data dos testes**: ___/___/______
- **URL testada**: _________________
- **Navegadores testados**: _________________
- **Dispositivos testados**: _________________
- **Problemas encontrados**: _________________
- **Correções aplicadas**: _________________
- **Status geral**: [ ] Aprovado [ ] Aprovado com ressalvas [ ] Reprovado
