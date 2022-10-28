Feature: A applicação pode baixar arquivos disponibilizado por outra api
  a aplicaçõar  pode baixar 100 registro de cada arquivo da API externa

  Scenario Outline: A aplicação deve baixar os arquivos disponibilizados pela API externa
    Given que a aplicação está disponível
    When a aplicação baixar os arquivos disponibilizados pela API externa um a um
    And descompacta o arquivo
    And faz a leitura de 100 registros de cada arquivo
    And adiciona os campos "updated_t" e "status" no registro
    Then a aplicação deve salvar os registros em um banco de dados
    And a aplicação deve remover os arquivos baixados assim que terminar a leitura