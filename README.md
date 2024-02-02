# cwd-save-s3-uploaded-json-file-data-into-dynamodb-using-lambda
This repo contains the JavaScript Lambda code that saves s3 uploaded JSON data into DynamoDB

Role statements for Lambda function:

```
  {
	"Version": "2012-10-17",
	"Statement": [
		{
			"Effect": "Allow",
			"Action": "logs:CreateLogGroup",
			"Resource": "arn:aws:logs:ap-south-1:842551175243:*"
		},
		{
			"Effect": "Allow",
			"Action": [
				"logs:CreateLogStream",
				"logs:PutLogEvents"
			],
			"Resource": [
				"arn:aws:logs:ap-south-1:842551175243:log-group:/aws/lambda/my-lambda:*"
			]
		},
		{
			"Effect": "Allow",
			"Action": [
				"s3:GetObject",
				"s3:PutObject"
			],
			"Resource": "arn:aws:s3:::s3-test-bucket-25"
		},
		{
			"Effect": "Allow",
			"Action": [
				"dynamodb:PutItem"
			],
			"Resource": "arn:aws:dynamodb:ap-south-1:842551175243:table/my-users-data"
		}
	]
}
```
