# Controle de Medicamentos - Projeto com AWS Lambda, API Gateway e Amplify

Este projeto consiste em uma aplicação que permite gerenciar medicamentos (adicionar, excluir, editar e listar) utilizando AWS Lambda para o backend, API Gateway para os endpoints e o Amplify para hospedar o frontend. O projeto inclui:

- 4 funções Lambda para as operações CRUD (Create, Read, Update, Delete).
- API Gateway com endpoints HTTP (GET, POST, PUT, DELETE, OPTIONS).
- Frontend hospedado no Amplify com integração ao backend.
- Configuração de CORS para permitir o acesso da aplicação frontend aos endpoints da API.

## Estrutura do Projeto

/controle-medicamentos
│
├── /lambdas
│   ├── createMedication.py
│   ├── getMedications.py
│   ├── updateMedication.py
│   └── deleteMedication.py
│
├── /frontend
│   ├── index.html
│   ├── script.js
│   ├── style.css
│   └── README.md
│
└── /api-gateway
    ├── config.yaml
    └── cors-config.json


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

3. **updateMedication (PUT)**:

    - Função responsável por atualizar os dados de um medicamento.
    
    ```
    import json
    import boto3

    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('Medications')

    def lambda_handler(event, context):
        body = json.loads(event['body'])
        medication_id = body['id']
        updated_name = body['name']
        updated_dosage = body['dosage']
        
        table.update_item(
            Key={'id': medication_id},
            UpdateExpression='SET #n = :name, dosage = :dosage',
            ExpressionAttributeNames={'#n': 'name'},
            ExpressionAttributeValues={
                ':name': updated_name,
                ':dosage': updated_dosage
            }
        )
        
        return {
            'statusCode': 200,
            'body': json.dumps({'message': f'Medicamento {updated_name} atualizado com sucesso!'}),
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        }
    ```

4. **deleteMedication (DELETE)**:

    - Função responsável por excluir um medicamento do DynamoDB.
    
    ```
    import json
    import boto3

    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('Medications')

    def lambda_handler(event, context):
        body = json.loads(event['body'])
        medication_id = body['id']
        
        table.delete_item(Key={'id': medication_id})
        
        return {
            'statusCode': 200,
            'body': json.dumps({'message': f'Medicamento {medication_id} excluído com sucesso!'}),
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        }
    ```

#### 2. Criação da API Gateway

A API Gateway foi configurada com os seguintes métodos para cada uma das funções Lambda:

**GET**: Listar todos os medicamentos.
**POST**: Adicionar um novo medicamento.
**PUT**: Atualizar um medicamento existente.
**DELETE**: Excluir um medicamento.
**OPTIONS**: Configurado para responder corretamente às requisições CORS.

## Configuração de CORS no API Gateway

Para garantir que o frontend possa fazer chamadas para os endpoints da API, foi configurado o CORS. No método OPTIONS de cada rota, os seguintes cabeçalhos foram configurados:

```
{
  "statusCode": 200,
  "headers": {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  }
}
```

#### 3. Criação e Deploy do Frontend (Amplify)
O frontend foi criado utilizando HTML e JavaScript simples e hospedado no AWS Amplify. O frontend faz requisições para os endpoints da API Gateway e utiliza JavaScript para adicionar, listar e remover medicamentos.


## Considerações Finais
Essa aplicação é um exemplo simples de um sistema CRUD utilizando AWS Lambda, API Gateway e Amplify. Para futuras melhorias, é possível adicionar autenticação utilizando Amazon Cognito e criar uma interface mais avançada utilizando frameworks como React ou Vue.js.

```
Esse arquivo `README.md` em formato Markdown contém todas as informações necessárias para a configuração e operação do seu projeto, desde as Lambdas, até a configuração do API Gateway e do Amplify.
```