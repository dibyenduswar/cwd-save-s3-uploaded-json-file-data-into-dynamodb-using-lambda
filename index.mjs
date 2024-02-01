import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import uniqid from 'uniqid';

const allowedBuckets = ['s3-test-bucket-24'];
const region = 'ap-south-1';
const s3Client = new S3Client({ region: region }); 

const client = new DynamoDBClient({region: region});
const dynamo = DynamoDBDocumentClient.from(client);
    
export async function handler(event) {
 
  let s3BucketName = event['Records'][0].s3.bucket.name; 
  let fileKey = event['Records'][0].s3.object.key;
  
  if( allowedBuckets.indexOf(s3BucketName) <0 ) return;
  let fileInfo = { Bucket: s3BucketName, Key: fileKey };

  console.log(fileInfo);
  
  let s3FileGetCommand = new GetObjectCommand(fileInfo);
  let s3FileResponse = await s3Client.send(s3FileGetCommand);

  let data = await s3FileResponse.Body.transformToString();
  let userData = null;
  
  try {
    userData = JSON.parse(data);      // converting string to JSON
  } catch(err) { return; }
  
  if(!userData.length) {
    let msg = `File ${fileKey} contains no data!`;
    return buildHTTPResponse(msg, 200);
  }
  
  const toBeSavedItems = userData.map(async (user) => {   // returning array of promises    
    return saveUser(user);
  });
  
  await Promise.all(toBeSavedItems);
  
  console.log('all-data  ' , userData);
  
  return buildHTTPResponse('Success', 200);
};

function buildHTTPResponse(msg, code = 200) {
  return  {
      statusCode: code,
      body: msg,
  };
}

async function saveUser(userinfo) {
  const tableName = "my-users-data";
  userinfo['id'] = uniqid();
  const params = {
    TableName: tableName,
    Item: userinfo
  };
  
  try{
    await dynamo.send(
      new PutCommand(params)
    );
  } catch(err) {
    console.log(err);
  }
}