# Controle de Medicamentos - Projeto com AWS Lambda, API Gateway e Amplify

Este projeto consiste em uma aplicação que permite gerenciar medicamentos (adicionar, excluir, editar e listar) utilizando AWS Lambda para o backend, API Gateway para os endpoints e o Amplify para hospedar o frontend. O projeto inclui:

- 4 funções Lambda para as operações CRUD (Create, Read, Update, Delete).
- API Gateway com endpoints HTTP (GET, POST, PUT, DELETE, OPTIONS).
- Frontend hospedado no Amplify com integração ao backend.
- Configuração de CORS para permitir o acesso da aplicação frontend aos endpoints da API.

## Estrutura do Projeto

### Backend (AWS Lambda)

O backend consiste em 4 funções Lambda responsáveis por lidar com as operações de manipulação de medicamentos no banco DynamoDB.

- **POST**: Cria um medicamento no DynamoDB.
- **GET**: Retorna todos os medicamentos cadastrados.
- **PUT**: Atualiza um medicamento.
- **DELETE**: Exclui um medicamento.

#### 1. Criação das Funções Lambda

1. **createMedication (POST)**:
   - Linguagem: Python
   - Função responsável por adicionar medicamentos ao DynamoDB.

   ```
   import json
   import boto3
   import uuid

   dynamodb = boto3.resource('dynamodb')
   table = dynamodb.Table('Medications')

   def lambda_handler(event, context):
       body = json.loads(event['body'])
       medication_id = str(uuid.uuid4())
       medication_name = body['name']
       dosage = body['dosage']
       
       table.put_item(
           Item={
               'id': medication_id,
               'name': medication_name,
               'dosage': dosage
           }
       )
       
       return {
           'statusCode': 200,
           'body': json.dumps({'message': f'Medicamento {medication_name} adicionado com sucesso!'}),
           'headers': {
               'Access-Control-Allow-Origin': '*',
               'Access-Control-Allow-Headers': 'Content-Type'
           }
       }
    ```
2. **getMedications (GET)**:
   - Função responsável por listar todos os medicamentos cadastrados.
   
   ```
    import json
    import boto3

    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('Medications')

    def lambda_handler(event, context):
        response = table.scan()
        medications = response['Items']
        
        return {
            'statusCode': 200,
            'body': json.dumps(medications),
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        }
    ```
